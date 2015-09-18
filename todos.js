/**
 * Collections
 */
Todos = new Meteor.Collection('todos');

/**
 * Routes
 */
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/register');
Router.route('/login');
Router.route('/', {
  name: 'home',
  template: 'home'
});

if(Meteor.isClient){
  // client code goes here

  /**
   * Helpers
   */
  Template.todos.helpers({ // todos refers to the template
    'todo': function() {
      return Todos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.todoItem.helpers({
    'checked': function() {
      var isCompleted = this.completed;
      return (isCompleted ? 'checked' : '');
    }
  });

  Template.todosCount.helpers({
    'totalTodos': function() {
      return Todos.find().count();
    },
    'completedTodos': function() {
      return Todos.find({ completed: true }).count();
    }
  });


  /**
   * Events
   */
  // addTodo is the template name
  Template.addTodo.events({
    'submit form': function(event) {
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date()
      });
      $('[name="todoName"]').val('');
    }
  });

  // todoItem is the template name attr
  Template.todoItem.events({
    'click .delete-todo': function(event) {
      event.preventDefault();
      var documentId = this._id;
      var confirm = window.confirm("Delete this task?");
      if (confirm) {
        Todos.remove({ _id: documentId });
      }
    },
    'keyup [name=todoItem]': function(event) {
      var target = $(event.target);
      if (event.which == 13 || event.which == 27) {
        target.blur();
      } else {
        var documentId = this._id;
        var todoItem = target.val();
        Todos.update({ _id: documentId }, {$set: { name: todoItem }});
      }
    },
    'change [type=checkbox]': function() {
      var documentId = this._id;
      var isCompleted = this.completed;
      console.log(isCompleted);
      Todos.update({ _id: documentId }, {$set: { completed: !isCompleted }});
    }
  });
}

if(Meteor.isServer){
    // server code goes here
}
