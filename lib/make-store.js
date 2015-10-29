var promise = require('./promise');
var objectAssign = require('./object-assign');

var noop = function() {};

var resolved = function(resolve) {
  resolve();
};

module.exports = function(initialState, listener) {
  var state = objectAssign(initialState);
  listener = listener || noop;
  return {
    getState: function() {
      return state;
    },
    dispatch: function(reaction) {
      var result = reaction(state[reaction.key]);
      if (typeof result.then === 'function') {
        return result.then(function(newState) {
          objectAssign(state[reaction.key], newState);
          listener(state);
        });
      }
      objectAssign(state[reaction.key], result);
      listener(state);
      return promise(resolved);
    }
  };
};
