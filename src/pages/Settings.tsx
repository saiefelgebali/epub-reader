import { db } from "../db/db";
import { setBooks } from "../store";
import Header from "../components/Header";
import Main from "../components/Main";
import {
	Accessor,
	Component,
	createEffect,
	createSignal,
	ParentProps,
} from "solid-js";

const SettingsButton: Component<
	ParentProps<{ active?: Accessor<boolean>; onclick?: () => void }>
> = ({ active = () => false, children, onclick }) => (
	<button
		class={`w-full p-4 rounded ${
			active()
				? "dark:bg-gray-50 dark:text-gray-900 bg-background-800 text-white"
				: "dark:bg-background-900 dark:text-white bg-gray-50 text-gray-900"
		}`}
		onclick={onclick}>
		{children}
	</button>
);

const SettingsPage = () => {
	const [scrollSpeed, setScrollSpeed] = createSignal(0);
	const [dark, setDark] = createSignal(
		document.querySelector("html")!.classList.contains("dark")
	);

	createEffect(() => {
		if (dark() === true) {
			document.querySelector("html")?.classList.add("dark");
		} else if (dark() === false) {
			document.querySelector("html")?.classList.remove("dark");
		}
	});

	return (
		<>
			<Header />
			<Main styles='pt-4 max-w-xl'>
				<div class='flex flex-col gap-8'>
					<div>
						<h2 class='text-2xl mb-4'>Auto-scroll Speed</h2>
						<div class='flex gap-4'>
							<SettingsButton
								active={() => scrollSpeed() === 0}
								onclick={() => setScrollSpeed(0)}>
								Slow
							</SettingsButton>
							<SettingsButton
								active={() => scrollSpeed() === 1}
								onclick={() => setScrollSpeed(1)}>
								Medium
							</SettingsButton>
							<SettingsButton
								active={() => scrollSpeed() === 2}
								onclick={() => setScrollSpeed(2)}>
								Fast
							</SettingsButton>
						</div>
					</div>
					<div>
						<h2 class='text-2xl mb-4'>Theme</h2>
						<div class='flex gap-4'>
							<SettingsButton
								active={() => dark() === true}
								onclick={() => setDark(true)}>
								Dark
							</SettingsButton>
							<SettingsButton
								active={() => dark() === false}
								onclick={() => setDark(false)}>
								Light
							</SettingsButton>
						</div>
					</div>
					<div>
						<h2 class='text-2xl mb-4'>Font Size</h2>
						<div class='flex gap-4 mb-4'>
							<div>Small</div>
							<input class='w-full' type='range' />
							<div>Large</div>
						</div>
						<label>Example</label>
						<div class='prose prose-xl dark:prose-invert'>
							<p>The quick brown fox jumps over the lazy dog</p>
						</div>
					</div>
				</div>
				{/* <div>
					<button
						class='mb-8'
						onclick={() => {
							db.books.clear();
							setBooks({});
						}}>
						Clear Database
					</button>
				</div>
				<div>
					<button
						onclick={() =>
							document
								.querySelector("html")
								?.classList.toggle("dark")
						}>
						Toggle
					</button>
				</div> */}
			</Main>
		</>
	);
};

export default SettingsPage;
