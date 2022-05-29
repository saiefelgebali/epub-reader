import { Epub } from "./epub";
import { setupFileSelect } from "./file-select";
import "./style.css";

interface AppState {
	book: Epub | null;
}

const state: AppState = {
	book: null,
};

async function handleFileSelect(file: File) {
	const bookContainer = document.getElementById("book-container");
	if (!bookContainer) throw new Error("Book container not found");

	// If the file is an epub, use the epub reader
	if (file.type === "application/epub+zip") {
		const book = await Epub.fromFile(file);
		book.renderTo(bookContainer);
		state.book = book;
	}
}

function setup() {
	setupFileSelect(handleFileSelect);
}

setup();
