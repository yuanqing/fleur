var promise = require('./promise');
var objectAssign = require('object-assign');

var resolved = function(resolve) {
  resolve();
};

var noop = function() {};

module.exports = function(options) {
  options = options || {};
  var state = objectAssign({}, options.initialState || {});
  var listener = options.listener || noop;
  var middleware = [].concat(options.middleware || []);
  var dispatch = function(action) {
    var key = action.key;
    state[key] = state[key] || {};
    var result = action(state[key], dispatch);
    var setState = function(result) {
      if (result) {
        objectAssign(state[key], result);
        listener(state);
      }
    };
    if (typeof result.then === 'function') {
      return result.then(setState);
    }
    setState(result);
    return promise(resolved);
  };
  var i = middleware.length;
  while (i-- > 0) {
    dispatch = middleware[i](state, dispatch);
  }
  return {
    getState: function() {
      return state;
    },
    dispatch: dispatch
  };
};
