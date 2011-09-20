dojo.provide('app.views.People');
dojo.require('dbp.ViewModel');
dojo.require("dojo.cache");
dojo.provide('app.viewmodels.People');
dojo.declare('app.viewmodels.PeopleListViewModel', [dbp.ViewModel], {
    constructor: function(peopleArray) { 
  this.people = peopleArray;  
}
});
dojo.declare('app.viewmodels.PersonDetailViewModel',[dbp.ViewModel], {  constructor: function(person) { 
  this.person = person;  
}});
dojo.declare('app.views.People', [ ], {
  templateString : dojo.cache('app.views', 'People/People.html'),
  personTemplate : dojo.cache('app.views', 'People/Person.html'),
  constructor: function(m) { this.model = m; },
  postCreate : function() {
    this.domNode.innerHTML = dojo.map(this.people, function(p) {
      return dojo.string.substitute(this.personTemplate, p.data);
    }, this).join('');
  }
});
