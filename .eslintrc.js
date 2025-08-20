// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  ignorePatterns: ['/dist/*'],
  rules: {
    'react-hooks/exhaustive-deps': 0,
  },
};
