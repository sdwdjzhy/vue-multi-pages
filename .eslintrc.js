module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  rules: {
    quotes: [1, "double"],
    semi: [1, "always"],
    "no-unused-vars": 0,
    "no-useless-escape": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": "off",
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};