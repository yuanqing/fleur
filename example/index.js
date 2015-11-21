var Fleur = require('..');

var Foo = Fleur.actions('foo', {
  request: function(state, dispatch) {
    dispatch(Foo.requestPending());
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        dispatch(Foo.requestSuccess([
          { title: 'foo', id: 1 },
          { title: 'bar', id: 2 },
          { title: 'baz', id: 3 }
        ])).then(resolve);
      }, 200);
    });
  },
  requestPending: function(state) {
    return Fleur.assign(state, {
      pending: true
    });
  },
  requestSuccess: function(state, dispatch, items) {
    return Fleur.assign(state, {
      items: items,
      pending: false
    });
  }
});

var logger = function(state, dispatch) {
  return function(action) {
    console.log('ACTION:', action.key, action.actionName);
    var result = dispatch(action);
    console.log('STATE:', state);
    return result;
  };
};

var store = Fleur.store({
  middleware: [logger]
});
store.dispatch(Foo.request())
  .then(function() {
    console.log(store.getState());
  });
