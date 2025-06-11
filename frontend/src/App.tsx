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
import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Navbar />
					<main className="main-layout">
						<aside className="sidebar-left">
							<div className="sidebar-widget">
								<h3>Navigation</h3>
								<nav
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "var(--space-md)",
									}}
								>
									<a href="/" className="nav-link uppercase">
										Feed
									</a>
									<a href="/explore" className="nav-link uppercase">
										Explore
									</a>
									<a href="#" className="nav-link uppercase">
										Notifications
									</a>
									<a href="#" className="nav-link uppercase">
										Messages
									</a>
								</nav>
							</div>
							<div className="sidebar-widget">
								<h3>About</h3>
								<p
									style={{
										fontSize: "1.125rem",
										lineHeight: "1.5",
										color: "var(--industrial-gray)",
										textTransform: "uppercase",
										letterSpacing: "0.02em",
									}}
								>
									A social platform
									<br />
									inspired by the
									<br />
									aesthetic vision of
									<br />
									<span className="text-signature weight-black">
										Natcha Pradappet
									</span>
								</p>
							</div>
						</aside>

						<div className="main-content">
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

						<aside className="sidebar-right">
							<div className="sidebar-widget">
								<h3>Trending</h3>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "var(--space-sm)",
									}}
								>
									<span
										className="text-industrial uppercase"
										style={{ fontSize: "0.75rem" }}
									>
										#Design
									</span>
									<span
										className="text-industrial uppercase"
										style={{ fontSize: "0.75rem" }}
									>
										#OffWhite
									</span>
									<span
										className="text-industrial uppercase"
										style={{ fontSize: "0.75rem" }}
									>
										#Streetwear
									</span>
									<span
										className="text-industrial uppercase"
										style={{ fontSize: "0.75rem" }}
									>
										#Fashion
									</span>
								</div>
							</div>
							<div className="sidebar-widget deconstructed">
								<h3>Connect</h3>
								<p
									style={{
										fontSize: "0.875rem",
										color: "var(--industrial-gray)",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										lineHeight: "1.3",
									}}
								>
									Follow creators
									<br />
									Share your vision
									<br />
									Build community
								</p>
							</div>
						</aside>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
