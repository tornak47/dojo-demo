dojo.provide('app.controllers.MinionApp');
dojo.require('dojo.Stateful');


(function() {

app.controllers.MinionApp = new dojo.Stateful({
  init: function() {
      // Set up application
      
      // return a view
      return dojo.when(dashboardData.load(), function() {
      // create the view using the data and place it in
      // the element with id="people"
      this.peopleWidget = new app.views.People({
        // ask the people model for the list of people
        people: peopleData.getPeople()
      }, 'people');
    });
  }
});

}());
