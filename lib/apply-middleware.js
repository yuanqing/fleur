module.exports = function(store, middlewares) {
  var dispatch = store.dispatch;
  middlewares = middlewares ? [].concat(middlewares) : [];
  var i = middlewares.length;
  while (i-- > 0) {
    dispatch = middlewares[i](store.getState, dispatch);
  }
  return {
    getState: store.getState,
    addListener: store.addListener,
    dispatch: dispatch
  };
};
