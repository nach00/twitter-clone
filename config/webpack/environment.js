const { environment } = require("@rails/webpacker");

const path = require("path");

const customConfig = {
	resolve: {
		alias: {
			"@src": path.resolve(__dirname, "..", "..", "app/javascript/src"),
			"@components": path.resolve(
				__dirname,
				"..",
				"..",
				"app/javascript/src/components",
			),
			"@pages": path.resolve(__dirname, "..", "..", "app/javascript/src/pages"),
			"@utils": path.resolve(__dirname, "..", "..", "app/javascript/src/utils"),
		},
	},
};

environment.config.merge(customConfig);

environment.splitChunks();

module.exports = environment;
