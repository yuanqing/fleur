var map = require('savoy').map;
var promise = require('./promise');

module.exports = function(key, reactions) {
  return map(reactions, function(reaction) {
    var fn = function(state) {
      return reaction(state, promise);
    };
    fn.key = key;
    return fn;
  });
};
