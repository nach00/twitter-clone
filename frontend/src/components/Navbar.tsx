// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
			<div className="container-fluid">
				<Link className="navbar-brand fw-bold" to="/">
					🐦 Twitter Clone
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					{isAuthenticated ? (
						<>
							<ul className="navbar-nav me-auto">
								<li className="nav-item">
									<Link className="nav-link" to="/">
										Home
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/explore">
										Explore
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to={`/profile/${user?.username}`}>
										Profile
									</Link>
								</li>
							</ul>

							<ul className="navbar-nav">
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										id="navbarDropdown"
										role="button"
										data-bs-toggle="dropdown"
									>
										@{user?.username}
									</a>
									<ul className="dropdown-menu">
										<li>
											<Link
												className="dropdown-item"
												to={`/profile/${user?.username}`}
											>
												My Profile
											</Link>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li>
										<li>
											<button className="dropdown-item" onClick={handleLogout}>
												Logout
											</button>
										</li>
									</ul>
								</li>
							</ul>
						</>
					) : (
						<ul className="navbar-nav ms-auto">
							<li className="nav-item">
								<Link className="nav-link" to="/login">
									Login
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/register">
									Register
								</Link>
							</li>
						</ul>
					)}
				</div>
			</div>
		</nav>
	);
};
