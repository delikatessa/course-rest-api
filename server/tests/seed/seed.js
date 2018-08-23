const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

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
				token: jwt.sign({_id: user1id, access: 'auth'}, JWT_SECRET).toString(),
			},
		],
	},
	{
		_id: user2id,
		email: 'user2@test.com',
		password: 'user2pass',
		tokens: [
			{
				access: 'auth',
				token: jwt.sign({_id: user2id, access: 'auth'}, JWT_SECRET).toString(),
			},
		],
	},
];

const todos = [
	{
		_id: new ObjectID(),
		text: 'First test todo',
		_creator: user1id,
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333,
		_creator: user2id,
	},
];

const populateTodos = done => {
	Todo.deleteMany({})
		.then(() => Todo.insertMany(todos))
		.then(() => done());
};

const populateUsers = done => {
	User.deleteMany({})
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
