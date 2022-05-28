export class Spine {
	constructor(public items: ManifestItem[]) {}

	static fromDocument(doc: Document): Spine {
		const manifest = EpubManifest.fromDocument(doc);

		const items = Array.from(doc.querySelectorAll("spine > itemref"));
		const spineItems = items.map((item) => {
			const id = item.getAttribute("idref");
			if (!id) throw new Error("Invalid Spine: No idref");

			const manifestItem = manifest.manifestMap.get(id);
			if (!manifestItem)
				throw new Error("Invalid Spine: Missing manifest item");

			return manifestItem;
		});

		return new Spine(spineItems);
	}
}

class EpubManifest {
	constructor(public manifestMap: Map<string, ManifestItem>) {}

	static fromDocument(doc: Document): EpubManifest {
		const manifest = doc.querySelector("manifest");
		if (!manifest) {
			throw new Error("Invalid OPF: No manifest");
		}

		const items = Array.from(manifest.querySelectorAll("item"));

		const manifestMap: Map<string, ManifestItem> = new Map();

		items.forEach((item) => {
			const id = item.getAttribute("id");
			const href = item.getAttribute("href");
			const mediaType = item.getAttribute("media-type");
			if (!id || !href || !mediaType) {
				throw new Error("Invalid EpubManifest: Invalid item");
			}
			manifestMap.set(id, new ManifestItem(id, href, mediaType));
		});

		return new EpubManifest(manifestMap);
	}

	public getItem(id: string): ManifestItem {
		const item = this.manifestMap.get(id);
		if (!item) throw new Error("Invalid EpubManifest: Missing item");
		return item;
	}
}

class ManifestItem {
	constructor(
		public id: string,
		public href: string,
		public mediaType: string
	) {}
}
