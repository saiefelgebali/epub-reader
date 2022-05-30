import { createSignal } from "solid-js";
import { Epub } from "../books/epub/epub";

export const [books, setBooks] = createSignal<Epub[]>([]);
