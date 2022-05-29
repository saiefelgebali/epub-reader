import { Route, Router, Routes } from "solid-app-router";
import Book from "./pages/Book";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' component={Home} />
				<Route path='/book/:id' component={Book} />
				<Route path='/settings' component={Settings} />
			</Routes>
		</Router>
	);
};

export default App;
