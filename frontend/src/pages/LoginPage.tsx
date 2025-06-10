// frontend/src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const LoginPage: React.FC = () => {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// Redirect if already authenticated
	React.useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await login(formData);
			navigate("/");
		} catch (err: any) {
			setError(err.response?.data?.error || "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="row justify-content-center mt-5">
			<div className="col-md-6 col-lg-4">
				<div className="card shadow">
					<div className="card-body">
						<div className="text-center mb-4">
							<h2 className="card-title">Welcome Back</h2>
							<p className="text-muted">Sign in to your account</p>
						</div>

						{error && (
							<div className="alert alert-danger" role="alert">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									type="email"
									className="form-control"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<input
									type="password"
									className="form-control"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>

							<button
								type="submit"
								className="btn btn-primary w-100"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" />
										Signing In...
									</>
								) : (
									"Sign In"
								)}
							</button>
						</form>

						<div className="text-center mt-3">
							<p className="mb-0">
								Don't have an account?{" "}
								<Link to="/register" className="text-decoration-none">
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
