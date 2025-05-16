import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUser } from "../utils/api";

const LoginPage = ({ setCurrentUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const data = await loginUser({ email, password });
			if (data.success) {
				setCurrentUser(data.user);
				history.push("/");
			} else {
				setError(data.error || "Login failed");
			}
		} catch (err) {
			setError(err.message || "Login failed. Please try again.");
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{error && <div className="alert alert-danger">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
