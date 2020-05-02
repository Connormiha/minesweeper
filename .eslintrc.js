module.exports = {
  parser: 'babel-eslint',
  extends: [ 'eslint:all', 'plugin:react/all' ],
  plugins: [ 'flowtype', 'react', 'jest', 'promise' ],
  overrides: 
   [ { files: [ '__tests__/**/*.spec.{js,jsx}' ],
       env: { jest: true } },
     { files: [ 'src/**/*.{js,jsx}' ], env: { node: false } } ],
  env: { browser: true, es6: true, node: true },
  parserOptions: { sourceType: 'module' },
  rules: 
   { 'flowtype/define-flow-type': 1,
     'flowtype/use-flow-type': 1,
     'react/no-set-state': 'off',
     'react/react-in-jsx-scope': 'off',
     'react/prefer-stateless-function': 'off',
     'react/sort-prop-types': 'off',
     'react/no-array-index-key': 'off',
     'react/jsx-sort-props': 'off',
     'react/sort-comp': 'off',
     'react/jsx-handler-names': 'off',
     'react/destructuring-assignment': 'off',
     'implicit-arrow-linebreak': 'off',
     quotes: [ 'error', 'single' ],
     'space-before-function-paren': [ 'error', 'never' ],
     'padded-blocks': [ 'error', 'never' ],
     'quote-props': [ 'error', 'as-needed' ],
     'no-underscore-dangle': 'off',
     'class-methods-use-this': 'off',
     'sort-imports': 'off',
     'id-length': 'off',
     'sort-keys': 'off',
     'no-magic-numbers': 'off',
     'function-paren-newline': 'off',
     'function-call-argument-newline': 'off',
     'no-extra-parens': 'off',
     'default-case': 'off',
     'default-param-last': 'off',
     'no-plusplus': 'off',
     'no-continue': 'off',
     'no-process-env': 'off',
     'no-inline-comments': 'off',
     'no-confusing-arrow': 'off',
     'no-bitwise': 'off',
     'line-comment-position': 'off',
     'capitalized-comments': 'off',
     'object-property-newline': 'off',
     'dot-location': 'off',
     'multiline-ternary': 'off',
     'max-statements': 'off',
     'max-lines-per-function': 'off',
     'no-ternary': 'off',
     'init-declarations': 'off',
     'valid-jsdoc': 'off',
     'array-element-newline': 'off',
     'no-case-declarations': 'off',
     'array-bracket-newline': 'off',
     'object-curly-newline': 'off',
     'no-param-reassign': 'off',
     'func-style': 'off',
     'no-shadow': 'off',
     'max-params': [ 'error', 5 ],
     'one-var': [ 'error', 'never' ],
     indent: [ 'error', 4, { SwitchCase: 1 } ],
     'comma-dangle': [ 'error', 'always-multiline' ],
     'max-len': [ 'error', 140 ] },
  globals: { React: true, bem: true }
};