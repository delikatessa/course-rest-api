const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})
//     .then(result => console.log(result));

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

// Todo.findByIdAndRemove('5b505b69296e4e7179c89407')
//     .then(todo => console.log(todo));

Todo.findOneAndRemove({text: 'Test'})
    .then(todo => console.log(todo));