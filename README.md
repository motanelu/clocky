# Clocky [![Build Status](https://travis-ci.org/motanelu/clocky.svg?branch=master)](https://travis-ci.org/motanelu/clocky) [![Coverage Status](https://coveralls.io/repos/github/motanelu/clocky/badge.svg?branch=master)](https://coveralls.io/github/motanelu/clocky?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/motanelu/clocky/blob/master/LICENSE.md)

Clocky executes callbacks at predefined intervals called ticks, providing an easy-to-use wrapper around the built in setInterval method.

## Installation
Simplest option, with npm:

```
npm install clocky
```
or, if you prefer old fashioned downloads, [click here for the minified UMD file](https://raw.githubusercontent.com/motanelu/clocky/master/dist/clocky.min.js)

## Usage

### Javascript
```
var Clocky = require('clocky')

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
import {Clocky} from 'clocky'

let clocky = new Clocky({
  onTick: (ticks, startedAt, elapsed) => {
    console.log(`ticked ${ticks} times`)
    console.log(`started at ${startedAt}`)
    console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
  },
  tickEvery: 2 // seconds
})

clocky.start()
```

## API
Clocky provides a [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) which allows for chaining methods. The methods outlined below can also be invoked in the constructor as an object.
The following examples are equivalent:

```
let clocky = new Clocky({
  onTick: (ticks, startedAt, elapsed) => {
    console.log(`ticked ${ticks} times`)
    console.log(`started at ${startedAt}`)
    console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
  },
  tickFor: 5,
  tickEvery: 2 // seconds
})

clocky.start()
```
and
```
let clocky = new Clocky()

clocky
  .tickFor(5)
  .tickEvery(2)
  .onTick((ticks, startedAt, elapsed) => {
    console.log(`ticked ${ticks} times`)
    console.log(`started at ${startedAt}`)
    console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
  })
  .start()
```

### State

Clocky has 3 states or statuses:
 * stopped - the internal timer is stopped, there is no internal state and no events are fired
 * running - the internal timer is started and it emits ticks at the predefined intervals
 * paused  - the internal timer is stopped and no events are fired, but the internal state is maintained (number of ticks elapsed, etc.)

In order to provide consistency, methods that alter the behavior (tickEvery(), runFor()) can only be called if the status is "stopped"

### runFor()
Specify the amount of time Clocky needs to run for. After this amount has elapsed, Clocky will automatically stop and no further ticks will be fired. This method
can only be called when the status is stopped

```
clocky.runFor(5) // seconds
```

### tickEvery()
Specify the amount of time in seconds between 2 consecutive ticks. Must be called when clocky is "stopped"

```
clocky.tickEvery(5) // seconds
```

### tickOnResume()
Specify a truthy value is Clocky needs to tick when it's resumed.

### tickOnStart()
Specify a truthy value is Clocky needs to tick when it's started.

### on()
Shorthand method for adding event. Specify the event as a string.

```
clocky.on('tick', () => {
  console.log('ticked')
})
```

### onStart()
Provide a callback to be executed when the timer is started.

```
clocky.onStart((ticks, startedAt, elapsed) => {
  console.log(`ticked ${ticks} times`)
  console.log(`started at ${startedAt}`)
  console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
})
```

### onPause()
Provide a callback to be executed when the timer is paused. This event is triggered before the pause.

```
clocky.onPause((ticks, startedAt, elapsed) => {
  console.log(`ticked ${ticks} times`)
  console.log(`started at ${startedAt}`)
  console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
})
```

### onResume()
Provide a callback to be executed when the timer is resumed. This event is triggered after the pause.

```
clocky.onResume((ticks, startedAt, elapsed) => {
  console.log(`ticked ${ticks} times`)
  console.log(`started at ${startedAt}`)
  console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
})
```

### onStop()
Provide a callback to be executed when the timer is stopped.

```
clocky.onStop((ticks, startedAt, elapsed) => {
  console.log(`ticked ${ticks} times`)
  console.log(`started at ${startedAt}`)
  console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
})
```

### onTick()
Provide a callback

```
clocky.onTick((ticks, startedAt, elapsed) => {
  console.log(`ticked ${ticks} times`)
  console.log(`started at ${startedAt}`)
  console.log(`total elapsed time (including pauses): ${elapsed} seconds`)
})
```

### start()
Start the timer. If the timer is not stopped, it will throw an exception.

### pause()
Pause the timer. Pausing will also stop the timer for the "runFor()" method, so that Clocky instance with a runFor() interval of 10 seconds paused in the middle for 5 it will actually run for 15 seconds.

### resume()
Resume a previously stopped timer. Will throw an exception if the timer is not paused

### stop()
Stop timer and reset it to its initial state. Can be trigger regardless of the status.

### getStatus()
Return the current status, can be one of "stopped", "running" or "paused"

### isStopped(), isRunning(), isPaused()
Return boolean values based on the current status
