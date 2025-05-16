// fetchHelper.js
/**
 * For use with window.fetch
 */
export function jsonHeader(options = {}) {
	return Object.assign(options, {
		Accept: "application/json",
		"Content-Type": "application/json",
	});
}

export function getMetaContent(name) {
	const header = document.querySelector(`meta[name="${name}"]`);
	return header && header.content;
}

export function getAuthenticityToken() {
	return getMetaContent("csrf-token");
}

export function authenticityHeader(options = {}) {
	return Object.assign(options, {
		"X-CSRF-Token": getAuthenticityToken(),
		"X-Requested-With": "XMLHttpRequest",
	});
}

export function safeCredentials(options = {}) {
	return Object.assign(options, {
		credentials: "include", // Important for sessions/cookies
		mode: "same-origin", // Or 'cors' if API is on different domain
		headers: Object.assign(
			options.headers || {},
			authenticityHeader(),
			jsonHeader(),
		),
	});
}

export function safeCredentialsFormData(options = {}) {
	return Object.assign(options, {
		credentials: "include",
		mode: "same-origin",
		headers: Object.assign(options.headers || {}, authenticityHeader()),
	});
}

export function handleErrors(response) {
	if (!response.ok) {
		// Try to parse error from Rails API if possible
		return response
			.json()
			.then((errorData) => {
				const errorMessages = errorData.errors || [errorData.error] || [
						response.statusText,
					];
				throw new Error(errorMessages.join(", "));
			})
			.catch(() => {
				// Fallback if errorData is not JSON or no specific error message
				throw new Error(response.statusText);
			});
	}
	return response.json();
}
