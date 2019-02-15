const isFunction = require('lodash/isFunction');
const Emitter = require('./Emitter');
const Parser = require('./Parser');
const Storage = require('./Storage');

/**
 * Repo class
 * @param {Object} [options]
 * @param {string} [options.divide="."]
 * @param {string} [options.escape="\\"]
 * @constructor
 */
module.exports = function Repo(options = {}) {
  const parser = new Parser(options.divide, options.escape);
  const storage = new Storage();
  const emitter = new Emitter();
  const names = Object.keys(storage);

  names.forEach((name) => {

    /**
     * Cover storage access for event emitter
     * @param {string|string[]} path
     * @param {*} [args]
     * @returns {*}
     */
    this[name] = function (path, ...args) {
      const aPath = Array.isArray(path) ? path : parser.explode(path);
      const sPath = Array.isArray(path) ? parser.implode(path) : path;
      const issue = storage[name](aPath, ...args);
      emitter.emit(name, sPath, issue, args);
      return issue;
    };
  });

  Object.assign(this, {on, once});

  /**
   * Add event listener
   * @param {string|string[]} action
   * @param {string|RegExp} query
   * @param {Function} callback
   * @param {number} [calls]
   * @returns {Function}
   */
  function on(action, query, callback, calls) {
    if (!isFunction(callback)) {
      throw new Error('Callback must be a Function.');
    }

    const actions = (Array.isArray(action) ? action : action.split(/[^a-z]+/i))
      .map((action) => action.toLowerCase())
      .filter((action) => names.indexOf(action) >= 0);
    if (!actions.length) {
      throw new Error('Action must be at least one of ' + Object.keys(storage).join(', ') + '.');
    }

    const pattern = query instanceof RegExp ? query : parser.matcher(query);
    const context = {actions, pattern, callback};
    return emitter.on(listener.bind(context), calls);
  }

  /**
   * Add event listener for one time execution
   * @param {string|string[]} action
   * @param {string|RegExp} query
   * @param {Function} callback
   * @returns {Function}
   */
  function once(action, query, callback) {
    return on(action, query, callback, 1);
  }
};

/**
 * Callback execution
 * @param {string} action
 * @param {string} path
 * @param {*} issue
 * @param {Array} args
 */
function listener(action, path, issue, args) {
  if (this.actions.indexOf(action) >= 0 && this.pattern.test(path)) {
    this.callback(issue, ...args);
  }
}
