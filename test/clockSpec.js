import {expect} from 'chai'
import sinon from 'sinon'

import {Clocky} from '../src/clocky'

describe('Clocky suite', () => {
  let start = sinon.spy()
  let pause = sinon.spy()
  let resume = sinon.spy()
  let stop = sinon.spy()
  let tick = sinon.spy()

  let timer
  let clocky

  beforeEach(() => {
    timer = sinon.useFakeTimers()

    start.reset()
    pause.reset()
    resume.reset()
    stop.reset()
    tick.reset()

    clocky = new Clocky({
      onStart: start,
      onPause: pause,
      onResume: resume,
      onStop: stop,
      onTick: tick
    })
  })

  afterEach(() => timer.restore())

  describe('#constructor', () => {
    it('should throw an exception on unknown events', () => {
      try {
        new Clocky({ // eslint-disable-line
          'onRandom': () => {}
        })
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Unknown event: The event must be one of "start", "pause", "resume", "stop", "tick". Received "random".')
      }
    })

    it('should throw an exception on invalid handlers', () => {
      try {
        new Clocky({ // eslint-disable-line
          'onStart': 'not-a-function'
        })
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Invalid callable: The callable\'s type must be a function. Found "string" instead.')
      }
    })

    it('should throw an exception on invalid value for "runFor"', () => {
      try {
        new Clocky({ // eslint-disable-line
          'runFor': 'five'
        })
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Method Clocky#runFor() must be called with a number as parameter. Received "five".')
      }
    })

    it('should throw an exception on invalid value for "tickEvery"', () => {
      try {
        new Clocky({ // eslint-disable-line
          'tickEvery': 'five'
        })
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Method Clocky#tickEvery() must be called with a positive number as parameter. Received "five".')
      }
    })
  })

  describe('#runFor', () => {
    it('should throw an exception if the timer is already started', () => {
      try {
        clocky.start().runFor(4)
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Method Clocky#runFor() must be called before invoking Clocky#start().')
      }
    })

    it('should stop the timer after the time has elapsed', () => {
      clocky.runFor(3).start()
      timer.tick(5000)
      expect(tick.callCount).to.be.eql(3)
    })
  })

  describe('#tickEvery', () => {
    it('should throw an exception if the timer is already started', () => {
      try {
        clocky.start().tickEvery(2)
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Method Clocky#tickEvery() must be called before invoking Clocky#start().')
      }
    })
    it('should change the interval between ticks accordingly', () => {
      clocky.tickEvery(5).start()
      timer.tick(10000)
      expect(tick.callCount).to.be.eql(2)
    })
  })

  describe('#tickOnResume', () => {
    it('should fire a tick when Clocky is resumed', () => {
      clocky.tickEvery(10).tickOnResume().start()
      timer.tick(7000)
      clocky.pause()
      clocky.resume()

      expect(tick.callCount).to.be.eql(1)
    })
  })

  describe('#tickOnStart', () => {
    it('should fire a tick when Clocky is resumed', () => {
      clocky.tickEvery(10).tickOnStart().start()
      timer.tick(5000)

      expect(tick.callCount).to.be.eql(1)
    })
  })

  describe('#start', () => {
    it('should throw an exception is the current status is wrong', () => {
      try {
        clocky.start().pause().start()
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Clocky must be stopped in order to be started. Current status "paused".')
      }
    })

    it('should change the status accordingly', () => {
      clocky.start()
      expect(clocky.isRunning()).to.be.true
      expect(clocky.getStatus()).to.be.eql('running')
    })

    it('should fire the onStart() event with the correct parameters', () => {
      clocky.start()

      expect(start.called).to.be.true
      expect(start.getCall(0).args[0]).to.be.eql(0)
      expect(start.getCall(0).args[1]).to.be.instanceof(Date)
      expect(start.getCall(0).args[2]).to.be.eql(0)
    })
  })

  describe('#pause', () => {
    it('should throw an exception is the current status is wrong', () => {
      try {
        clocky.pause()
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Clocky must be running in order to be paused. Current status "stopped".')
      }
    })

    it('should change the status accordingly', () => {
      clocky.start()
      clocky.pause()
      expect(clocky.isPaused()).to.be.true
      expect(clocky.getStatus()).to.be.eql('paused')
    })

    it('should stop the ticks from happening', () => {
      clocky.start()
      timer.tick(4000)
      clocky.pause()
      timer.tick(4000)

      expect(tick.callCount).to.be.eql(4)
    })

    it('should fire the onPause() event with the correct parameters', () => {
      clocky.start()
      timer.tick(4000)
      clocky.pause()

      expect(pause.called).to.be.true
      expect(pause.getCall(0).args[0]).to.be.eql(4)
      expect(pause.getCall(0).args[1]).to.be.instanceof(Date)
      expect(pause.getCall(0).args[2]).to.be.eql(4)
    })
  })

  describe('#resume', () => {
    it('should throw an exception is the current status is wrong', () => {
      try {
        clocky.resume()
      } catch (error) {
        expect(error).to.be.instanceof(Error)
        expect(error.message).to.be.eql('Clocky must be paused in order to be resumed. Current status "stopped".')
      }
    })

    it('should change the status accordingly', () => {
      clocky.start()
      clocky.pause()
      clocky.resume()
      expect(clocky.isRunning()).to.be.true
      expect(clocky.getStatus()).to.be.eql('running')
    })

    it('should fire the onResume() event with the correct parameters', () => {
      clocky.start()
      timer.tick(1000)
      clocky.pause()
      timer.tick(4000)
      clocky.resume()

      expect(resume.called).to.be.true
      expect(resume.getCall(0).args[0]).to.be.eql(1)
      expect(resume.getCall(0).args[1]).to.be.instanceof(Date)
      expect(resume.getCall(0).args[2]).to.be.eql(5)
    })

    it('should resume the counter', () => {
      clocky.tickEvery(1).start()
      timer.tick(1000)
      clocky.pause()
      timer.tick(4000)
      clocky.resume()
      timer.tick(10000)

      expect(tick.callCount).to.be.eql(11)
    })
  })

  describe('#stop', () => {
    it('should change the status accordingly', () => {
      clocky.start()
      clocky.stop()
      expect(clocky.isStopped()).to.be.true
      expect(clocky.getStatus()).to.be.eql('stopped')
    })

    it('should fire the onStop() event with the correct parameters', () => {
      clocky.start()
      timer.tick(1000)
      clocky.pause()
      timer.tick(4000)
      clocky.resume()
      timer.tick(5000)
      clocky.stop()

      expect(stop.called).to.be.true
      expect(stop.getCall(0).args[0]).to.be.eql(6)
      expect(stop.getCall(0).args[1]).to.be.instanceof(Date)
      expect(stop.getCall(0).args[2]).to.be.eql(10)
    })
  })

  describe('generic', () => {
    it('#on() should bind the {this} pointer inside the callback', () => {
      let clocky = new Clocky({
        'onStart': function () {
          expect(this).to.be.instanceof(Clocky)
        }
      })

      clocky.start()
    })

    it('should allow chaining of methods', () => {
      expect(() => {
        let clocky = new Clocky()
        clocky
          .runFor(4)
          .tickEvery(2)
          .tickOnStart()
          .tickOnResume()
          .onStart(start)
          .onPause(pause)
          .onResume(resume)
          .onStop(stop)
          .start()
          .pause()
          .resume()
          .stop()
      }).to.not.throw(Error)
    })
  })
})
