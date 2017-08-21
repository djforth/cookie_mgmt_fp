// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/cookie_mgmt.js'
  , name: 'CookieManagement'
  , sourcemap: true
  , output: {
    file: 'index.js'
    , format: 'umd'
  }
  , plugins: [
    resolve({
      browser: true
      , extensions: ['.js', '.jsx']
    })
    , commonjs()
    , babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
    , replace({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV)
    })
    , uglify()
  ]

};
