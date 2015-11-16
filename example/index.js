var Fleur = require('..');

var Foo = Fleur.actions('foo', {
  synchronous: function(state) {
    return Fleur.assign(state, {
      status: 'pending'
    });
  },
  asynchronous: function(state, trigger) {
    trigger(Foo.synchronous());
    return Fleur.promise(function(resolve) {
      setTimeout(function() {
        resolve(Fleur.assign(state, {
          items: [
            { title: 'foo', id: 1 },
            { title: 'bar', id: 2 },
            { title: 'baz', id: 3 }
          ],
          status: 'success'
        }));
      }, 100);
    });
  }
});

var store = Fleur.store();
store.trigger(Foo.asynchronous())
  .then(function() {
    console.log(store.getState());
  });
