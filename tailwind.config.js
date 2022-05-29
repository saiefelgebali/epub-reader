module.exports = {
	content: ["./*.html", "./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"background-900": "#16191D",
				"background-800": "#21252C",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
