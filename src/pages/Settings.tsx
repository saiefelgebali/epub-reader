import { db } from "../db/db";
import { setBooks } from "../store";
import Header from "../components/Header";
import Main from "../components/Main";

const SettingsPage = () => {
	return (
		<>
			<Header />
			<Main styles='pt-4'>
				<div>
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
				</div>
			</Main>
		</>
	);
};

export default SettingsPage;
