import { db } from "../db/db";
import { EpubFile, EpubFileSystem } from "./epub.file.system";
import { v4 as uuidv4 } from "uuid";
import { Book, BookEntity } from "../db/book.entity";
import { BlobReader, Entry, ZipReader } from "@zip.js/zip.js";
import { EpubOPF } from "./epub.opf";
import { setBooks } from "../store";

async function unzip(blob: Blob): Promise<Entry[]> {
	// unzip the epub
	const blobReader = new BlobReader(blob);
	const zipReader = new ZipReader(blobReader);
	return await zipReader.getEntries();
}

export class Epub {
	constructor(
		public id: string,
		public file: Blob,
		public opf: EpubOPF,
		public fileSystem: EpubFileSystem,
		public coverImage: EpubFile
	) {}

	public static async fromBook(book: Book) {
		const fileSystem = await this.getFileSystem(book.file);
		const opf = await this.getOPF(fileSystem);
		const coverImage = await this.getCoverImage(opf, fileSystem);

		return new Epub(book.id, book.file, opf, fileSystem, coverImage);
	}

	public static async fromBlob(epub: Blob) {
		const fileSystem = await this.getFileSystem(epub);
		const opf = await this.getOPF(fileSystem);
		const coverImage = await this.getCoverImage(opf, fileSystem);

		const id = uuidv4();
		return new Epub(id, epub, opf, fileSystem, coverImage);
	}

	private static async getFileSystem(epub: Blob): Promise<EpubFileSystem> {
		const entries = await unzip(epub);
		return EpubFileSystem.fromZipEntries(entries);
	}

	private static async getOPF(fileSystem: EpubFileSystem): Promise<EpubOPF> {
		// find the container file
		const container = await (
			await fileSystem.getFile("META-INF/container.xml")
		).getDocument();

		// find the rootfile path
		const rootfilePath = container
			.querySelector("rootfile")
			?.getAttribute("full-path");
		if (!rootfilePath)
			throw new Error("Invalid container.xml: No rootfile path");

		// parse the opf file
		const opfFile = await fileSystem.getFile(rootfilePath);
		const opf = await EpubOPF.fromDocument(
			await opfFile.getDocument(),
			fileSystem
		);

		return opf;
	}

	public static async getCoverImage(
		opf: EpubOPF,
		fileSystem: EpubFileSystem
	) {
		// Get the cover image from first spine item
		const coverPage = await opf.spine[0].getDocument();
		const coverImageSrc =
			coverPage.querySelector("img")?.getAttribute("src") ||
			coverPage.querySelector("image")?.getAttribute("xlink:href");
		if (!coverImageSrc) throw new Error("Could not find cover image src");
		const coverImage = await fileSystem.getFile(coverImageSrc);

		return coverImage;
	}

	public async save() {
		const entity: BookEntity = {
			id: this.id,
			metadata: this.opf.metadata,
			coverImage: {
				buffer: await this.coverImage.blob.arrayBuffer(),
				type: this.coverImage.blob.type,
			},
			file: {
				buffer: await this.file.arrayBuffer(),
				type: this.file.type,
			},
			lastRead: new Date(),
			type: "epub",
		};

		await db.books.add(entity);

		return entity;
	}

	private async populateDomImages(doc: Document) {
		const imgs = Array.from(doc.querySelectorAll("img"));
		imgs.forEach(async (img) => {
			const src = img.getAttribute("src");
			if (!src) return;

			const file = await this.fileSystem.getFile(src);
			const url = file.getURL();
			img.setAttribute("src", url);
		});

		const images = Array.from(doc.querySelectorAll("image"));
		images.forEach(async (img) => {
			const src = img.getAttribute("xlink:href");
			if (!src) return;
			const file = await this.fileSystem.getFile(src);
			const url = file.getURL();
			img.setAttribute("xlink:href", url);
		});

		return doc;
	}

	private async populateDomLinks(doc: Document) {
		const links = Array.from(
			doc.querySelectorAll<HTMLLinkElement>("a[href]")
		);

		// For each link in the document, find its target.
		// If it is an internal link, find the target dom element
		// and point to it
		links.forEach(async (link) => {
			const href = link.getAttribute("href");
			if (!href) return;

			// ignore absolute url
			if (href.indexOf("://") > -1) return;

			// ignore fragment
			if (href.indexOf("#") === 0) return;

			const hrefParts = href.split("#");
			const path = hrefParts[0];
			const hash = hrefParts.length > 1 ? hrefParts[1] : null;

			// If there is a hash, try to find the target element
			if (hash) {
				try {
					const target = doc.getElementById(hash);
					if (target) {
						link.setAttribute("href", `#${target.id}`);
						link.addEventListener("click", (e) => {
							e.preventDefault();
							window.location.hash = target.id;
						});
						return;
					}
				} catch {
					// ignore
				}
			}

			// If the hash is not found, try find the target file
			try {
				const file = await this.fileSystem.getFile(path);
				const target = doc.getElementById(file.path);
				if (!target) return;
				link.setAttribute("href", `#${file.path}`);
				link.addEventListener("click", (e) => {
					e.preventDefault();
					window.location.hash = file.path;
				});
				return;
			} catch (e) {
				// file not found
				console.log("Could not find file", path);
				return;
			}
		});
	}

	public async getSpineEntryHTML(index: number): Promise<Node> {
		const item = this.opf.spine[index];
		const doc = await item.getDocument();

		// populate images in the element
		await this.populateDomImages(doc as Document);

		const pageElement = document.createElement("div");
		pageElement.id = item.path;
		pageElement.classList.add("chapter");
		pageElement.append(...Array.from(doc.body.childNodes));

		return pageElement;
	}

	public async getHTMLElement() {
		const root = document.createDocumentFragment().getRootNode();

		// Render each sections in the book
		// Skip the cover page
		for (let i = 1; i < this.opf.spine.length; i++) {
			const page = await this.getSpineEntryHTML(i);
			root.appendChild(page);
		}

		// populate the dom links
		await this.populateDomLinks(root as Document);

		const bookHtml = document.createElement("div");
		bookHtml.classList.add("book");
		bookHtml.append(...root.childNodes);

		// Update lastRead
		await db.books.update(this.id, {
			lastRead: new Date(),
		});

		// update book cache
		const newBook = await db.books.get(this.id);
		if (newBook) {
			setBooks((prev) => ({
				...prev,
				[this.id]: Book.fromEntity(newBook),
			}));
		}

		return bookHtml;
	}
}
