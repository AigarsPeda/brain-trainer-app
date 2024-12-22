module.exports = {
  plugins: [
    "react-hooks", // Make sure this plugin is installed
  ],
  rules: {
    // Core Hook Rules - These two are critical
    "react-hooks/rules-of-hooks": "error", // Enforces Hook rules
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies

    // Additional recommended rules for hooks
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function",
      },
    ],

    // Optional but recommended hook rules
    "react/hook-use-state": "warn", // Ensures proper useState usage
    "react/no-unstable-nested-components": "error", // Prevents hooks in nested components
  },
};
