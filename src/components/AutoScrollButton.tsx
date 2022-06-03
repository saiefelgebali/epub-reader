import {
	Accessor,
	Component,
	createEffect,
	createSignal,
	onCleanup,
	Setter,
} from "solid-js";
import Icon from "./Icon";

interface AutoScrollButtonProps {}

const AutoScrollButton: Component<AutoScrollButtonProps> = ({}) => {
	const [scroll, setScroll] = createSignal(0);

	// Control auto scroll
	let scrollInterval: number | undefined;
	let mainElement: HTMLElement | undefined;

	const pageScroll = () => {
		window.scrollBy({
			top: scroll(),
		});
	};

	const startScroll = () => {
		scrollInterval = setInterval(pageScroll, 10);
		mainElement?.addEventListener("pointerdown", () => setScroll(0), {
			once: true,
		});
	};

	const stopScroll = () => {
		clearTimeout(scrollInterval);
		scrollInterval = undefined;
	};

	createEffect(() => {
		if (!mainElement) {
			mainElement = document.querySelector("main")!;
		}
		if (scroll() === 0) return stopScroll();
		else if (!scrollInterval) startScroll();
	});

	onCleanup(() => {
		clearTimeout(scrollInterval);
		if (!mainElement) return;
		mainElement.removeEventListener("pointerdown", () => setScroll(0));
	});

	function handleClick(e: Event) {
		e.preventDefault();
		if (scroll() === 2) {
			return setScroll(0);
		}
		setScroll((prev) => prev + 1);
	}

	return (
		<button
			class='h-32 w-32 fixed bottom-0 right-0 cursor-pointer touch-none flex justify-end items-end'
			onclick={handleClick}>
			<div class='h-16 w-16 mr-4 mb-8 bg-white dark:bg-background-900 shadow-md flex items-center justify-center rounded-full select-none'>
				{scroll() == 0 && <Icon icon='play' />}
				{scroll() == 1 && <Icon icon='fastForward' />}
				{scroll() == 2 && <Icon icon='pause' />}
			</div>
		</button>
	);
};

export default AutoScrollButton;
