module.exports = {
  presets: [
    // ["env", {
    //   "modules": false,
    //   "targets": {
    //     "browsers": ["ie >=9"]
    //   },
    //   "useBuiltIns": true,
    //   "debug": true
    // }]
    ["@vue/app", {
    useBuiltIns: 'entry',
      targets: {
        "browsers": ["ie >=9"]
      },
    }]
  ]
}
