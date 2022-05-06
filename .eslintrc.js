/* module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/essential",
        'eslint:recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {}
}
 */
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ["eslint:recommended", "plugin:vue/essential", "plugin:vue/base"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        AMap: true
    },
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            globalReturn: true,
            impliedStrict: true,
            experimentalObjectRestSpread: true
        }
    },
    plugins: ["vue"],
    // indent: ["error", 2],
    rules: {
        "vue/no-unused-vars": "off" //作用在vue模板。
    }
};