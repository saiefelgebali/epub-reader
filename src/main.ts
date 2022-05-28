import { Epub } from "./epub";
import { setupFileSelect } from "./file-select";
import "./style.css";

interface AppState {
	file: File | null;
}

const state: AppState = {
	// The file that was selected
	file: null,
};

async function handleFileSelect(file: File) {
	state.file = file;

	// If the file is an epub, use the epub reader
	if (file.type === "application/epub+zip") {
		const book = await Epub.fromFile(file);

		// render the book
		for (let i = 0; i < book.spine.items.length; i++) {
			const page = await book.getSpineEntryHTML(i);
			document.body.appendChild(page);
		}
	}
}

function setup() {
	setupFileSelect(handleFileSelect);
}

setup();
