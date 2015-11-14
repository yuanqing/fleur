var each = require('savoy').each;
var promise = require('./promise');
var objectAssign = require('./assign');

var resolved = function(resolve) {
  resolve();
};

var nextTick = process ? process.nextTick : function(callback) {
  setTimeout(callback, 0);
};

module.exports = function(initialState) {
  var state = objectAssign({}, initialState || {});
  var listeners = [];
  var onStateChange = function(key, newState) {
    state[key] = state[key] || {};
    objectAssign(state[key], newState);
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
        return;
      }
      listeners.push(listener);
    },
    removeListener: function(listener) {
      var index = listeners.indexOf(listener);
      if (index !== -1) {
        return;
      }
      listeners.splice(index, 1, listener);
    },
    dispatch: function(action) {
      var key = action.key;
      var result = action(state[key]);
      if (typeof result === 'function') {
        return promise(result).then(function(newState) {
          onStateChange(key, newState);
        });
      }
      nextTick(function() {
        onStateChange(key, result);
      });
      return promise(resolved);
    }
  };
};
