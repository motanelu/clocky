var Clocky = require('clocky')

var clocky = new Clocky()
clocky
  .runFor(5)
  .tickEvery(2)
  .on('tick', function (tick, startedAt, elapsed) {
    console.log('tick number ' + tick)
  })
  .start()
