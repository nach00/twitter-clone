import { safeCredentials, handleErrors } from "./fetchHelper";

const API_URL = "/api"; // Adjust if your API is namespaced differently or on another domain

export const signupUser = (userData) => {
	return fetch(
		`${API_URL}/users`,
		safeCredentials({
			method: "POST",
			body: JSON.stringify({ user: userData }),
		}),
	).then(handleErrors);
};

export const loginUser = (credentials) => {
	return fetch(
		`${API_URL}/login`,
		safeCredentials({
			method: "POST",
			body: JSON.stringify(credentials),
		}),
	).then(handleErrors);
};

export const logoutUser = () => {
	return fetch(
		`${API_URL}/logout`,
		safeCredentials({
			method: "DELETE",
		}),
	).then(handleErrors);
};

export const getLoggedInUser = () => {
	return fetch(
		`${API_URL}/logged_in_user`,
		safeCredentials({
			method: "GET",
		}),
	).then(handleErrors);
};

export const fetchTweets = () => {
	return fetch(
		`${API_URL}/tweets`,
		safeCredentials({
			method: "GET",
		}),
	).then(handleErrors);
};

export const createTweet = (tweetData) => {
	return fetch(
		`${API_URL}/tweets`,
		safeCredentials({
			method: "POST",
			body: JSON.stringify({ tweet: tweetData }),
		}),
	).then(handleErrors);
};

export const deleteTweetApi = (tweetId) => {
	return fetch(
		`${API_URL}/tweets/${tweetId}`,
		safeCredentials({
			method: "DELETE",
		}),
	).then(handleErrors);
};

export const fetchUserTweets = (username) => {
	return fetch(
		`${API_URL}/tweets/user/${username}`,
		safeCredentials({
			method: "GET",
		}),
	).then(handleErrors);
};
