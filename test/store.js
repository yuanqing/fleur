var test = require('tape');
var Fleur = require('..');

test('without `initialState`', function(t) {
  t.plan(1);
  var store = Fleur.store();
  var state = store.getState();
  t.looseEqual(state, {});
});

test('with `initialState`', function(t) {
  t.plan(2);
  var initialState = {
    foo: 42
  };
  var store = Fleur.store(initialState);
  var state = store.getState();
  t.looseEqual(state, {
    foo: 42
  });
  t.notEqual(state, initialState);
});
