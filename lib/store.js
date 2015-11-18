var promise = require('./promise');
var assign = require('./assign');

var resolved = function(resolve) {
  resolve();
};

var noop = function() {};

module.exports = function(options) {
  options = options || {};
  var state = assign(options.initialState || {});
  var listener = options.listener || noop;
  return {
    getState: function() {
      return state;
    },
    dispatch: function dispatch(action) {
      var key = action.key;
      var result = action(state[key] || {}, dispatch);
      var setState = function(result) {
        state[key] = result;
        listener(state);
      };
      if (typeof result.then === 'function') {
        return result.then(setState);
      }
      setState(result);
      return promise(resolved);
    }
  };
};
