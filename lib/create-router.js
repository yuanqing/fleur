var each = require('savoy').each;
var objectAssign = require('object-assign');
var createActions = require('./create-actions');
var RliteRouter = require('rlite-router');

module.exports = function(store, routes) {
  var rliteRouter = new RliteRouter();
  each(routes, function(route, url) {
    rliteRouter.add(url, route);
  });
  var RouteActions = createActions('route', {
    route: function(state, dispatch, url) {
      // var route = router.lookup(url);
      // route.cb();
      // console.log(route);
      // return objectAssign(state, {
      //   url: url
      // });
    }
  });
  return {
    route: function(url) {
      var route = rliteRouter.lookup(url);
      console.log(route);
      // route.cb();
      // var route = router.lookup(url);
      // console.log(route);
      // return objectAssign(state, {
      //   url: url
      // });
    }
  };
};
