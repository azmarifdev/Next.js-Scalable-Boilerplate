/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"]
};

module.exports = config;
