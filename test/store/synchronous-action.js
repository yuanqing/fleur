var test = require('tape');
var Fleur = require('../..');

test('dispatch a synchronous action, with `state[key]` being initially `undefined`', function(t) {
  t.plan(6);
  var store = Fleur.store({});
  var Actions = Fleur.actions('x', {
    foo: function(state, dispatch) {
      t.equal(arguments.length, 2);
      t.equal(state, store.getState().x);
      t.looseEqual(state, {});
      t.equal(dispatch, store.dispatch);
      return {
        y: 'changed'
      };
    }
  });
  t.looseEqual(store.getState(), {});
  store.dispatch(Actions.foo());
  t.looseEqual(store.getState(), {
    x: {
      y: 'changed'
    }
  });
});

test('dispatch a synchronous action, with `state[key]` having an initial value', function(t) {
  t.plan(4);
  var store = Fleur.store({
    initialState: {
      x: {
        y: 'initial'
      }
    }
  });
  var Actions = Fleur.actions('x', {
    foo: function(state) {
      t.equal(state, store.getState().x);
      t.looseEqual(state, {
        y: 'initial'
      });
      return {
        y: 'changed'
      };
    }
  });
  t.looseEqual(store.getState(), {
    x: {
      y: 'initial'
    }
  });
  store.dispatch(Actions.foo());
  t.looseEqual(store.getState(), {
    x: {
      y: 'changed'
    }
  });
});

test('dispatch a synchronous action, with `middleware` and `listener`', function(t) {
  t.plan(10);
  var flag = 0;
  var store = Fleur.store({
    initialState: {
      x: {
        y: 'initial'
      }
    },
    middleware: [
      function(state, dispatch) {
        return function(action) {
          t.looseEqual(state, {
            x: {
              y: 'initial'
            }
          });
          t.equal(flag, 0);
          flag = 1;
          return dispatch(action);
        };
      },
      function(state, dispatch) {
        return function(action) {
          t.looseEqual(state, {
            x: {
              y: 'initial'
            }
          });
          t.equal(flag, 1);
          flag = 2;
          return dispatch(action);
        };
      },
      function(state, dispatch) {
        return function(action) {
          t.looseEqual(state, {
            x: {
              y: 'initial'
            }
          });
          t.equal(flag, 2);
          return dispatch(action);
        };
      }
    ],
    listener: function(state) {
      t.looseEqual(state, {
        x: {
          y: 'changed'
        }
      });
    }
  });
  var Actions = Fleur.actions('x', {
    foo: function(state) {
      t.looseEqual(state, {
        y: 'initial'
      });
      return {
        y: 'changed'
      };
    }
  });
  t.looseEqual(store.getState(), {
    x: {
      y: 'initial'
    }
  });
  store.dispatch(Actions.foo());
  t.looseEqual(store.getState(), {
    x: {
      y: 'changed'
    }
  });
});
