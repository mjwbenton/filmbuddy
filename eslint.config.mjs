import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import functional from "eslint-plugin-functional";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      functional,
      "react-hooks": reactHooks,
      "react-native": reactNative,
    },
    rules: {
      "no-console": "warn",
      eqeqeq: "error",
      "functional/no-let": "error",
      "functional/no-loop-statements": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-native/no-unused-styles": "warn",
      "react-native/no-inline-styles": "warn",
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "**/.expo/",
      "**/drizzle/",
      "**/*.config.{js,ts}",
    ],
  },
);
