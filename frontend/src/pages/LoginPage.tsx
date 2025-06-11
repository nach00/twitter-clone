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
		<div className="auth-layout">
			<div className="auth-card">
				<h1 className="auth-title">Login</h1>

				{error && (
					<div style={{
						padding: 'var(--space-md)',
						backgroundColor: '#ff6666',
						color: 'var(--pure-white)',
						borderRadius: 'var(--radius-sharp)',
						marginBottom: 'var(--space-lg)',
						fontSize: '0.875rem',
						fontWeight: 'var(--font-weight-bold)',
						textTransform: 'uppercase',
						letterSpacing: '0.05em'
					}}>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 'var(--space-lg)' }}>
						<label htmlFor="email" className="form-label">
							Email Address
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

					<div style={{ marginBottom: 'var(--space-xl)' }}>
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
						className="btn btn-primary"
						disabled={isLoading}
						style={{ width: '100%' }}
					>
						{isLoading ? "SIGNING IN..." : "SIGN IN"}
					</button>
				</form>

				<div style={{ 
					textAlign: 'center', 
					marginTop: 'var(--space-xl)',
					paddingTop: 'var(--space-lg)',
					borderTop: '1px solid var(--concrete-gray)'
				}}>
					<p className="uppercase" style={{ 
						fontSize: '0.875rem',
						color: 'var(--industrial-gray)',
						margin: '0 0 var(--space-sm) 0'
					}}>
						New to Chirp?
					</p>
					<Link to="/register" className="weight-black">
						Create Account
					</Link>
				</div>
			</div>
		</div>
	);
};
