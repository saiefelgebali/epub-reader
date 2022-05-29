import Dexie, { Table } from "dexie";
import { Epub } from "./epub/epub";

export interface Book {
	id: string;
	book: Epub;
}

class ReadbaliDexie extends Dexie {
	public books!: Table<Book>;

	constructor() {
		super("ReadbaliDB");
		this.version(1).stores({
			books: "id",
		});
	}
}

export const db = new ReadbaliDexie();
