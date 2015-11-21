var test = require('tape');
var cloneDeep = require('lodash.clonedeep');

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

test('dispatch a synchronous `action`, without a `listener`', function(t) {
  t.plan(5);
  var store = Fleur.store();
  var action = function(state, dispatch) {
    t.equal(arguments.length, 2);
    t.equal(dispatch, store.dispatch);
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

test('dispatch a synchronous `action`, with middleware', function(t) {
  t.plan(4);
  var store = Fleur.store({
    middleware: [
      function(state, dispatch) {
        return function(action) {
          t.looseEqual(state, {});
          return dispatch(action);
        };
      }
    ]
  });
  var action = function(state) {
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
  t.plan(6);
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
  t.plan(4);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
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

test('dispatch an asynchronous `action`, invoking `resolve` with the new `state`', function(t) {
  t.plan(4);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
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

test('dispatch an asynchronous `action` that itself dispatches a synchronous action', function(t) {
  t.plan(6);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var states = [];
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      states.push(cloneDeep(state));
    }
  });
  var pendingAction = function(state) {
    t.looseEqual(state, {
      bar: 'initial'
    });
    return {
      bar: 'pending'
    };
  };
  pendingAction.key = 'foo';
  var successAction = function(state) {
    t.looseEqual(state, {
      bar: 'pending'
    });
    return {
      bar: 'success'
    };
  };
  successAction.key = 'foo';
  var asynchronousAction = function(state, dispatch) {
    t.looseEqual(state, {
      bar: 'initial'
    });
    dispatch(pendingAction);
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        dispatch(successAction).then(resolve);
      }, 0);
    });
  };
  asynchronousAction.key = 'foo';
  t.looseEqual(store.getState(), {
    foo: {
      bar: 'initial'
    }
  });
  store.dispatch(asynchronousAction).then(function() {
    t.looseEqual(store.getState(), {
      foo: {
        bar: 'success'
      }
    });
    t.looseEqual(states, [
      { foo: { bar: 'pending' } },
      { foo: { bar: 'success' } }
    ]);
  });
});

test('dispatch an asynchronous `action`, invoking `resolve` with the new `state`', function(t) {
  t.plan(4);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      t.looseEqual(state, {
        foo: {
          bar: 'changed'
        }
      });
    }
  });
  var action = function(state) {
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
