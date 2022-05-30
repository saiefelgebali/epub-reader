/**
 * Convert blobs to an object with this interface,
 * to be used in the IndexedDB database.
 * This is done to prevent WebKitBlobResource error 1 on IOS,
 * based on https://stackoverflow.com/q/68386273/18089257
 */
export interface WebkitBlob {
	buffer: ArrayBuffer;
	type: string;
}
