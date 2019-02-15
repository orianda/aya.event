const escapeRegExp = require('lodash/escapeRegExp');

/**
 * Parser class
 * @param {string} [divide="."]
 * @param {string} [escape="\\"]
 * @constructor
 */
module.exports = function Parser(divide = '.', escape = '\\') {
  const divideExp = escapeRegExp(divide);
  const divideAll = new RegExp(divideExp, 'g');
  const escapeExp = escapeRegExp(escape);
  const escapeAll = new RegExp(escapeExp, 'g');
  const starExp = '([^' + escapeExp + divideExp + ']|' + escapeExp + divideExp + '|' + escapeExp + escapeExp + ')*';
  const starAll = '([^' + escapeExp + divideExp + ']|' + escapeExp + divideExp + '|' + escapeExp + escapeExp + '|' + divideExp + ')*';

  if (divide === escape) {
    throw new Error('The divide and escape character must not be equal!');
  }

  Object.assign(this, {explode, implode, matcher});

  /**
   * Explode path string
   * @param {string} string
   * @returns {string[]}
   */
  function explode(string) {
    const array = [];
    const chunk = [];
    let escaped = false;
    for (let i = 0, l = string.length; i < l; i++) {
      let char = string[i];
      if (escaped) {
        escaped = false;
        chunk.push(char);
      } else if (char === escape) {
        escaped = true;
      } else if (char === divide) {
        array.push(chunk.join(''));
        chunk.length = 0;
      } else {
        chunk.push(char);
      }
    }
    if (escaped) {
      chunk.push(escape);
    }
    array.push(chunk.join(''));
    return array;
  }

  /**
   * Implode path array
   * @param {string[]} array
   * @returns {string}
   */
  function implode(array) {
    return array
      .map((chunk) => chunk
        .replace(escapeAll, escape + escape)
        .replace(divideAll, escape + divide)
      )
      .join(divide);
  }

  /**
   * Converts glob pattern to regular expression
   * @param {string} glob
   * @returns {RegExp}
   */
  function matcher(glob) {
    const exp = glob
      .split(/(\*\*)+/)
      .map((chunk) => chunk
        .split('*')
        .map(escapeRegExp)
        .join(starExp)
      )
      .join(starAll);
    return new RegExp('^' + exp + '$');
  }
};
