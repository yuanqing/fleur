var test = require('tape');
var Fleur = require('../..');
var cloneDeep = require('lodash.clonedeep');

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

test('dispatch an asynchronous `action` that itself dispatches a synchronous action', function(t) {
  t.plan(7);
  var initialState = {
    foo: {
      bar: 'initial'
    }
  };
  var listenerStates = [];
  var middlewareStates = [];
  var store = Fleur.store({
    initialState: initialState,
    listener: function(state) {
      listenerStates.push(cloneDeep(state));
    },
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
    ]
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
  pendingAction.actionName = 'pendingAction';
  var successAction = function(state) {
    t.looseEqual(state, {
      bar: 'pending'
    });
    return {
      bar: 'success'
    };
  };
  successAction.key = 'foo';
  successAction.actionName = 'successAction';
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
  asynchronousAction.actionName = 'asynchronousAction';
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
    t.looseEqual(listenerStates, [
      { foo: { bar: 'pending' } },
      { foo: { bar: 'success' } }
    ]);
    t.looseEqual(middlewareStates, [
      {
        actionName: 'asynchronousAction',
        state: { foo: { bar: 'initial' } },
      },
      {
        actionName: 'pendingAction',
        state: { foo: { bar: 'initial' } },
      },
      {
        actionName: 'successAction',
        state: { foo: { bar: 'pending' } }
      }
    ]);
  });
});
