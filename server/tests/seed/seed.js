const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const SECRET = 'abc123';

const user1id = new ObjectID();
const user2id = new ObjectID();
const users = [
	{
		_id: user1id,
		email: 'user1@test.com',
		password: 'user1pass',
		tokens: [
			{
				access: 'auth',
				token: jwt.sign({_id: user1id, access: 'auth'}, SECRET).toString(),
			},
		],
	},
	{
		_id: user2id,
		email: 'user2@test.com',
		password: 'user2pass',
	},
];

const todos = [
	{
		_id: new ObjectID(),
		text: 'First test todo',
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333,
	},
];

const populateTodos = done => {
	Todo.remove({})
		.then(() => Todo.insertMany(todos))
		.then(() => done());
};

const populateUsers = done => {
	User.remove({})
		.then(() => {
			const user1 = new User(users[0]).save();
			const user2 = new User(users[1]).save();
			return Promise.all([user1, user2]);
		})
		.then(() => done());
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers,
};
