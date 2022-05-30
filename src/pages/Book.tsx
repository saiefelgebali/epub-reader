import { useParams } from "solid-app-router";
import { createEffect, createMemo, Ref } from "solid-js";
import { books } from "../store";

const Book = () => {
	const id = useParams().id;
	let bookContainer: HTMLDivElement | undefined;

	const getBookNode = createMemo(async () => {
		const book = books().find((book) => book.id === id);
		return await book?.getHTMLNode();
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
