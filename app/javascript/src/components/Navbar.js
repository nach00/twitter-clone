import React from "react";
import { Link, useHistory } from "react-router-dom";
import { logoutUser } from "../utils/api";

const Navbar = ({ currentUser, setCurrentUser }) => {
	const history = useHistory();

	const handleLogout = async () => {
		try {
			await logoutUser();
			setCurrentUser(null);
			history.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			// Handle logout error (e.g., show a message)
		}
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					TwitterClone
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{currentUser ? (
							<>
								<li className="nav-item">
									<Link className="nav-link" to={`/${currentUser.username}`}>
										{currentUser.username}
									</Link>
								</li>
								<li className="nav-item">
									<button
										className="btn btn-link nav-link"
										onClick={handleLogout}
									>
										Logout
									</button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/login">
										Login
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/signup">
										Signup
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
