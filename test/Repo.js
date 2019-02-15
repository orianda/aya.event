const chai = require('chai');
const sinon = require('sinon');
const Repo = require('../src/Repo');
const expect = chai.expect;

chai.use(require('sinon-chai'));

describe('Repo ', () => {
  const issues = {
    has: false,
    get: 'some value',
    add: true,
    mod: false,
    set: true,
    rid: false
  };
  const names = Object.keys(issues);
  let repo;

  names.forEach((name) => {

    describe(name, () => {
      const callbacks = {};

      beforeEach(() => {
        repo = new Repo({divide: '/'});
        names.forEach((name) => {
          callbacks[name] = sinon.fake();
          repo.on(name, 'some/path', callbacks[name]);
        });
        callbacks.all = sinon.fake();
        repo.on(names.join(), 'some/path', callbacks.all);
      });

      describe('some/path', () => {

        beforeEach(() => {
          repo[name]('some/path', 'some value');
        });

        names
          .filter((n) => n !== name)
          .forEach((n) => {

            it('should not call the ' + n + ' callback', () => {
              expect(callbacks[n]).to.have.been.callCount(0);
            });
          });

        it('should call the ' + name + ' callback', () => {
          expect(callbacks[name]).to.have.been.calledWith(issues[name], 'some value');
        });

        it('should call the all callback', () => {
          expect(callbacks.all).to.have.been.calledWith(issues[name], 'some value');
        });
      });

      describe('some/other/path', () => {

        beforeEach(() => {
          repo[name]('some/other/path', 'some value');
        });

        it('should not call the ' + name + ' callback for other path', () => {
          expect(callbacks[name]).to.have.been.callCount(0);
        });

        it('should call the all callback for other path', () => {
          expect(callbacks.all).to.have.been.callCount(0);
        });
      });
    });
  });

  describe('Errors', () => {

    beforeEach(() => {
      repo = new Repo();
    });

    it('should fail on invalid callback', () => {
      const test = () => repo.on('get');
      expect(test).to.throw('Callback must be a Function.');
    });

    it('should fail on invalid action', () => {
      const test = () => repo.on('unknown', 'some/path', () => undefined);
      expect(test).to.throw('Action must be at least one of has, get, add, mod, set, rid.');
    });
  });

  describe('once', () => {

    names.forEach((name) => {

      describe(name, () => {
        let callback;

        beforeEach(() => {
          callback = sinon.fake();
          repo = new Repo({divide: '/'});
          repo.once(name, 'some/path', callback);
          repo[name]('some/path', 'some value');
          repo[name]('some/path', 'some value');
        });

        it('should have been called once', () => {
          expect(callback).to.have.been.callCount(1);
        });
      });
    });
  });
});
