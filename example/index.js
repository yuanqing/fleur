var store = require('../lib/make-store')({
  foo: {
    bar: 'initial'
  }
});

var Foo = require('../lib/make-actions')('foo', {
  synchronousAction: function() {
    return {
      bar: 'baz'
    };
  },
  asyncAction: function(state, promise) {
    return promise(function(resolve) {
      resolve({
        bar: 'qux'
      });
    });
  }
});

console.log('initial:', store.getState());
store.dispatch(Foo.synchronousAction).then(function() {
  console.log('after synchronousAction:', store.getState());
  store.dispatch(Foo.asyncAction).then(function() {
    console.log('after synchronousAction:', store.getState());
  });
});
