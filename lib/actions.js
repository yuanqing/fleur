var map = require('savoy').map;

module.exports = function(key, specification) {
  return map(specification, function(action) {
    return function() {
      var actionArguments = [].slice.call(arguments);
      var wrapper = function(state, dispatch) {
        return action.apply(this, [state, dispatch].concat(actionArguments));
      };
      wrapper.key = key;
      return wrapper;
    };
  });
};
