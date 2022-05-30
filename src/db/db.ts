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

	async getBooks(
		offset: number = 0,
		limit: number = 10
	): Promise<BookEntity[]> {
		return await this.books
			.orderBy("lastRead")
			.offset(offset)
			.limit(limit)
			.toArray();
	}
}

export const db = new ReadbaliDexie();
