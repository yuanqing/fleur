var Fleur = require('..');

var Foo = Fleur.createActions('shop', {
  bar: function(val) {
    return {
      x: val
    };
  },
  baz: function(val) {
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        resolve({
          x: val
        });
      }, 0);
    });
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

var dispatch = store.dispatch;
dispatch(Foo.bar('bar'))
  .then(function() {
   return dispatch(Foo.baz('baz'));
  })
  .then(function() {
   console.log(store.getState());
  });
