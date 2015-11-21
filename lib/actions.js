var map = require('savoy').map;

module.exports = function(key, specification) {
  return map(specification, function(action, actionName) {
    return function() {
      var actionArguments = [].slice.call(arguments);
      var wrapper = function(state, dispatch) {
        return action.apply(this, [state, dispatch].concat(actionArguments));
      };
      wrapper.key = key;
      wrapper.actionName = actionName;
      return wrapper;
    };
  });
};
