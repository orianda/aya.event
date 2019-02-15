const expect = require('chai').expect;
const Parser = require('../src/Parser');
const CHARS = ['a', '/', '\\/'];
const LENGTH = 4;

describe('Parser', () => {
  const parser = new Parser('/');

  describe('throws', () => {

    it('should throw error', () => {
      const fn = () => new Parser('h', 'h');
      expect(fn).to.throw(Error);
    });
  });

  describe('explode & implode', () => {

    'x'
      .repeat(LENGTH + 1)
      .split('')
      .map((value, index) => index)
      .map((length) => 'x'
        .repeat(Math.pow(CHARS.length, length))
        .split('')
        .map((value, index) => index)
        .map((index) => index
          .toString(CHARS.length)
          .padStart(length, '0')
          .split('')
          .map((index) => CHARS[index])
          .join('')))
      .reduce((result, value) => result.concat(value), [])
      .forEach((test, index) => {

        it('should pass test ' + index, () => {
          const array = parser.explode(test);
          const string = parser.implode(array);
          expect(string).to.equal(test);
        });
      });
  });

  describe('pending escape', () => {

    it('should add last escape', () => {
      const value = parser.explode('path\\');
      expect(value).to.deep.equal(['path\\']);
    });
  });

  describe('matches', () => {

    [{
      path: 'path/to/file.js',
      glob: '.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/*.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '**/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/*/*.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '**/*/*.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/**/*.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '**/**/*.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/*/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '**/*/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/**/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '**/**/**.js',
      pass: true
    }, {
      path: 'path/to/file.js',
      glob: '*/*/*/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/*/*/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/**/*/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/**/*/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/*/**/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/*/**/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/**/**/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/**/**/*.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/*/*/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/*/*/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/**/*/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/**/*/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/*/**/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/*/**/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '*/**/**/**.js',
      pass: false
    }, {
      path: 'path/to/file.js',
      glob: '**/**/**/**.js',
      pass: false
    }, {
      path: 'path\\/to/file.js',
      glob: '*/*.js',
      pass: true
    }, {
      path: 'path/to\\/file.js',
      glob: '*/*.js',
      pass: true
    }, {
      path: 'path\\/to\\/file.js',
      glob: '*/*.js',
      pass: false
    }, {
      path: 'path\\/to\\/file.js',
      glob: '*.js',
      pass: true
    }, {
      path: 'path\\/to/file.js',
      glob: '**/**.js',
      pass: true
    }, {
      path: 'path/to\\/file.js',
      glob: '**/**.js',
      pass: true
    }, {
      path: 'path\\/to\\/file.js',
      glob: '**/**.js',
      pass: false
    }, {
      path: 'path\\/to\\/file.js',
      glob: '**.js',
      pass: true
    }].forEach((test, index) => {

      it('should pass test ' + index, () => {
        const valid = parser
          .matcher(test.glob)
          .test(test.path);
        expect(valid).to.equal(test.pass);
      });
    });
  });
});
