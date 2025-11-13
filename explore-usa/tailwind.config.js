const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", // all your React components
  "./src/**/*.{js,ts,jsx,tsx}", // make Tailwind include Flowbite classes
  "node_modules/flowbite-react/**/*.js", ".flowbite-react\\class-list.json"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [// enables Flowbite component styles
  require("flowbite/plugin"), flowbiteReact],
}