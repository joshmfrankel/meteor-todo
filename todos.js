/**
 * Collections
 */
Todos = new Meteor.Collection('todos');

if(Meteor.isClient){
  // client code goes here

  /**
   * Helpers
   */
  Template.todos.helpers({ // todos refers to the template
    'todo': function() {
      return Todos.find();
    }
  });
}

if(Meteor.isServer){
    // server code goes here
}
