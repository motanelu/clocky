var TARGET = process.env.npm_lifecycle_event
var config = {
  basePath: '',
  frameworks: ['browserify', 'mocha'],
  files: [
    'node_modules/babel-polyfill/browser.js',
    'src/**/*.js',
    'test/**/*Spec.js'
  ],
  coverageReporter: {
    reporters: [
      { type: 'text-summary' }
    ]
  },
  reporters: ['spec', 'coverage'],

  preprocessors: {
    'test/**/*.js': ['browserify'],
    'src/**/*.js': ['browserify', 'coverage']
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

if (process.env.TRAVIS) {
  config.coverageReporter.reporters.push({ type: 'lcov', dir: 'coverage' })
  config.reporters.push('coveralls')
} else {
  config.coverageReporter.reporters.push({ type: 'html', dir: 'coverage', 'subdir': '.' })
}

if (TARGET === 'test:watch') {
  config.reporters = ['clear-screen'].concat(config.reporters)
}

module.exports = function (karma) {
  karma.set(config)
}
