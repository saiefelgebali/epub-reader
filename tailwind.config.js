module.exports = {
	content: ["./*.html", "./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
