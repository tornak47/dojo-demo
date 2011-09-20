dojo.require('dbp.chain');
dojo.provide('dbp.behaviour');
dbp.behaviour.HandleBehaviour = function(result) {
  // Create new chain
  dbp.chain.ChainService.newChain({},result);
};
dbp.behaviour.behaviourWhen = function(predicate) { 
    this.predicate = predicate;
    
    this.then = function(execFn) { 
        dbp.chain.ChainService.register(new dbp.chain.ChainLink({
      execute:execFn,
      match: this.predicate
  }));
    };
};
dbp.behaviour.when = function(predicate) { 
 return new dbp.behaviour.behaviourWhen(predicate);   
};
dbp.behaviour.whenModelIs = function(modelType) { 
 return new dbp.behaviour.behaviourWhen(function(c,m) { 
     return m != undefined && ((m.isInstanceOf != undefined && m.isInstanceOf(modelType)) || (m.isInstanceOf == undefined &&
     m instanceof modelType));
     });   
}
dojo.declare("dbp.behaviour.Behaviour", [dbp.chain.ChainLink],{
    
});