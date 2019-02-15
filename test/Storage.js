const expect = require('chai').expect;
const Storage = require('../src/Storage');

describe('Storage ', () => {
  const storage = new Storage();

  it('should has nothing', () => {
    const issue = storage.has('path/to/nothing');
    expect(issue).to.equal(false);
  });

  it('should get nothing', () => {
    const issue = storage.get('path/to/noting');
    expect(issue).to.be.a('undefined');
  });

  it('should get nothing', () => {
    const issue = storage.get('path/to/noting', 'fallback');
    expect(issue).to.equal('fallback');
  });

  it('should add', () => {
    const issue = storage.add('path/to/new', 'new value');
    expect(issue).to.equal(true);

    const value = storage.get('path/to/new');
    expect(value).to.equal('new value');
  });

  it('should not add',()=>{
    const issue = storage.add('path/to/new', 'old value');
    expect(issue).to.equal(false);

    const value = storage.get('path/to/new');
    expect(value).to.equal('new value');
  });

  it('should mod', () => {
    const issue = storage.mod('path/to/new', 'old value');
    expect(issue).to.equal(true);

    const value = storage.get('path/to/new');
    expect(value).to.equal('old value');
  });

  it('should not mod',()=>{
    const issue = storage.mod('path/to/another', 'old value');
    expect(issue).to.equal(false);

    const value = storage.has('path/to/another');
    expect(value).to.equal(false);
  });

  it('should set existing',()=>{
    const issue = storage.set('path/to/new', 'old value');
    expect(issue).to.equal(true);

    const value = storage.get('path/to/new');
    expect(value).to.equal('old value');
  });

  it('should set new',()=>{
    const issue = storage.set('path/to/another', 'old value');
    expect(issue).to.equal(true);

    const value = storage.get('path/to/another');
    expect(value).to.equal('old value');
  });

  it('should rid existing',()=>{
    const issue = storage.rid('path/to/new');
    expect(issue).to.equal(true);

    const value = storage.has('path/to/new');
    expect(value).to.equal(false);
  });

  it('should rid nothing',()=>{
    const issue = storage.rid('path/to/nothing');
    expect(issue).to.equal(false);

    const value = storage.has('path/to/nothing');
    expect(value).to.equal(false);
  });
});
