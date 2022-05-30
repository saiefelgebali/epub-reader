export interface BookEntity {
	id: string;
	title: string;
	author: string;
	file: {
		buffer: ArrayBuffer;
		type: string;
	};
	coverImage: { buffer: ArrayBuffer; type: string };
	lastRead: Date;
}
