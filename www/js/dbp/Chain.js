dojo.provide('dbp.Chain');
// A chain is simply a set of connected "links" that execute sequentially.
// Imagine a Workflow Chart - each node is a link, the entire workflow is a Chain.
// Some differences:
// Workflow is generally static, Chain is dynamic (built at runtime)
// Workflows can fork, but execution follows a single path, Chain follows all paths.
// Chainlinks themselves determine whether or not they should be included in the current chain
// Chainlinks can abort the execution of the chain.
// Very similar to events, but with one major difference:
// A link must explicitly call the next link.
// An example of a chain:
// Request received
// Route to action (chain)
// Bind input to action parameters (chain)
// Execute action (chain)
// Render result (chain)
// Lets imagine execute action suddenly returned an unauthorised Model.
// Suddenly the auth Chain is required, run immediately
// Auth fails - Redirect to login,
// This becomes:
// Request received
// Route to action (chain)
// Bind input to action parameters (chain)
// Execute action (chain)
// Auth action (chain)
// Display Login Page (chain)
// Render result (chain - no longer run, no view result)
// Chain links defined before the current link are injected immediately, others simply enabled
//
// Request Received
// RouteToAction(RequestModel)->ExecuteActionModel
// ExecuteAction(ExecuteActionModel)->NotAuthorizedModel
// AuthAction(NotAuthorizedModel)->ViewModel
// RenderView(ViewModel)
//
// A better implementation would be:
// RouteToAction(RequestModel)->ExecuteActionModel
// AuthAction(ExecuteActionModel)->ExecuteActionModel||NotAuthorizedModel
// ExecuteAction(ExecuteActionModel)->PersonViewModel
// RenderView(ViewModel)->PersonView.html
// Links are given a priority, allowing them to control order of execution
// Where priority of two matching links are equal, use order of registration
// Chains are not stateful, return values are ignored, and unless specified the model doesn't change
dbp.Chain.ChainService = {
    chainLinks: [],
    register: function(chainLink) {
        this.chainLinks.push(chainLink);
    },
    getLinks: function(context,modelType) { 
        var links = [];
      for (var i = 0; i < this.chainLinks.length; i++) {
          var currentLink = this.chainLinks[i];
          if (currentLink.match(context,modelType))
            links.push(currentLink);
      }
      return links;
    },
    newChain: function(context,model) {
        // Construct chain
        var links = this.getLinks(context,model.type);
        var chain = new dbp.chain.Chain(this,context,model,links);
        chain.start();
    }
};
dojo.declare("dbp.chain.Chain",null, { 
    constructor: function(chainService,context,model,links) {
      this.context = context;  
      this.chainService = chainService;
      this.links = links;
      this.model = model;
      this.linkIndex = 0;  
    },
    start: function() { this.next(); },
    stop: function() {
        // Dispose
        this.context = null;
        this.links = null;
        this.model = null;
        this.linkIndex = null;
    },
    next: function(newModel) { 
        if (newModel != undefined) {
               this.chainService.newChain(this.context, newModel);
               this.stop();
        } else {
            if (this.linkIndex >= this.links.length)
                {this.stop();}else{
            var currentLink = this.currentLink = this.links[this.linkIndex]; 
            this.linkIndex++;
             var s = this;
            this.currentLink.execute(this.context,this.model,function(m) { s.next(m); });
                }
        }
    }
});
dojo.declare("dbp.chain.ChainLink", null,{
    constructor: function() { 
        dojo.mixin(this, args);  
    },
    execute: function(context,model,next) {
        next();
    },
    priority: 0,
    match: function(context, modelType) {
        return true;
    }
});