var h = require('virtual-dom/virtual-hyperscript');

module.exports = function(store) {
  return function(render) {
    return render(h, store.getState, store.dispatch);
  };
};
