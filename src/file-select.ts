import { $ } from "./utility";

export function setupFileSelect(callback: (file: File) => void) {
	// Handle file selection
	const fileSelect = $<HTMLInputElement>("#file-select");

	fileSelect.addEventListener("change", (e: Event) => {
		const target = e.currentTarget as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			callback(file);
		}
	});
}
