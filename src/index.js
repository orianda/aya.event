['Emitter', 'Parser', 'Repo', 'Storage', 'wrapper'].forEach((name) => {
  module.exports[name] = require('./' + name);
});
