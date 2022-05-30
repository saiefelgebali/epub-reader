import { Route, Router, Routes } from "solid-app-router";
import BookPage from "./pages/BookPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/Settings";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' component={HomePage} />
				<Route path='/home' component={HomePage} />
				<Route path='/book/:id' component={BookPage} />
				<Route path='/settings' component={SettingsPage} />
			</Routes>
		</Router>
	);
};

export default App;
