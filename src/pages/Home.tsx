import { Link } from "solid-app-router";
import { Component, createMemo, For } from "solid-js";
import { Epub } from "../books/epub";
import { BookEntity } from "../db/book.entity";
import { db } from "../db/db";
import { books, setBooks } from "../store";

const BookPreview: Component<{ book: BookEntity }> = ({ book }) => {
	const coverImageSrc = createMemo(() => {
		const image = new Blob([book.coverImage.buffer], {
			type: book.coverImage.type,
		});
		return URL.createObjectURL(image);
	}, [book]);
	return (
		<div>
			<Link href={`/book/${book.id}`}>
				<img
					class='w-full rounded-lg shadow-md shadow-background-900'
					src={coverImageSrc()}
					alt=''
				/>
			</Link>
		</div>
	);
};

const Home = () => {
	async function handleAddBook(e: Event) {
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		const file = target.files?.item(0);
		if (!file) return;
		const newBook = await Epub.fromBlob(file);
		const newBookEntity = await newBook.save();
		setBooks((prev) => [...prev, newBookEntity]);
	}

	return (
		<div>
			<header class='bg-background-800 shadow-md shadow-background-800 sticky top-0'>
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

			<main class='container py-8'>
				<h1 class='text-4xl font-bold mb-8'>Books</h1>
				<button
					class='mb-8'
					onclick={() => {
						db.books.clear();
					}}>
					Clear Database
				</button>
				<div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end'>
					<For each={books()}>
						{(book) => <BookPreview book={book} />}
					</For>
					<label
						for='input-book'
						class='bg-background-900 w-full h-full rounded-lg shadow-md shadow-background-900 cursor-pointer aspect-square'>
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

export default Home;
