// frontend/src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RegisterPage: React.FC = () => {
	const { register, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		password_confirmation: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	// Redirect if already authenticated
	React.useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors([]);

		try {
			await register(formData);
			navigate("/");
		} catch (err: any) {
			const errorMessages = err.response?.data?.errors || [
				"Registration failed. Please try again.",
			];
			setErrors(Array.isArray(errorMessages) ? errorMessages : [errorMessages]);
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
							<h2 className="card-title">Join Twitter Clone</h2>
							<p className="text-muted">Create your account</p>
						</div>

						{errors.length > 0 && (
							<div className="alert alert-danger">
								<ul className="mb-0">
									{errors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							</div>
						)}

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									type="text"
									className="form-control"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									required
								/>
							</div>

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

							<div className="mb-3">
								<label htmlFor="password_confirmation" className="form-label">
									Confirm Password
								</label>
								<input
									type="password"
									className="form-control"
									id="password_confirmation"
									name="password_confirmation"
									value={formData.password_confirmation}
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
										Creating Account...
									</>
								) : (
									"Create Account"
								)}
							</button>
						</form>

						<div className="text-center mt-3">
							<p className="mb-0">
								Already have an account?{" "}
								<Link to="/login" className="text-decoration-none">
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
