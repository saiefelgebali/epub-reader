import { WebkitBlob } from "./webkit.blob";

export type BookType = "epub" | "pdf";

export interface BookMetaData {
	title: string;
	author: string;
}

export interface BookEntity {
	id: string;
	metadata: BookMetaData;
	lastRead: Date;
	type: BookType;
	file: WebkitBlob;
	coverImage: WebkitBlob;
}

export class Book {
	public coverImageUrl: string;

	constructor(
		public id: string,
		public metadata: BookMetaData,
		public lastRead: Date,
		public type: BookType,
		public file: Blob,
		public coverImage: Blob
	) {
		this.coverImageUrl = URL.createObjectURL(coverImage);
	}

	public static fromEntity(entity: BookEntity): Book {
		return new Book(
			entity.id,
			entity.metadata,
			entity.lastRead,
			entity.type,
			new Blob([entity.file.buffer], { type: entity.file.type }),
			new Blob([entity.coverImage.buffer], {
				type: entity.coverImage.type,
			})
		);
	}
}
