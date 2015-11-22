var mainLoop = require('main-loop');

module.exports = function(store, render, element) {
  // var render = function() {

  // };
  var loop = mainLoop(store.getState(), render, {
    create: require('virtual-dom/vdom/create-element'),
    diff: require('virtual-dom/vtree/diff'),
    patch: require('virtual-dom/vdom/patch')
  });
  element.appendChild(loop.target);
  var removeListener = store.addListener(function(state) {
    loop.update(state);
  });
  return function() {
    removeListener();
    element.removeChild(loop.target);
  };
};
