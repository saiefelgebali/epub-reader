import { createSignal } from "solid-js";
import { Epub } from "../books/epub";
import { Book, BookEntity } from "../db/book.entity";
import { db } from "../db/db";

// Retrieve all books from the database
const savedBooks = await db.books.toArray();
const savedBooksTable = savedBooks.reduce<{ [id: string]: Book }>(
	(acc, book) => ({ ...acc, [book.id]: Book.fromEntity(book) }),
	{}
);

export const [books, setBooks] = createSignal<{ [id: string]: Book }>(
	savedBooksTable
);
