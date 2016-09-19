# Clocky [![Build Status](https://travis-ci.org/motanelu/clocky.svg?branch=master)](https://travis-ci.org/motanelu/clocky) [![Coverage Status](https://coveralls.io/repos/github/motanelu/clocky/badge.svg?branch=master)](https://coveralls.io/github/motanelu/clocky?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/motanelu/clocky/blob/master/LICENSE.md)

## Installation
Simplest option, with npm:

```
npm install clocky
```
or, if you prefer old fashioned downloads, [click here for the minified UMD file](https://raw.githubusercontent.com/motanelu/clocky/master/dist/clocky.min.js)

## Usage

### Javascript
```
var Clocky = require('clocky').default

var clocky = new Clocky({
  onTick: function (ticks, startedAt, elapsed) {
    console.log('ticked ' + ticks + ' times')
    console.log('started at ' + startedAt)
    console.log('total elapsed time (including pauses):' + elapsed + ' seconds')
  }
  tickEvery: 2 // seconds
})

clocky.start()

```

### ECMA2015
```
import Clocky from 'clocky'

let clocky = new Clocky({
  onTick: (ticks, startedAt, elapsed) => {
    console.log(`ticked ${ticks} times`)
    console.log(`started at ${startedAt}`)
    console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
  }
  tickEvery: 2 // seconds
})

clocky.start()
```
