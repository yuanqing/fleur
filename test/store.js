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
  var store = Fleur.store({
    initialState: initialState
  });
  var state = store.getState();
  t.looseEqual(state, {
    foo: 42
  });
  t.notEqual(state, initialState);
});

test('dispatch a synchronous `action`, without `listener`', function(t) {
  t.plan(4);
  var store = Fleur.store();
  var action = function(state) {
    t.equal(arguments.length, 2);
    t.looseEqual(state, {});
    return {
      bar: 'changed'
    };
  };
  action.key = 'foo';
  t.looseEqual(store.getState(), {});
  store.dispatch(action);
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'changed'
    }
  });
});

test('dispatch a synchronous `action`, with `state[key]` being initially `undefined`', function(t) {
  t.plan(7);
  var store = Fleur.store({
    listener: function(state) {
      t.equal(arguments.length, 1);
      t.equal(state, store.getState());
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
    t.equal(arguments.length, 2);
    t.looseEqual(state, {});
    return {
      bar: 'changed'
    };
  };
  action.key = 'foo';
  t.looseEqual(store.getState(), {});
  store.dispatch(action);
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'changed'
    }
  });
});

test('dispatch a synchronous `action`, with `state[key]` having an initial value', function(t) {
  t.plan(7);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      t.equal(arguments.length, 1);
      t.equal(state, store.getState());
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
    t.equal(arguments.length, 2);
    t.looseEqual(state, {
      bar: 'initial'
    });
    return {
      bar: 'changed'
    };
  };
  action.key = 'foo';
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'initial'
    }
  });
  store.dispatch(action);
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'changed'
    }
  });
});

test('dispatch an asynchronous `action`', function(t) {
  t.plan(7);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      t.equal(arguments.length, 1);
      t.equal(state, store.getState());
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
    t.equal(arguments.length, 2);
    t.looseEqual(state, {
      bar: 'initial'
    });
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        resolve({
          bar: 'changed'
        });
      }, 0);
    });
  };
  action.key = 'foo';
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'initial'
    }
  });
  store.dispatch(action).then(function() {
    t.looseEqual(store.getState(), {
      foo: {
        bar: 'changed'
      }
    });
  });
});
