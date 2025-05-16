// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs";
// import Turbolinks from "turbolinks" // We skipped Turbolinks
import * as ActiveStorage from "@rails/activestorage";
import "channels";
import "bootstrap/dist/js/bootstrap.bundle"; // Or just 'bootstrap' if Popper is separate
import "../src/index.js";

// Import your main React application entry point
import "../src/index.js"; // Assuming your main React app is in src/index.js

Rails.start();
// Turbolinks.start() // We skipped Turbolinks
ActiveStorage.start();
