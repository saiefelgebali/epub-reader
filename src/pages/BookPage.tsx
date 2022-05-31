import nProgress from "nprogress";
import { Link, useParams } from "solid-app-router";
import { createEffect, createSignal } from "solid-js";
import { Epub } from "../books/epub";
import Header from "../components/Header";
import Main from "../components/Main";
import { Book } from "../db/book.entity";
import { db } from "../db/db";
import { books } from "../store";

const BookPage = () => {
	nProgress.start();
	const id = useParams().id;

	let containerRef: HTMLDivElement | undefined = undefined;

	// Try to load the book from the store first
	const [book, setBook] = createSignal(books()[id]);

	const getBookHTMLElement = async () => {
		const epub = await Epub.fromBlob(book().file);
		return await epub.getHTMLElement();
	};

	// Set the book HTML on book load
	createEffect(async () => {
		if (!book() || !containerRef) return;
		const bookHTMLElement = await getBookHTMLElement();
		containerRef.appendChild(bookHTMLElement);
		nProgress.done();
	}, [book]);

	const fetchBook = async () => {
		// If the book is already in the store, return it
		if (book()) return;

		// If the book is not loaded yet, load it from the database
		const res = await db.books.get(id);

		// If the book is not found, navigate to the home page
		if (!res) return (window.location.href = "/");

		setBook(Book.fromEntity(res));
	};

	fetchBook();

	return (
		<>
			<Header />
			<Main styles='max-w-xl'>
				{book() && (
					<div class='w-full min-h-screen flex items-center'>
						<img src={book().coverImageUrl}></img>
					</div>
				)}
				<div ref={containerRef}></div>
			</Main>
		</>
	);
};

export default BookPage;
