import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import typescript from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import parser from "@typescript-eslint/parser";

export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    reactPlugin.configs.flat?.recommended,
    importPlugin.flatConfigs.typescript,
    prettierConfig,
    {
        ignores: [
            "metro.config.js",
            "/node_modules/*",
            "/android/*",
            "/ios/*",
            "/coverage/*",
            "/.expo/*",
            "*.typegen.ts",
        ],
        plugins: {
            import: importPlugin,
            "react-hooks": reactHooksPlugin,
            reactPlugin,
            typescript,
            prettierPlugin,
        },
        languageOptions: {
            parser,
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.jquery,
                ...globals.amd,
                ...globals.node,
                ...globals.jest,
                Atomics: "readonly",
                SharedArrayBuffer: "readonly",
                L: "readonly",
                LocalFileSystem: "readonly",
                device: "readonly",
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            "import/no-cycle": 1,
            "prettier/prettier": [
                "warn",
                {
                    tabWidth: 2,
                    printWidth: 120,
                    arrowParens: "always",
                },
            ],
            // TODO: re-enable when eslint-plugin-react-native supports ESLint 9+
            // "react-native/no-unused-styles": "error",
            // "react-native/split-platform-components": "error",
            // "react-native/no-inline-styles": "error",
            // TODO: enable when global theme is configured
            // "react-native/no-color-literals": "error",
            // TODO: re-enable when eslint-plugin-react-native supports ESLint 9+
            // "react-native/no-single-element-style-arrays": "error",
            // "react-hooks/rules-of-hooks": "error",
            // "react-hooks/exhaustive-deps": "warn",
            // object = { x } instead of { x: x }
            "object-shorthand": "error",
            // Type[] instead of Array<Type>
            "@typescript-eslint/array-type": [
                "error",
                {
                    default: "array-simple",
                },
            ],
            "@typescript-eslint/no-var-requires": "off",
            "react/react-in-jsx-scope": "off",
            eqeqeq: "error",
            "multiline-ternary": "off",
            // "func-style": ["error", "declaration"],
            // "no-func-assign": "error",
            curly: "error",
        },
    },
];
