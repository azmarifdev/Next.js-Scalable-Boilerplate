module.exports = {
  extends: ["@commitlint/config-conventional"],
  defaultIgnores: true,
  ignores: [
    (message) => message.startsWith("Merge "),
    // Dependabot includes long markdown tables in commit bodies that violate body-max-line-length.
    (message) => message.includes("dependabot[bot]")
  ]
};
