// frontend/src/App.tsx
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { FollowersPage } from "@/pages/FollowersPage";
import { FollowingPage } from "@/pages/FollowingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Navbar />
					<main className="container-fluid">
						<div className="row">
							<div className="col-lg-2 d-none d-lg-block">
								{/* Left sidebar - could add navigation links here */}
							</div>
							<div className="col-lg-8 col-12">
								<Routes>
									<Route
										path="/"
										element={
											<ProtectedRoute>
												<HomePage />
											</ProtectedRoute>
										}
									/>
									<Route path="/login" element={<LoginPage />} />
									<Route path="/register" element={<RegisterPage />} />
									<Route
										path="/profile/:username"
										element={
											<ProtectedRoute>
												<ProfilePage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/explore"
										element={
											<ProtectedRoute>
												<ExplorePage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/profile/:username/followers"
										element={
											<ProtectedRoute>
												<FollowersPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/profile/:username/following"
										element={
											<ProtectedRoute>
												<FollowingPage />
											</ProtectedRoute>
										}
									/>
									<Route path="*" element={<Navigate to="/" replace />} />
								</Routes>
							</div>
							<div className="col-lg-2 d-none d-lg-block">
								{/* Right sidebar - could add trending, suggestions here */}
							</div>
						</div>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
