import { createSignal } from "solid-js";
import { Epub } from "./epub/epub";

export const [books, setBooks] = createSignal<Epub[]>([]);
