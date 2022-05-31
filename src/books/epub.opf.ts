import { BookMetaData } from "../db/book.entity";
import { EpubFile, EpubFileSystem } from "./epub.file.system";

export class EpubOPF {
	constructor(public metadata: BookMetaData, public spine: EpubFile[]) {}

	static async fromDocument(opf: XMLDocument, fileSystem: EpubFileSystem) {
		const metadata = EpubOPF.getMetadata(opf);
		const spine = await EpubOPF.getSpine(opf, fileSystem);
		return new EpubOPF(metadata, spine);
	}

	/**
	 * Extract the manifest files from the OPF,
	 * and index them by their ids
	 */
	static async getManifestMap(opf: XMLDocument, fileSystem: EpubFileSystem) {
		const manifest = opf.querySelector("manifest");
		if (!manifest) {
			throw new Error("Invalid OPF: No manifest");
		}

		const items = Array.from(manifest.querySelectorAll("item"));
		const manifestFileMap = new Map<string, EpubFile>();

		for (const item of items) {
			const id = item.getAttribute("id");
			const href = item.getAttribute("href");
			const mediaType = item.getAttribute("media-type");
			if (!id || !href || !mediaType) {
				throw new Error("Invalid OPF: Missing manifest item");
			}

			const file = await fileSystem.getFile(href);
			if (!file) {
				throw new Error(`Invalid OPF: Missing file at ${href}`);
			}

			manifestFileMap.set(id, file);
		}

		return manifestFileMap;
	}

	/**
	 * Gets the spine items, represented as an ordered array of the spine files
	 */
	static async getSpine(opf: XMLDocument, fileSystem: EpubFileSystem) {
		// get the manifest files indexed by id
		const manifestFileMap = await EpubOPF.getManifestMap(opf, fileSystem);

		const items = Array.from(opf.querySelectorAll("spine > itemref"));

		return items.map((item) => {
			const id = item.getAttribute("idref");
			if (!id) throw new Error("Invalid Spine: No idref");

			const file = manifestFileMap.get(id);
			if (!file) throw new Error("Invalid Spine: Missing spine file");

			return file;
		});
	}

	/**
	 * Gets the book metadata from the OPF
	 */
	static getMetadata(opf: XMLDocument) {
		const meta = opf.querySelector("metadata");
		if (!meta) throw new Error("Invalid opf: No metadata");

		const getMeta = (name: string) => {
			const tag = meta.getElementsByTagName(name)[0].textContent;
			if (!tag)
				throw new Error(`Invalid opf: Missing metadata tag ${name}`);
			return tag;
		};

		const metadata: BookMetaData = {
			title: getMeta("dc:title"),
			author: getMeta("dc:creator"),
		};

		return metadata;
	}
}
