const isFunction = require('lodash/isFunction');
const noop = require('lodash/noop');
const remove = require('lodash/remove');
const findIndex = require('lodash/findIndex');
const pull = require('lodash/pull');

/**
 * Create event emitter
 * @returns {Object}
 * @constructor
 */
module.exports = function Emitter() {
  const listeners = [];

  Object.assign(this, {on, off, once, emit});

  Object.defineProperty(this, 'length', {
    configurable: false,
    enumerable: false,
    get: () => listeners.length,
    set: () => {
    }
  });

  /**
   * Registers a callback
   * @param {Function} callback
   * @param {number} [calls=Infinity]
   * @returns {Function}
   */
  function on(callback, calls = Infinity) {
    if (!isFunction(callback)) {
      throw new Error('Callback must be a Function.');
    }

    const valid = calls > 0;
    if (!valid) {
      return noop;
    }

    const index = findIndex(listeners, {callback});
    const listener = index < 0 ? {callback, calls, off} : listeners[index];
    if (index < 0) {
      listeners.push(listener);
    }
    return off;

    /**
     * Removes the registered callback
     * @returns {boolean}
     */
    function off() {
      return listeners.length - pull(listeners, listener).length > 0;
    }
  }

  /**
   * Unregisters a callback
   * @param {Function} callback
   * @returns {number}
   */
  function off(callback) {
    return remove(listeners, {callback}).length;
  }

  /**
   * Registers a callback for one time execution
   * @param {Function} callback
   * @returns {Function}
   */
  function once(callback) {
    return on(callback, 1);
  }

  /**
   * Trigger callbacks
   * @param {*} [args]
   * @returns {*[]}
   */
  function emit(...args) {
    const issue = listeners.map((listener) => listener.callback(...args));
    listeners.forEach((listener) => listener.calls--);
    listeners.forEach((listener) => listener.calls || listener.off());
    return issue;
  }
};

