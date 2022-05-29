import { Link } from "solid-app-router";
import { Component, createMemo, For } from "solid-js";
import { Epub } from "../epub/epub";
import { books, setBooks } from "../store";

const BookPreview: Component<{ book: Epub }> = ({ book }) => {
	const coverImageSrc = createMemo(() => book.coverImage?.getURL(), [book]);
	return (
		<Link href={`/book/${book.id}`}>
			<img
				class='w-full rounded-lg shadow-md shadow-background-900'
				src={coverImageSrc()}
				alt=''
			/>
		</Link>
	);
};

const Home = () => {
	async function handleAddBook(e: Event) {
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		const file = target.files?.item(0);
		if (!file) return;
		const newBook = await Epub.fromFile(file);
		setBooks((prev) => [...prev, newBook]);
	}

	return (
		<div>
			<header class='shadow-md shadow-background-900'>
				<nav class='container flex justify-between items-center py-6'>
					<a href='/' class='font-bold'>
						Readbali
					</a>
					<Link href='/settings'>Settings</Link>
				</nav>
			</header>

			<main class='container py-8'>
				<h1 class='text-4xl font-bold mb-8'>Books</h1>
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
