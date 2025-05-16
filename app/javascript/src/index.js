import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// If you created packs/application.scss and imported bootstrap there,
// you might not need to import it directly here.
// Otherwise:
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

document.addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById("root"),
	);
});
