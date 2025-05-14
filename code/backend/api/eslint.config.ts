import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended, 
  {
    files: ["**/*.ts", "**/*.tsx"], 
    languageOptions: {
      parser: tsParser, 
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn",
      "no-redeclare": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-redeclare": "warn", 
    },
  },
];
