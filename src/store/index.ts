import { createSignal } from "solid-js";
import { BookEntity } from "../db/book.entity";
import { db } from "../db/db";

export const [books, setBooks] = createSignal<BookEntity[]>(
	await db.getBooks()
);
