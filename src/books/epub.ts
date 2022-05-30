import * as zip from "@zip.js/zip.js";
import { db } from "../db";
import { EpubFile, EpubFileSystem } from "./epub.file.system";
import { Spine } from "./epub.manifest";
import { v4 as uuidv4 } from "uuid";

export class Epub {
	constructor(
		public id: string,
		public fileSystem: EpubFileSystem,
		public spine: Spine,
		public coverImage?: EpubFile | null
	) {}

	public static async fromFile(epub: File) {
		// unzip the epub
		const epubBlob = new zip.BlobReader(epub);
		const zipReader = new zip.ZipReader(epubBlob);
		const entries = await zipReader.getEntries();

		// parse files from the epub
		const fileSystem = await EpubFileSystem.fromZipEntries(entries);

		// find the container file
		const containerFile = await fileSystem.getFile(
			"META-INF/container.xml"
		);
		const containerDoc = await containerFile.getDocument();

		// find the rootfile
		const rootfile = containerDoc.querySelector("rootfile");
		if (!rootfile) throw new Error("Invalid container.xml: No rootfile");

		// find the rootfile path
		const rootfilePath = rootfile.getAttribute("full-path");
		if (!rootfilePath)
			throw new Error("Invalid container.xml: No rootfile path");

		// find the opf file
		const opfFile = await fileSystem.getFile(rootfilePath);
		const opfDoc = await opfFile.getDocument();

		// extract the spine
		const spine = Spine.fromDocument(opfDoc);

		// Get the cover image from first spine item
		const coverPageHref = spine.items[0].href;
		const coverPageFile = await fileSystem.getFile(coverPageHref);
		const coverPageDoc = await coverPageFile.getDocument();
		const coverImageSrc =
			coverPageDoc.querySelector("img")?.getAttribute("src") ||
			coverPageDoc.querySelector("image")?.getAttribute("xlink:href") ||
			null;
		if (!coverImageSrc) throw new Error("Could not find cover image src");
		const coverImage = await fileSystem.getFile(coverImageSrc);

		const id = uuidv4();
		const book = new Epub(id, fileSystem, spine, coverImage);

		await db.books.add({
			id,
			book,
		});

		// return the epub
		return book;
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
						link.onclick = (e) => {
							e.preventDefault();
							window.location.hash = target.id;
						};
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
				link.onclick = (e) => {
					e.preventDefault();
					window.location.hash = file.path;
				};
				return;
			} catch (e) {
				// file not found
				console.log("Could not find file", path);
				return;
			}
		});
	}

	public async getSpineEntryHTML(index: number): Promise<Node> {
		const spineItem = this.spine.items[index];
		if (!spineItem) throw new Error("Invalid spine index");

		const itemPath = spineItem.href;

		const file = await this.fileSystem.getFile(itemPath);
		const doc = await file.getDocument();

		// populate images in the element
		await this.populateDomImages(doc as Document);

		const pageElement = document.createElement("div");
		pageElement.classList.add("page");
		pageElement.id = file.path;
		pageElement.append(...Array.from(doc.body.childNodes));
		return pageElement;
	}

	public async getHTMLNode() {
		const root = document.createDocumentFragment().getRootNode();
		// render the book
		for (let i = 0; i < this.spine.items.length; i++) {
			const page = await this.getSpineEntryHTML(i);
			root.appendChild(page);
		}

		// populate the dom links
		await this.populateDomLinks(root as Document);

		return root;
	}

	public async renderTo(element: Node) {
		const root = await this.getHTMLNode();
		element.appendChild(root);
	}
}
