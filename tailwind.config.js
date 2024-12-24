/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#EC9226",
        disabled: "#DFDFE4",
        "disabled-text": "#636366",
      },
    },
  },
  plugins: [],
};
