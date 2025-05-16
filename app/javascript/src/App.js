import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserPage from "./pages/UserPage";
import { getLoggedInUser } from "./utils/api"; // We'll create this

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getLoggedInUser();
				if (data.logged_in) {
					setCurrentUser(data.user);
				}
			} catch (error) {
				console.error("Error fetching logged in user", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	if (loading) {
		return <div>Loading...</div>; // Or a spinner component
	}

	return (
		<Router>
			<Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
			<div className="container mt-3">
				<Switch>
					<Route exact path="/">
						<HomePage currentUser={currentUser} />
					</Route>
					<Route path="/login">
						{currentUser ? (
							<Redirect to="/" />
						) : (
							<LoginPage setCurrentUser={setCurrentUser} />
						)}
					</Route>
					<Route path="/signup">
						{currentUser ? (
							<Redirect to="/" />
						) : (
							<SignupPage setCurrentUser={setCurrentUser} />
						)}
					</Route>
					<Route path="/:username">
						<UserPage currentUser={currentUser} />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
