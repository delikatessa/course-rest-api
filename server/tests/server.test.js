const request = require('supertest');
const expect = require('chai').expect;

const {app} = require('../server');
const {Todo} = require('../models/todo');

const testTodos = [
	{
		name: 'First test todo',
	},
	{
		name: 'Second test todo',
	},
];

beforeEach(done => {
	Todo.remove({})
		.then(() => Todo.insertMany(testTodos))
		.then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', done => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect(res => {
				expect(res.body.name).to.be.equal(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find({name: text})
					.then(todos => {
						expect(todos.length).to.be.equal(1);
						expect(todos[0].name).to.be.equal(text);
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find()
					.then(todos => {
						expect(todos.length).to.be.equal(testTodos.length);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).to.be.equal(testTodos.length);
			})
			.end(done);
	});
});
