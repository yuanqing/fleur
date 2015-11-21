var test = require('tape');
var Fleur = require('../..');

test('without passing in `initialState`', function(t) {
  t.plan(1);
  var store = Fleur.store();
  var state = store.getState();
  t.looseEqual(state, {});
});

test('passing in `initialState`', function(t) {
  t.plan(2);
  var initialState = {
    foo: {
      bar: 42
    }
  };
  var store = Fleur.store({
    initialState: initialState
  });
  var state = store.getState();
  t.looseEqual(state, {
    foo: {
      bar: 42
    }
  });
  t.notEqual(state, initialState);
});
