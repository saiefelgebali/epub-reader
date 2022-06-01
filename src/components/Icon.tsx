import { Component } from "solid-js";

const icons: { [key: string]: Component<{ className: string }> } = {
	settings: ({ className }) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class={className}
			aria-hidden='true'
			width='1em'
			height='1em'
			preserveAspectRatio='xMidYMid meet'
			viewBox='0 0 32 32'>
			<path
				fill='currentColor'
				d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11.35 11.35 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.48 11.48 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11.35 11.35 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.48 11.48 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.86 8.86 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.36 9.36 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.86 8.86 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.36 9.36 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'
			/>
			<path
				fill='currentColor'
				d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6Zm0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4Z'
			/>
		</svg>
	),
	play: ({ className }) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class={className}
			aria-hidden='true'
			width='1em'
			height='1em'
			preserveAspectRatio='xMidYMid meet'
			viewBox='0 0 36 36'>
			<path
				fill='currentColor'
				d='M32.16 16.08L8.94 4.47A2.07 2.07 0 0 0 6 6.32v23.21a2.06 2.06 0 0 0 3 1.85l23.16-11.61a2.07 2.07 0 0 0 0-3.7Z'
				class='clr-i-solid clr-i-solid-path-1'
			/>
			<path fill='none' d='M0 0h36v36H0z' />
		</svg>
	),
	fastForward: ({ className }) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class={className}
			aria-hidden='true'
			width='1em'
			height='1em'
			preserveAspectRatio='xMidYMid meet'
			viewBox='0 0 36 36'>
			<path
				fill='currentColor'
				d='M17.71 32a2 2 0 0 1-.86-.2A1.77 1.77 0 0 1 16 30v-6.7L5.17 31.58a1.94 1.94 0 0 1-2.06.22A2 2 0 0 1 2 30V6a2 2 0 0 1 1.11-1.8a1.93 1.93 0 0 1 2.06.22L16 12.69V6a1.77 1.77 0 0 1 .85-1.79a1.93 1.93 0 0 1 2.06.22l15.32 12a2 2 0 0 1 0 3.15l-15.32 12a2 2 0 0 1-1.2.42Z'
				class='clr-i-solid clr-i-solid-path-1'
			/>
			<path fill='none' d='M0 0h36v36H0z' />
		</svg>
	),
	pause: ({ className }) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class={className}
			aria-hidden='true'
			width='1em'
			height='1em'
			preserveAspectRatio='xMidYMid meet'
			viewBox='0 0 36 36'>
			<rect
				width='11'
				height='28'
				x='3.95'
				y='4'
				fill='currentColor'
				class='clr-i-solid clr-i-solid-path-1'
				rx='2.07'
				ry='2.07'
			/>
			<rect
				width='11'
				height='28'
				x='20.95'
				y='4'
				fill='currentColor'
				class='clr-i-solid clr-i-solid-path-2'
				rx='2.07'
				ry='2.07'
			/>
			<path fill='none' d='M0 0h36v36H0z' />
		</svg>
	),
};

const Icon: Component<{ icon: string; className?: string }> = ({
	icon,
	className = "",
}) => {
	if (!(icon in icons)) throw new Error(`Icon '${icon}' not found`);

	return () => icons[icon]({ className });
};

export default Icon;
