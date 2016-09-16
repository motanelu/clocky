var TARGET = process.env.npm_lifecycle_event
var config = {

  basePath: '',

  frameworks: ['browserify', 'mocha'],

  files: [
    'node_modules/babel-polyfill/browser.js',
    'src/**/*.js',
    'test/**/*Spec.js'
  ],

  reporters: ['spec'],

  preprocessors: {
    'test/**/*.js': ['browserify'],
    'src/**/*.js': ['browserify']
  },

  browsers: ['PhantomJS'],

  // browserify configuration
  browserify: {
    debug: true,
    transform: [
      ['babelify', {
        presets: ['es2015', 'stage-3'],
        plugins: ['transform-runtime']
      }]
    ]
  },

  client: {
    mocha: {
      reporter: 'html'
    }
  }
}

if (TARGET === 'test:watch') {
  config.reporters = ['clear-screen'].concat(config.reporters)
}

module.exports = function (karma) {
  karma.set(config)
}
