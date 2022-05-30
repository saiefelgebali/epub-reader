import { useParams } from "solid-app-router";
import { createEffect, createMemo } from "solid-js";
import { Epub } from "../books/epub";
import { books } from "../store";

const Book = () => {
	const id = useParams().id;
	let bookContainer: HTMLDivElement | undefined;

	const getBookNode = createMemo(async () => {
		const book = books().find((book) => book.id === id);
		if (!book) throw new Error("Book not found");

		const blob = new Blob([book.file.buffer], { type: book.file.type });
		const epub = await Epub.fromBlob(blob);
		return await epub.getHTMLNode();
	});

	createEffect(async () => {
		if (!bookContainer) return;

		const bookNode = await getBookNode();
		if (!bookNode) return;

		bookContainer.appendChild(bookNode);
	}, [bookContainer]);

	return <div ref={bookContainer}></div>;
};

export default Book;
