var map = require('savoy').map;

var slice = function(args) {
  return [].slice.call(args);
};

module.exports = function(key, specification) {
  return map(specification, function(action) {
    return function() {
      var args = slice(arguments);
      var wrapper = function() {
        return action.apply(null, args);
      };
      wrapper.key = key;
      return wrapper;
    };
  });
};
