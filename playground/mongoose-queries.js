const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b45cf2576f74210891a38afx';

// if (!ObjectID.isValid(id)) {
// 	console.log('ID is not valid');
// }

// Todo.find({_id: id}).then(todos => console.log('Todos:', todos));

// Todo.findOne({_id: id}).then(todo => console.log('Todo:', todo));

// Todo.findById(id)
// 	.then(todo => {
// 		if (!todo) {
// 			return console.log('Todo by Id:', 'Id not found');
// 		}
// 		console.log('Todo by Id:', todo);
// 	})
// 	.catch(error => console.log(error));

const userId = '5b3c812f418a3f1b0fe7a893';

User.findById(userId)
	.then(user => {
		if (!user) {
			return console.log('User not found');
		}
		console.log(JSON.stringify(user, undefined, 2));
	})
	.catch(e => console.log(e));
