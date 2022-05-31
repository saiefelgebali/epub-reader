import nProgress from "nprogress";
import { Link, useParams } from "solid-app-router";
import { createEffect, createSignal, onCleanup } from "solid-js";
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
	const [scroll, setScroll] = createSignal(0);

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

	// Control auto scroll
	let scrollTimeout: number | undefined;
	createEffect(() => {
		if (scrollTimeout) clearTimeout(scrollTimeout);
		if (scroll() === 0) return;
		const pageScroll = () => {
			window.scrollBy(0, scroll());
			scrollTimeout = window.setTimeout(pageScroll, 10);
		};
		pageScroll();
	});
	onCleanup(() => {
		if (scrollTimeout) clearTimeout(scrollTimeout);
	});

	return (
		<>
			<Header />
			<Main styles='max-w-xl'>
				{book() && (
					<div class=' w-full min-h-screen flex items-center'>
						<img src={book().coverImageUrl}></img>
					</div>
				)}

				<div ref={containerRef}></div>

				<button
					class='h-16 w-16 bg-background-900 shadow-sm fixed bottom-8 right-4 flex items-center justify-center rounded-full select-none cursor-pointer touch-manipulation'
					onclick={() =>
						setScroll((prev) => (prev == 2 ? 0 : prev + 1))
					}>
					{scroll()}
				</button>
			</Main>
		</>
	);
};

export default BookPage;
