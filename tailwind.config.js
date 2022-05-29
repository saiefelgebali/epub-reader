module.exports = {
	content: ["./*.html", "./src/**/*.tsx"],
	darkMode: "class",
	theme: {
		extend: {
			container: {
				center: true,
				padding: "1rem",
			},
			colors: {
				"background-900": "#16191D",
				"background-800": "#21252C",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
