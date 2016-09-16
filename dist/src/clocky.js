'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Date} first
 * @param {Date} second
 */
function datediff(first, second) {
  return Math.round(Math.abs(first.getTime() - second.getTime()) / 1000);
}

var Clocky = function () {
  (0, _createClass3.default)(Clocky, null, [{
    key: 'STATUS_STOPPED',

    /**
     * @return {string}
     */
    get: function get() {
      return 'stopped';
    }

    /**
     * @return {string}
     */

  }, {
    key: 'STATUS_RUNNING',
    get: function get() {
      return 'running';
    }

    /**
     * @return {string}
     */

  }, {
    key: 'STATUS_PAUSED',
    get: function get() {
      return 'paused';
    }

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

  }]);

  function Clocky() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Clocky);

    /** @type {number} */
    this._ticks = 0;

    /** @type {number} */
    this._interval = null;

    /** @type {number} */
    this._timeout = null;

    /** @type {Date} */
    this._startedAt = null;

    /** @type {Date} */
    this._pausedAt = null;

    /** @type {String} */
    this._status = Clocky.STATUS_STOPPED;

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
    };

    for (var k in options) {
      if (k.indexOf('on') === 0) {
        this.on(k.substr(2).toLowerCase(), options[k]);
      } else {
        if (typeof this._config[k] !== 'undefined' && k !== 'event') {
          this[k](options[k]);
        }
      }
    }
  }

  /**
   * @param {number} runFor
   * @return {Clocky}
   */


  (0, _createClass3.default)(Clocky, [{
    key: 'runFor',
    value: function runFor(_runFor) {
      if (isNaN(_runFor)) {
        throw new Error('Method Clocky#runFor() must be called with a number as parameter. Received "' + _runFor + '".');
      }

      if (this.isRunning()) {
        throw new Error('Method Clocky#runFor() must be called before invoking Clocky#start().');
      }

      this._config.runFor = _runFor * 1000;
      return this;
    }

    /**
     * @param {number} tickEvery
     * @return {Clocky}
     */

  }, {
    key: 'tickEvery',
    value: function tickEvery(_tickEvery) {
      if (isNaN(_tickEvery) || _tickEvery <= 0) {
        throw new Error('Method Clocky#tickEvery() must be called with a positive number as parameter. Received "' + _tickEvery + '".');
      }

      if (this.isRunning()) {
        throw new Error('Method Clocky#tickEvery() must be called before invoking Clocky#start().');
      }

      this._config.tickEvery = _tickEvery * 1000;
      return this;
    }

    /**
     * @param {boolean} tickOnResume
     * @return {Clocky}
     */

  }, {
    key: 'tickOnResume',
    value: function tickOnResume() {
      var _tickOnResume = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this._config.tickOnResume = _tickOnResume;

      return this;
    }

    /**
     * @param {boolean} tickOnStart
     * @return {Clocky}
     */

  }, {
    key: 'tickOnStart',
    value: function tickOnStart() {
      var _tickOnStart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this._config.tickOnStart = _tickOnStart;

      return this;
    }

    /**
     * @param {string} event
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'on',
    value: function on(event, callable) {
      if (typeof this._config.event[event] === 'undefined') {
        throw new Error('Unknown event: The event must be one of "' + (0, _keys2.default)(this._config.event).join('", "') + '". Received "' + event + '".');
      }

      if (typeof callable !== 'function') {
        throw new Error('Invalid callable: The callable\'s type must be a function. Found "' + (typeof callable === 'undefined' ? 'undefined' : (0, _typeof3.default)(callable)) + '" instead.');
      }

      this._config.event[event] = callable;

      return this;
    }

    /**
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'onStart',
    value: function onStart(callable) {
      this.on('start', callable);
      return this;
    }

    /**
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'onPause',
    value: function onPause(callable) {
      this.on('pause', callable);
      return this;
    }

    /**
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'onResume',
    value: function onResume(callable) {
      this.on('resume', callable);
      return this;
    }

    /**
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'onStop',
    value: function onStop(callable) {
      this.on('stop', callable);
      return this;
    }

    /**
     * @param {function} callable
     * @return {Clocky}
     */

  }, {
    key: 'onTick',
    value: function onTick(callable) {
      this.on('tick', callable);
      return this;
    }

    /**
     * @return {Clocky}
     */

  }, {
    key: 'start',
    value: function start() {
      if (!this.isStopped()) {
        throw new Error('Clocky must be stopped in order to be started. Current status "' + this.getStatus() + '".');
      }

      this._status = Clocky.STATUS_RUNNING;
      this._ticks = 0;
      this._startedAt = new Date();

      this._fire('start');

      if (this._config.tickOnStart) {
        this._tick();
      }

      this._interval = setInterval(this._tick.bind(this), this._config.tickEvery);

      if (this._config.runFor) {
        this._timeout = setTimeout(this.stop.bind(this), this._config.runFor);
      }

      return this;
    }

    /**
     * @return {Clocky}
     */

  }, {
    key: 'pause',
    value: function pause() {
      if (!this.isRunning()) {
        throw new Error('Clocky must be running in order to be paused. Current status "' + this.getStatus() + '".');
      }

      this._status = Clocky.STATUS_PAUSED;

      this._pausedAt = new Date();
      clearTimeout(this._timeout);
      clearInterval(this._interval);

      this._fire('pause');

      return this;
    }

    /**
     * @return {Clocky}
     */

  }, {
    key: 'resume',
    value: function resume() {
      if (!this.isPaused()) {
        throw new Error('Clocky must be paused in order to be resumed. Current status "' + this.getStatus() + '".');
      }

      this._status = Clocky.STATUS_RUNNING;

      if (this._config.runFor) {
        var remaining = datediff(new Date(), this._pausedAt);
        this._timeout = setTimeout(this.stop.bind(this), this._config.runFor - remaining);
      }

      this._interval = setInterval(this._tick.bind(this), this._config.tickEvery);

      this._fire('resume');

      if (this._config.tickOnResume) {
        this._tick();
      }

      return this;
    }

    /**
     * @return {Clocky}
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._status = Clocky.STATUS_STOPPED;

      clearInterval(this._interval);
      clearTimeout(this._timeout);

      this._fire('stop');

      return this;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isStopped',
    value: function isStopped() {
      return this._status === Clocky.STATUS_STOPPED;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isRunning',
    value: function isRunning() {
      return this._status === Clocky.STATUS_RUNNING;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isPaused',
    value: function isPaused() {
      return this._status === Clocky.STATUS_PAUSED;
    }

    /**
     * @return {string}
     */

  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this._status;
    }

    /**
     * @param {string} event
     * @return {undefined}
     */

  }, {
    key: '_fire',
    value: function _fire(event) {
      if (!this._config.event[event]) {
        return;
      }

      this._config.event[event].call(this, this._ticks, this._startedAt, datediff(new Date(), this._startedAt));
    }

    /**
     * @return {undefined}
     */

  }, {
    key: '_tick',
    value: function _tick() {
      ++this._ticks;
      this._fire('tick');
    }
  }]);
  return Clocky;
}();

exports.default = Clocky;