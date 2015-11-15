var Fleur = require('..');

var Foo = Fleur.actions('shop', {
  request: function() {
    return {
      status: 'pending'
    };
  },
  get: function(state) {
    return function(dispatch) {
      dispatch(Foo.request());
      return Fleur.promise(function(resolve) {
        setTimeout(function() {
          resolve(Fleur.assign(state, {
            items: [{ title: 'foo' }, { title: 'bar' }],
            status: 'success'
          }));
        }, 100);
      });
    };
  },
  promise: function(state) {
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        resolve(Fleur.assign(state, {
          items: null
        }));
      }, 100);
    });
  }
});

var store = Fleur.store();
store.dispatch(Foo.get())
  .then(function() {
    console.log(store.getState());
  })
  .then(function() {
    return store.dispatch(Foo.promise());
  })
  .then(function() {
    console.log(store.getState());
  });
