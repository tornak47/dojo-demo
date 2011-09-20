dojo.provide('app.controllers.People');


dojo.require('app.views.People');
dojo.require('app.models.People');
dojo.require('dojo.Stateful');

(function() {


app.controllers.People = new dojo.Stateful({
    peopleData: new app.models.People(),
    
  index: function() {
    var self = this;
    // load the initial data for the page

     return dojo.when(self.peopleData.load(),function() {
      // create the view using the data and place it in
       return new app.viewmodels.PeopleListViewModel(self.peopleData.getPeople());
    });
  },
  detail: function(args) { 
    
    var self = this;
    return dojo.when(self.peopleData.load(), function() {
        return new 
        app.viewmodels.PersonDetailViewModel(self.peopleData.getPerson(args.id));
  });
  }
});

}());
