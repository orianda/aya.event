const chai = require('chai');
const sinon = require('sinon');
const noop = require('lodash/noop');
const Emitter = require('../src/Emitter');
const expect = chai.expect;

chai.use(require('sinon-chai'));

describe('Emitter ', () => {
  let emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should not be possible to change the length', () => {
    emitter.length = 10;
    expect(emitter.length).to.equal(0);
    emitter.on(noop);
    expect(emitter.length).to.equal(1);
    emitter.length = 0;
    expect(emitter.length).to.equal(1);
  });

  describe('on', () => {

    it('should fail on invalid callback', () => {
      expect(emitter.on).to.throw('Callback must be a Function.');
    });

    it('should return noop if calls is not greater or equals to 0', () => {
      const callback = sinon.fake();
      const off = emitter.on(callback, 0);
      expect(off).to.equal(noop);
    });

    it('should not register double', () => {
      const callback = sinon.fake();
      const off1 = emitter.on(callback);
      const off2 = emitter.on(callback);
      expect(emitter.length).to.equal(1);
      const issue1 = off1();
      expect(issue1).to.equal(true);
      expect(emitter.length).to.equal(0);
      const issue2 = off2();
      expect(issue2).to.equal(false);
      expect(emitter.length).to.equal(0);
    });
  });

  describe('off', () => {

    it('should remove known listener', () => {
      const callback1 = sinon.fake();
      const callback2 = sinon.fake();
      emitter.on(callback1);
      emitter.on(callback2);
      expect(emitter.length).to.equal(2);
      emitter.off(callback1);
      expect(emitter.length).to.equal(1);
      emitter.off(callback1);
      expect(emitter.length).to.equal(1);
    });
  });

  describe('once', () => {
    let callback, emitter, off;

    before(() => {
      callback = sinon.fake.returns('issue');
      emitter = new Emitter();
      off = emitter.once(callback);
    });

    it('should have one listener', () => {
      expect(emitter.length).to.equal(1);
    });

    it('should trigger the first time', () => {
      const issue = emitter.emit('test1');
      expect(issue).to.deep.equal(['issue']);
    });

    it('should have no listener', () => {
      expect(emitter.length).to.equal(0);
    });

    it('should not trigger the second time', () => {
      const issue = emitter.emit('test2');
      expect(issue).to.deep.equal([]);
    });

    it('should have been called once', () => {
      expect(callback).to.have.been.callCount(1);
      expect(callback).to.have.been.calledWith('test1');
    });

    it('should noting change on calling off()', () => {
      const issue = off();
      expect(issue).to.equal(false);
    });
  });
});
