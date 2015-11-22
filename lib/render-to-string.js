var createElement = require('virtual-dom/vdom/create-element');

module.exports = function(store, component) {
  return createElement(component(store.getState())).toString();
};
