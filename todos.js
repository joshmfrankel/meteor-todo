/**
 * Collections
 */
Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

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
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function() {
    var currentList = this.params._id;
    return Lists.findOne({ _id: currentList });
  }
});

if(Meteor.isClient){
  // client code goes here

  /**
   * Helpers
   */
  Template.todos.helpers({ // todos refers to the template
    'todo': function() {
      var currentList = this._id;
      // only return todos if they are found with specific list id
      return Todos.find({ listId: currentList }, {sort: {createdAt: -1}});
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
      var currentList = this._id;
      return Todos.find({ listId: currentList }).count();
    },
    'completedTodos': function() {
      var currentList = this._id;
      return Todos.find({ listId: currentList, completed: true }).count();
    }
  });

  Template.lists.helpers({
    'list': function() {
      return Lists.find({}, {sort: {name: 1}});
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
      var currentList = this._id;
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        listId: currentList
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
      Todos.update({ _id: documentId }, {$set: { completed: !isCompleted }});
    }
  });

  Template.addList.events({
    'submit form': function(event) {
      event.preventDefault();
      var listName = $('[name=listName]').val();
      Lists.insert({
        name: listName
      }, function (error, results) {
        // Immediately runs once new list inserted
        Router.go('listPage', { _id: results });
      });
      $('[name=listName]').val('');
    }
  });
}

if(Meteor.isServer){
    // server code goes here
}
