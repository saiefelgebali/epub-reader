import Dexie, { Table } from "dexie";
import { BookEntity } from "./book.entity";

class ReadbaliDexie extends Dexie {
	public books!: Table<BookEntity>;

	constructor() {
		super("ReadbaliDB");
		this.version(1).stores({
			books: "id, lastRead",
		});
	}
}

export const db = new ReadbaliDexie();
