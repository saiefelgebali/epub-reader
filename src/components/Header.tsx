import { Link } from "solid-app-router";

const Header = () => {
	return (
		<header class='h-16 flex items-center bg-gray-50  dark:bg-background-800 border-b dark:border-background-900 transition-colors fixed top-0 left-0 right-0'>
			<nav class='container flex justify-between items-center'>
				<Link href='/home' class='font-bold'>
					Readbali
				</Link>
				<Link href='/settings'>Settings</Link>
			</nav>
		</header>
	);
};

export default Header;
