var test = require('tape');
var Fleur = require('../..');

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
