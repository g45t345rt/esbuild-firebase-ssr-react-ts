module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["*d.ts"],
  env: {
    "browser": true,
    "amd": true,
    "node": true
  },
  rules: {
    "eol-last": 2,
    "semi": [1, "never"],
    "no-var-requires": 0,
    "max-len": ["error", { "code": 150 }],
    "@typescript-eslint/no-var-requires": 0
  }
}
