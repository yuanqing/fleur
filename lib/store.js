var each = require('savoy').each;
var promise = require('./promise');
var assign = require('./assign');

var resolved = function(resolve) {
  resolve();
};

module.exports = function(initialState) {
  var state = assign(initialState || {});
  var listeners = [];
  var notifyListeners = function() {
    each(listeners, function(listener) {
      listener(state);
    });
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
      return true;
    },
    removeListener: function(listener) {
      var index = listeners.indexOf(listener);
      if (index === -1) {
        return false;
      }
      listeners.splice(index, 1, listener);
      return true;
    },
    dispatch: function dispatch(action) {
      var key = action.key;
      var result = action(state[key] || {}, dispatch);
      var setState = function(result) {
        state[key] = result;
        notifyListeners();
      };
      if (typeof result.then === 'function') {
        return result.then(setState);
      }
      setState(result);
      return promise(resolved);
    }
  };
};
