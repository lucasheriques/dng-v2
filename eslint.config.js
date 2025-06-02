import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,

  // JavaScript/JSX files
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        // React (for Next.js - React is auto-imported)
        React: "readonly",
        JSX: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Prevent shipping console statements to production
      "no-console": "warn",
      "no-debugger": "error",

      // Code quality
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],

      // React best practices
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
    },
  },

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        // React (for Next.js - React is auto-imported)
        React: "readonly",
        JSX: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Prevent shipping console statements to production
      "no-console": "warn",
      "no-debugger": "error",

      // Code quality
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": "off", // TypeScript handles this
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // React best practices
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",

      // TypeScript specific (non-type-aware)
      "@typescript-eslint/no-explicit-any": "warn",

      // TypeScript specific (type-aware) - only for TypeScript files
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
    },
  },

  // Test files - allow console and other testing globals
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Allow console in development/config files
  {
    files: [
      "*.config.js",
      "*.config.ts",
      "scripts/**/*",
      "src/lib/generate-article-list.ts",
    ],
    rules: {
      "no-console": "off",
    },
  },
];
