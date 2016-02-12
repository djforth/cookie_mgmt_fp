module.exports = {
  "parser": "babel-eslint",
  "extends": "google",
  "plugins": [
      "react"
  ],
   "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "ecmaFeatures": {
    "arrowFunctions": true,
    "blockBindings": true,
    "classes": true,
    "defaultParams": true,
    "destructuring": true,
    "forOf": true,
    "generators": true,
    "modules": true,
    "spread": true,
    "templateStrings": true,
    "jsx": true
  },
  "rules": {
    "no-alert":[0],
    "camelcase": [0],
    "comma-spacing": [1, {"before": false, "after": true}],
    "comma-style": [2, "first"],
    "consistent-return": [0],
    "curly": [2, "multi-line"],
    "key-spacing": [0],
    "quotes": [2, "double"],
    "new-cap": [0],
    "no-console":[2],
    "no-undef":[1], //Because of react work around
    "no-underscore-dangle":[0],
    "no-multi-spaces": [0],
    "no-shadow": [0],
    "no-unused-vars": [1],
    "no-use-before-define": [2, "nofunc"]
  }
};