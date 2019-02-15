const Emitter = require('./Emitter');

/**
 * Wrap given function
 * @param {Function} fn
 * @return {Function}
 */
module.exports = function (fn) {
  const preEmitter = new Emitter();
  const postEmitter = new Emitter();

  wrapper.fn = fn;
  wrapper.on = on;
  wrapper.off = off;
  wrapper.once = once;

  Object.defineProperty(wrapper, 'length', {
    configurable: false,
    enumerable: false,
    get: () => preEmitter.length + postEmitter.length,
    set: () => {
    }
  });

  return wrapper;

  /**
   * Wrap given function
   * @type {Function}
   * @returns {*}
   */
  function wrapper(...args) {
    preEmitter.emit(...args);
    const issue = fn.call(this, ...args);
    postEmitter.emit(issue, ...args);
    return issue;
  }

  /**
   * Register post listener
   * @param {Function} listener
   * @param {boolean} [pre=false]
   * @param {number} [calls]
   * @returns {Function}
   */
  function on(listener, pre, calls) {
    const emitter = pre ? preEmitter : postEmitter;
    return emitter.on(listener, calls);
  }

  /**
   * Remove listener
   * @param {Function} listener
   * @param {boolean} [pre=false]
   * @returns {number}
   */
  function off(listener, pre) {
    const emitter = pre ? preEmitter : postEmitter;
    return emitter.off(listener);
  }

  /**
   * Register listener to be executed once
   * @param {Function} listener
   * @param {boolean} [pre=false]
   * @returns {Function}
   */
  function once(listener, pre) {
    const emitter = pre ? preEmitter : postEmitter;
    return emitter.once(listener);
  }
};
