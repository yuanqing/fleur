var test = require('tape');
var Fleur = require('../..');
var cloneDeep = require('lodash.clonedeep');

test('dispatch an asynchronous action, invoking `resolve` with the new `state`', function(t) {
  t.plan(4);
  var store = Fleur.store({
    initialState: {
      x: {
        y: 'initial'
      }
    },
    listener: function(state) {
      t.looseEqual(state, {
        x: {
          y: 'changed'
        }
      });
    }
  });
  var Actions = Fleur.actions('x', {
    x: function(state) {
      t.looseEqual(state, {
        y: 'initial'
      });
      return Fleur.promise(function(resolve) {
        setTimeout(function() {
          resolve({
            y: 'changed'
          });
        }, 0);
      });
    }
  });
  t.looseEqual(store.getState(), {
    x: {
      y: 'initial'
    }
  });
  store.dispatch(Actions.x()).then(function() {
    t.looseEqual(store.getState(), {
      x: {
        y: 'changed'
      }
    });
  });
});

test('dispatch an asynchronous action that itself dispatches synchronous actions, with `middleware` and `listener`', function(t) {
  t.plan(7);
  var initialState = {
    x: {
      y: 'initial'
    }
  };
  var middlewareStates = [];
  var listenerStates = [];
  var store = Fleur.store({
    initialState: initialState,
    middleware: [
      function(state, dispatch) {
        return function(action) {
          middlewareStates.push({
            state: cloneDeep(state),
            actionName: action.actionName
          });
          return dispatch(action);
        };
      }
    ],
    listener: function(state) {
      listenerStates.push(cloneDeep(state));
    }
  });
  var Actions = Fleur.actions('x', {
    request: function(state, dispatch) {
      t.looseEqual(state, {
        y: 'initial'
      });
      dispatch(Actions.pending());
      return Fleur.promise(function(resolve) {
        setTimeout(function() {
          dispatch(Actions.success()).then(resolve);
        }, 0);
      });
    },
    pending: function(state) {
      t.looseEqual(state, {
        y: 'initial'
      });
      return {
        y: 'pending'
      };
    },
    success: function(state) {
      t.looseEqual(state, {
        y: 'pending'
      });
      return {
        y: 'success'
      };
    }
  });
  t.looseEqual(store.getState(), {
    x: {
      y: 'initial'
    }
  });
  store.dispatch(Actions.request()).then(function() {
    t.looseEqual(store.getState(), {
      x: {
        y: 'success'
      }
    });
    t.looseEqual(middlewareStates, [
      {
        actionName: 'request',
        state: { x: { y: 'initial' } },
      },
      {
        actionName: 'pending',
        state: { x: { y: 'initial' } },
      },
      {
        actionName: 'success',
        state: { x: { y: 'pending' } }
      }
    ]);
    t.looseEqual(listenerStates, [
      { x: { y: 'pending' } },
      { x: { y: 'success' } }
    ]);
  });
});
