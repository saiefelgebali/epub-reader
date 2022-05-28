import * as zip from "@zip.js/zip.js";
import { EpubFileSystem } from "./epub.file.system";
import { Spine } from "./epub.manifest";

export class Epub {
	constructor(public fileSystem: EpubFileSystem, public spine: Spine) {}

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

		// return the epub
		return new Epub(fileSystem, spine);
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

	public async getSpineEntryHTML(index: number): Promise<Node> {
		const spineItem = this.spine.items[index];
		if (!spineItem) throw new Error("Invalid spine index");

		const itemPath = spineItem.href;

		const file = await this.fileSystem.getFile(itemPath);
		const doc = await file.getDocument();
		await this.populateDomImages(doc);

		const pageElement = document.createElement("div");
		pageElement.classList.add("page");
		pageElement.append(...Array.from(doc.body.childNodes));
		return pageElement;
	}
}
