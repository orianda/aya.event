const exists = require('lodash/has');
const getter = require('lodash/get');
const setWith = require('lodash/setWith');
const unset = require('lodash/unset');

/**
 * Storage class
 * @constructor
 */
module.exports = function Storage() {
  const data = {};

  Object.assign(this, {has, get, add, mod, set, rid});

  /**
   * Does the value exists?
   * @param {string|string[]} path
   * @returns {boolean}
   */
  function has(path) {
    return exists(data, path);
  }

  /**
   * Get the value
   * @param {string|string[]} path
   * @param {*} [fallback]
   * @returns {*}
   */
  function get(path, fallback) {
    return getter(data, path, fallback);
  }

  /**
   * Create the value
   * @param {string|string[]} path
   * @param {*} value
   * @param {Function} [customizer]
   * @returns {boolean}
   */
  function add(path, value, customizer) {
    return !has(path) && !!set(path, value, customizer);
  }

  /**
   * Update the value
   * @param {string|string[]} path
   * @param {*} value
   * @returns {boolean}
   */
  function mod(path, value) {
    return has(path) && !!set(path, value);
  }

  /**
   * Create or update value
   * @param {string|string[]} path
   * @param {*} value
   * @param {Function} [customizer]
   * @returns {boolean}
   */
  function set(path, value, customizer) {
    return !!setWith(data, path, value, customizer);
  }

  /**
   * Delete the value
   * @param {string|string[]} path
   * @returns {boolean}
   */
  function rid(path) {
    return !has(path) ? false : unset(data, path);
  }
};
