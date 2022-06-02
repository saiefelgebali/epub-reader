import nProgress from "nprogress";
import { useParams } from "solid-app-router";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { Epub } from "../books/epub";
import Header from "../components/Header";
import Icon from "../components/Icon";
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
		const epub = await Epub.fromBook(book());
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
	let mainElement: HTMLElement | undefined;

	const pageScroll = () => {
		window.scrollBy({
			top: scroll(),
		});

		scrollTimeout = setTimeout(pageScroll, 50);
	};

	const startScroll = () => {
		if (!containerRef) return;
		mainElement = document.querySelector("main") || undefined;
		if (!mainElement) return;

		mainElement.addEventListener("pointerdown", () => setScroll(0), {
			once: true,
		});
		mainElement.addEventListener("touchstart", () => setScroll(0), {
			once: true,
		});
		pageScroll();
	};

	const stopScroll = () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = undefined;
	};

	createEffect(() => {
		if (scroll() === 0) return stopScroll();
		else if (!scrollTimeout) startScroll();
	});

	onCleanup(() => {
		clearTimeout(scrollTimeout);
		if (!mainElement) return;
		mainElement.removeEventListener("pointerdown", () => setScroll(0));
		mainElement.removeEventListener("touchstart", () => setScroll(0));
	});

	return (
		<>
			<Header />
			<Main styles='max-w-xl mx-auto'>
				{book() && (
					<div class=' w-full min-h-screen flex items-center'>
						<img src={book().coverImageUrl}></img>
					</div>
				)}

				<div ref={containerRef}></div>
			</Main>
			<button
				class='h-32 w-32 fixed bottom-0 right-0 cursor-pointer touch-none flex justify-end items-end'
				onclick={(e) => {
					e.preventDefault();
					setScroll((prev) => (prev == 2 ? 0 : prev + 1));
				}}>
				<div class='h-16 w-16 mr-4 mb-8 bg-white dark:bg-background-900 shadow-md flex items-center justify-center rounded-full select-none'>
					{scroll() == 0 ? (
						<Icon icon='play' />
					) : scroll() == 1 ? (
						<Icon icon='fastForward' />
					) : (
						<Icon icon='pause' />
					)}
				</div>
			</button>
		</>
	);
};

export default BookPage;
