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
		<nav className="navbar">
			<div className="">
				<Link className="navbar-brand" to="/">
					CHIRP
				</Link>

				<div className="navbar-nav">
					{isAuthenticated ? (
						<>
							<Link className="nav-link uppercase weight-black" to="/">
								Feed
							</Link>
							<Link className="nav-link uppercase weight-black" to="/explore">
								Explore
							</Link>
							<Link
								className="nav-link uppercase weight-black"
								to={`/profile/${user?.username}`}
							>
								Profile
							</Link>
							<button className="btn btn-outline" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link className="nav-link uppercase weight-black" to="/login">
								Login
							</Link>
							<Link className="nav-link uppercase weight-black" to="/register">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
