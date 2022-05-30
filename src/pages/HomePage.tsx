import { Link } from "solid-app-router";
import { Component, For, Suspense } from "solid-js";
import { Epub } from "../books/epub";
import { Book, BookEntity } from "../db/book.entity";
import { db } from "../db/db";
import { books, setBooks } from "../store";

const BookPreview: Component<{ book: Book }> = ({ book }) => {
	return (
		<div>
			<Link href={`/book/${book.id}`}>
				<img
					class='w-full rounded-lg shadow-md dark:shadow-background-900'
					src={book.coverImageUrl}
					alt=''
				/>
			</Link>
		</div>
	);
};

const HomePage = () => {
	async function handleAddBook(e: Event) {
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		const file = target.files?.item(0);
		if (!file) return;
		const newEpub = await Epub.fromBlob(file);
		const newBookEntity = await newEpub.save();
		const newBook = Book.fromEntity(newBookEntity);
		setBooks((prev) => ({ ...prev, [newBook.id]: newBook }));
	}

	return (
		<div>
			<header class='bg-gray-50  dark:bg-background-800 border-b dark:border-background-900 sticky top-0 transition-colors'>
				<nav class='container flex justify-between items-center py-6'>
					<a
						href='/'
						onclick={() => window.location.reload()}
						class='font-bold'>
						Readbali
					</a>
					<Link href='/settings'>Settings</Link>
				</nav>
			</header>

			<button
				onclick={() =>
					document.querySelector("html")?.classList.toggle("dark")
				}>
				Toggle
			</button>

			<main class='container py-8'>
				<h1 class='text-4xl font-bold mb-8'>Books</h1>
				<button
					class='mb-8'
					onclick={() => {
						db.books.clear();
						setBooks({});
					}}>
					Clear Database
				</button>
				<div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end'>
					<For each={Object.values(books())}>
						{(book) => <BookPreview book={book} />}
					</For>

					<label
						for='input-book'
						class='dark:bg-background-900  dark:shadow-background-900 w-full h-full rounded-lg shadow-md  cursor-pointer'
						style={{ "aspect-ratio": "2/3" }}>
						<div class='h-full flex justify-center items-center select-none font-bold text-xl'>
							Add a book
						</div>
						<input
							type='file'
							id='input-book'
							class='hidden'
							oninput={handleAddBook}
						/>
					</label>
				</div>
			</main>
		</div>
	);
};

export default HomePage;
