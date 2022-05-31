import { Component, ParentProps } from "solid-js";

const Main: Component<ParentProps<{ styles?: string }>> = ({
	children,
	styles = "",
}) => {
	return <main class={`container mx-auto mt-16 ${styles}`}>{children}</main>;
};

export default Main;
