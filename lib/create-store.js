var each = require('savoy').each;
var promise = require('./promise');
var objectAssign = require('object-assign');

var resolved = function(resolve) {
  resolve();
};

module.exports = function(initialState) {
  var state = objectAssign({}, initialState || {});
  var listeners = [];
  var dispatch = function(action) {
    var key = action.key;
    state[key] = state[key] || {};
    var result = action(state[key], dispatch);
    var setState = function(result) {
      if (result) {
        objectAssign(state[key], result);
        each(listeners, function(listener) {
          listener(state);
        });
      }
    };
    if (typeof result.then === 'function') {
      return result.then(setState);
    }
    setState(result);
    return promise(resolved);
  };
  return {
    getState: function() {
      return state;
    },
    addListener: function(listener) {
      if (listeners.indexOf(listener) !== -1) {
        return false;
      }
      listeners.push(listener);
      return function() {
        var index = listeners.indexOf(listener);
        if (index === -1) {
          return false;
        }
        listeners.splice(index, 1, listener);
      };
    },
    dispatch: dispatch
  };
};
