var Fleur = require('..');

var Foo = Fleur.createActions('shop', {
  bar: function(val) {
    return {
      x: val
    };
  },
  baz: function(val) {
    return function(resolve) {
      setTimeout(function() {
        resolve({
          x: val
        });
      }, 0);
    };
  }
});

var Qux = Fleur.createActions('products', {
  quux: function(val) {
    return {
      x: val
    };
  }
});

var store = Fleur.createStore();
store.dispatch(Foo.bar('bar'))
  .then(function() {
    store.dispatch(Qux.quux('quux'));
  })
  .then(function() {
    store.dispatch(Foo.baz('baz'));
  })
  .then(function() {
    console.log(store.getState());
  });
