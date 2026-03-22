import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    // Apply these rules to all JavaScript files
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      // If your Express app uses 'require()', use "commonjs".
      // If you use 'import', change this to "module".
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Backend specific rules
      "no-console": "off", // Consoles are fine in Node.js for logging
      "no-unused-vars": "warn", // Warn instead of crash for unused vars
      "no-undef": "error",
    },
  },
  {
    // Tell ESLint to completely ignore your build/module folders
    ignores: ["node_modules/", ".git/", ".github/"],
  },
];
