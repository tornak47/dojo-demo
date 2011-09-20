dojo.provide('app.base');
dojo.require('dojo.html');
dojo.require('dojox.dtl');
dojo.require('app.views.PersonDetail');
dojo.require('dbp.ViewModel');
dojo.require('dbp.Router');
dojo.require('dbp.ViewModel');
dojo.require('dbp.behaviour');
dojo.require('app.controllers.People');
dojo.require('app.services.Favorites');

/**
 * Any functionality that depends on the DOM being available
 * should be passed inside a function to dojo.ready. If you're
 * making a single-page app, this is your application controller.
 */
dojo.ready(function() {
    dojo.declare("dbp.InvokeAction",[dbp.chain.ChainLink],{});
  // Set up routre
  var router = new dbp.Router([
    {
      path : "/:controller/:action",
      defaults: {controller:"People",module:"",action:"index" },
      name : 'myRoute',
      defaultRoute : true
    }
  ]);
  // When ViewModel, get View
  // When View, place on page
  dbp.behaviour.whenModelIs(dbp.ViewModel)
    .then(function(c,m) {
        
        // Find View
        var viewName = m.declaredClass;
        viewName = viewName.substring(viewName.lastIndexOf(".")+1);
        viewName = viewName.replace('ViewModel','');
        console.log(viewName);
        var view = app.views[viewName];
            var v = view.fromViewModel(m);
            window.view = v;
            return v;
  });
  
    dbp.behaviour.whenModelIs(app.views.PersonDetail).then(function(c,m) {
        m.person.getTweets().then(dojo.hitch(m, 'set', 'tweets'));
        //m.person.getWeather().then(dojo.hitch(m, 'set', 'weatherData'));
        
    });
  dbp.behaviour.whenModelIs(dijit._Widget)
    .then(function(c,m) {
        
        m.placeAt(m.placeHolder);
  });
  /*dbp.behaviour.whenModelIs(app.viewmodels.PersonDetailViewModel).then(function(c,m) {
            return new app.views.Person({
                person: m.person
            });
  });
*/
  dbp.behaviour.whenModelIs(dbp.InvokeAction).then(function(c,m) {
        return m.controller[m.action].call(m.controller,m.params);
  });
  dbp.behaviour.whenModelIs(dbp.Router.RouteAction).then(function(c,m) {
      var controllerName = m.route.params.controller;
        var actionName = m.route.params.action;
        var controller = app.controllers[controllerName];
        return new dbp.InvokeAction({
            controller:controller,
            action:actionName, 
            params: m.args 
        });
  });
  
  router.init();
  //.then(dojo.hitch(router, 'init'));
});
    