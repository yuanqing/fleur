var test = require('tape');
var Fleur = require('..');

test('arguments are `state` and `dispatch`, followed by the action arguments', function(t) {
  t.plan(5);
  var state = {};
  var dispatch = function() {};
  var Foo = Fleur.actions('foo', {
    bar: function(stateArgument, dispatchArgument, x, y, z) {
      t.equal(x, 1);
      t.equal(y, 2);
      t.equal(z, 3);
      t.equal(stateArgument, state);
      t.equal(dispatchArgument, dispatch);
    }
  });
  Foo.bar(1, 2, 3)(state, dispatch);
});

test('adds a `key` attribute to each function in the `specification`', function(t) {
  t.plan(2);
  var Foo = Fleur.actions('foo', {
    bar: function() {},
    baz: function() {}
  });
  t.equal(Foo.bar().key, 'foo');
  t.equal(Foo.baz().key, 'foo');
});
