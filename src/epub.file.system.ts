import * as zip from "@zip.js/zip.js";

export class EpubFileSystem {
	private fileMap: Map<string, EpubFile> = new Map();
	constructor(public files: EpubFile[]) {
		files.forEach((f) => {
			this.fileMap.set(f.path, f);
		});
	}

	static async fromZipEntries(entries: zip.Entry[]): Promise<EpubFileSystem> {
		const fileEntries = entries.filter((e) => !e.directory);
		const files = await Promise.all(fileEntries.map(EpubFile.fromZipEntry));
		return new EpubFileSystem(files);
	}

	async getFile(path: string): Promise<EpubFile> {
		// Handle relative paths
		const splitPath = path.split("/").map((p) => {
			if (p === ".." || p === ".") {
				return "";
			}
			return p;
		});
		const joinedPath = splitPath.join("/");
		const parsedPath = joinedPath.startsWith("/")
			? joinedPath.slice(1)
			: joinedPath;

		// Try to find the file in the map
		let file = this.fileMap.get(parsedPath);
		if (file) return file;

		// Otherwise, path is incomplete,
		// so try to find a file that shares the same filename
		file = this.files.find((f) => f.path.endsWith(parsedPath));
		if (file) return file;

		throw new Error(`File not found: ${parsedPath}`);
	}
}

class EpubFile {
	private url?: string;
	constructor(public path: string, public blob: Blob) {}

	static async fromZipEntry(entry: zip.Entry): Promise<EpubFile> {
		if (entry.directory || !entry.getData) {
			throw new Error("Not a file");
		}
		const writer = new zip.BlobWriter();
		const blob = await entry.getData(writer);
		const path = entry.filename;
		return new EpubFile(path, blob);
	}

	public getURL() {
		if (!this.url) {
			this.url = URL.createObjectURL(this.blob);
		}

		return this.url;
	}

	public async getText() {
		return await this.blob.text();
	}

	public async getDocument() {
		const parser = new DOMParser();
		return parser.parseFromString(await this.getText(), "text/xml");
	}
}
