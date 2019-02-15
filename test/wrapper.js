const chai = require('chai');
const sinon = require('sinon');
const wrapper = require('../src/wrapper');
const expect = chai.expect;

chai.use(require('sinon-chai'));

describe('wrapper ', () => {

  describe('interface', () => {
    let fn, wp;

    beforeEach(() => {
      fn = sinon.fake();
      wp = wrapper(fn);
    });

    it('should have fn', () => {
      expect(wp.fn).to.equal(fn);
    });

    it('should have on', () => {
      expect(wp.on).to.be.an('function');
    });

    it('should have off', () => {
      expect(wp.off).to.be.an('function');
    });

    it('should have once', () => {
      expect(wp.once).to.be.an('function');
    });
  });

  describe('on', () => {
    let fn, cb, issue;

    beforeEach(() => {
      fn = sinon.stub().callsFake(() => {
        return 'fn issue';
      });
      cb = sinon.stub().callsFake(() => {
        return 'cb issue';
      });
      const wp = wrapper(fn);
      wp.on(cb);
      issue = wp('arg1', 'arg2', 'arg3');
    });

    it('should forward arguments', () => {
      expect(fn).to.have.callCount(1);
      expect(fn).to.have.calledWith('arg1', 'arg2', 'arg3');
    });

    it('should report issue and arguments', () => {
      expect(cb).to.have.callCount(1);
      expect(cb).to.have.calledWith('fn issue', 'arg1', 'arg2', 'arg3');
    });

    it('should output issue', () => {
      expect(issue).to.equal('fn issue');
    });
  });

  [false, true].forEach((pre) => {

    describe(pre ? 'pre' : 'post', () => {
      const calls = [];

      beforeEach(() => {
        const fn = () => {
          calls.push('fn');
        };
        const cb = () => {
          calls.push('cb');
        };
        const wp = wrapper(fn);
        wp.on(cb, pre);
        wp();
      });

      it(pre ? 'should call cb before fn' : 'should call cb after fn', () => {
        const expectation = pre ? ['cb', 'fn'] : ['fn', 'cb'];
        expect(calls).to.deep.equal(expectation);
      });
    });
  });

  describe('off', () => {

    [false, true].forEach((pre) => {

      describe(pre ? 'pre' : 'post', () => {
        let fn, cb, wp, off;

        beforeEach(() => {
          fn = sinon.stub();
          cb = sinon.stub();
          wp = wrapper(fn);
          off = wp.on(cb, pre);
        });

        it('should call twice', () => {
          wp();
          wp();
          expect(cb).to.have.callCount(2);
        });

        it('should unregister by public off', () => {
          wp();
          expect(cb).to.have.callCount(1);

          const issue = wp.off(cb, pre);
          expect(issue).to.equal(1);

          wp();
          expect(cb).to.have.callCount(1);
        });

        it('should unregister by private off', () => {
          wp();
          expect(cb).to.have.callCount(1);

          const issue = off();
          expect(issue).to.equal(true);

          wp();
          expect(cb).to.have.callCount(1);
        });
      });
    });
  });

  describe('once', () => {

    [false, true].forEach((pre) => {

      describe(pre ? 'pre' : 'post', () => {
        let fn, cb, wp;

        beforeEach(() => {
          fn = sinon.stub();
          cb = sinon.stub();
          wp = wrapper(fn);
          wp.once(cb, pre);
        });

        it('should call once', () => {
          wp();
          wp();
          expect(cb).to.have.callCount(1);
        });
      });
    });
  });

  describe('length', () => {
    let wp;

    beforeEach(() => {
      const fn = () => undefined;
      wp = wrapper(fn);
    });

    [0, 1, 2, 3].forEach((amount) => {

      describe(amount.toString(), () => {

        beforeEach(() => {
          'x'
            .repeat(amount)
            .split('')
            .forEach(() => {
              const cb = () => undefined;
              wp.on(cb);
            });
        });

        it('should have length', () => {
          expect(wp.length).to.equal(amount);
        });

        it('should not change length', () => {
          wp.length = 0;
          expect(wp.length).to.equal(amount);
        });
      });
    });
  });
});
