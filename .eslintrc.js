module.exports = {
  parser:  "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  plugins: [
    "react", "react-hooks", "@typescript-eslint", "prettier"
  ],
  rules: {
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/explicit-function-return-type": ["warn", { 
      allowExpressions: true,
      allowTypedFunctionExpressions: true
    }],
  }
}
