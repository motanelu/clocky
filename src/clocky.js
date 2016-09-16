/**
 * @param {Date} first
 * @param {Date} second
 */
function datediff (first, second) {
  return Math.round(Math.abs(first.getTime() - second.getTime()) / 1000)
}

export default class Clocky {
  /**
   * @return {string}
   */
  static get STATUS_STOPPED () { return 'stopped' }

  /**
   * @return {string}
   */
  static get STATUS_RUNNING () { return 'running' }

  /**
   * @return {string}
   */
  static get STATUS_PAUSED () { return 'paused' }

  /**
   * @param {Object} options
   * @param {function} [options.onStart]
   * @param {function} [options.onPause]
   * @param {function} [options.onResume]
   * @param {function} [options.onStop]
   * @param {boolean} [options.tickOnResume]
   * @param {boolean} [options.tickOnStart]
   * @param {number} [options.tickEvery]
   * @param {number} [options.runFor]
   */
  constructor (options = {}) {
    /** @type {number} */
    this._ticks = 0

    /** @type {number} */
    this._interval = null

    /** @type {number} */
    this._timeout = null

    /** @type {Date} */
    this._startedAt = null

    /** @type {Date} */
    this._pausedAt = null

    /** @type {String} */
    this._status = Clocky.STATUS_STOPPED

    /** @type {Object} */
    this._config = {
      event: {
        start: null,
        pause: null,
        resume: null,
        stop: null,
        tick: null
      },
      tickOnResume: false,
      tickOnStart: false,
      tickEvery: 1000,
      runFor: 0
    }

    for (let k in options) {
      if (k.indexOf('on') === 0) {
        this.on(k.substr(2).toLowerCase(), options[k])
      } else {
        if (typeof this._config[k] !== 'undefined' && k !== 'event') {
          this[k](options[k])
        }
      }
    }
  }

  /**
   * @param {number} runFor
   * @return {Clocky}
   */
  runFor (runFor) {
    if (isNaN(runFor)) {
      throw new Error(`Method Clocky#runFor() must be called with a number as parameter. Received "${runFor}".`)
    }

    if (this.isRunning()) {
      throw new Error('Method Clocky#runFor() must be called before invoking Clocky#start().')
    }

    this._config.runFor = runFor * 1000
    return this
  }

  /**
   * @param {number} tickEvery
   * @return {Clocky}
   */
  tickEvery (tickEvery) {
    if (isNaN(tickEvery) || tickEvery <= 0) {
      throw new Error(`Method Clocky#tickEvery() must be called with a positive number as parameter. Received "${tickEvery}".`)
    }

    if (this.isRunning()) {
      throw new Error('Method Clocky#tickEvery() must be called before invoking Clocky#start().')
    }

    this._config.tickEvery = tickEvery * 1000
    return this
  }

  /**
   * @param {boolean} tickOnResume
   * @return {Clocky}
   */
  tickOnResume (tickOnResume = true) {
    this._config.tickOnResume = tickOnResume

    return this
  }

  /**
   * @param {boolean} tickOnStart
   * @return {Clocky}
   */
  tickOnStart (tickOnStart = true) {
    this._config.tickOnStart = tickOnStart

    return this
  }

  /**
   * @param {string} event
   * @param {function} callable
   * @return {Clocky}
   */
  on (event, callable) {
    if (typeof this._config.event[event] === 'undefined') {
      throw new Error(`Unknown event: The event must be one of "${Object.keys(this._config.event).join('", "')}". Received "${event}".`)
    }

    if (typeof callable !== 'function') {
      throw new Error(`Invalid callable: The callable's type must be a function. Found "${typeof callable}" instead.`)
    }

    this._config.event[event] = callable

    return this
  }

  /**
   * @param {function} callable
   * @return {Clocky}
   */
  onStart (callable) {
    this.on('start', callable)
    return this
  }

  /**
   * @param {function} callable
   * @return {Clocky}
   */
  onPause (callable) {
    this.on('pause', callable)
    return this
  }

  /**
   * @param {function} callable
   * @return {Clocky}
   */
  onResume (callable) {
    this.on('resume', callable)
    return this
  }

  /**
   * @param {function} callable
   * @return {Clocky}
   */
  onStop (callable) {
    this.on('stop', callable)
    return this
  }

  /**
   * @param {function} callable
   * @return {Clocky}
   */
  onTick (callable) {
    this.on('tick', callable)
    return this
  }

  /**
   * @return {Clocky}
   */
  start () {
    if (!this.isStopped()) {
      throw new Error(`Clocky must be stopped in order to be started. Current status "${this.getStatus()}".`)
    }

    this._status = Clocky.STATUS_RUNNING
    this._ticks = 0
    this._startedAt = new Date()

    this._fire('start')

    if (this._config.tickOnStart) {
      this._tick()
    }

    this._interval = setInterval(this._tick.bind(this), this._config.tickEvery)

    if (this._config.runFor) {
      this._timeout = setTimeout(this.stop.bind(this), this._config.runFor)
    }

    return this
  }

  /**
   * @return {Clocky}
   */
  pause () {
    if (!this.isRunning()) {
      throw new Error(`Clocky must be running in order to be paused. Current status "${this.getStatus()}".`)
    }

    this._status = Clocky.STATUS_PAUSED

    this._pausedAt = new Date()
    clearTimeout(this._timeout)
    clearInterval(this._interval)

    this._fire('pause')

    return this
  }

  /**
   * @return {Clocky}
   */
  resume () {
    if (!this.isPaused()) {
      throw new Error(`Clocky must be paused in order to be resumed. Current status "${this.getStatus()}".`)
    }

    this._status = Clocky.STATUS_RUNNING

    if (this._config.runFor) {
      let remaining = datediff(new Date(), this._pausedAt)
      this._timeout = setTimeout(this.stop.bind(this), this._config.runFor - remaining)
    }

    this._interval = setInterval(this._tick.bind(this), this._config.tickEvery)

    this._fire('resume')

    if (this._config.tickOnResume) {
      this._tick()
    }

    return this
  }

  /**
   * @return {Clocky}
   */
  stop () {
    this._status = Clocky.STATUS_STOPPED

    clearInterval(this._interval)
    clearTimeout(this._timeout)

    this._fire('stop')

    return this
  }

  /**
   * @return {boolean}
   */
  isStopped () {
    return this._status === Clocky.STATUS_STOPPED
  }

  /**
   * @return {boolean}
   */
  isRunning () {
    return this._status === Clocky.STATUS_RUNNING
  }

  /**
   * @return {boolean}
   */
  isPaused () {
    return this._status === Clocky.STATUS_PAUSED
  }

  /**
   * @return {string}
   */
  getStatus () {
    return this._status
  }

  /**
   * @param {string} event
   * @return {undefined}
   */
  _fire (event) {
    if (!this._config.event[event]) {
      return
    }

    this._config.event[event].call(this, this._ticks, this._startedAt, datediff(new Date(), this._startedAt))
  }

  /**
   * @return {undefined}
   */
  _tick () {
    ++this._ticks
    this._fire('tick')
  }
}
