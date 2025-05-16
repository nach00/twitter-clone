import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { signupUser } from "../utils/api";

const SignupPage = ({ setCurrentUser }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [error, setError] = useState("");
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (password !== passwordConfirmation) {
			setError("Passwords don't match");
			return;
		}
		try {
			const data = await signupUser({
				username,
				email,
				password,
				password_confirmation: passwordConfirmation,
			});
			if (data.success) {
				setCurrentUser(data.user);
				history.push("/");
			} else {
				setError(data.errors ? data.errors.join(", ") : "Signup failed");
			}
		} catch (err) {
			setError(err.message || "Signup failed. Please try again.");
		}
	};

	return (
		<div>
			<h2>Signup</h2>
			{error && <div className="alert alert-danger">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">Username</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="form-control"
						required
					/>
				</div>
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
				<div className="mb-3">
					<label className="form-label">Confirm Password</label>
					<input
						type="password"
						value={passwordConfirmation}
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Signup
				</button>
			</form>
		</div>
	);
};

export default SignupPage;
