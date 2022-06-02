import { Component, ParentProps } from "solid-js";

const Main: Component<ParentProps<{ styles?: string }>> = ({
	children,
	styles = "",
}) => {
	return (
		<main>
			<div class={`container mx-auto mt-16 ${styles}`}>{children}</div>
		</main>
	);
};

export default Main;
