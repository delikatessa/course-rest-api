const request = require('supertest');
const expect = require('chai').expect;
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const testTodos = [
	{
		_id: new ObjectID(),
		text: 'First test todo',
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
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
				expect(res.body.text).to.be.equal(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find({text: text})
					.then(todos => {
						expect(todos.length).to.be.equal(1);
						expect(todos[0].text).to.be.equal(text);
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

describe('GET /todos/:id', () => {
	it('should return todo doc', done => {
		const todo = testTodos[0];
		request(app)
			.get(`/todos/${todo._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).to.be.equal(todo.text);
			})
			.end(done);
	});

	it('should return 404 if todo is not found', done => {
		const hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', done => {
		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove todo doc', done => {
		const todo = testTodos[1];
		request(app)
			.delete(`/todos/${todo._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).to.be.equal(todo.text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(todo._id).then(todo => {
					expect(todo).to.not.exist;
					done();
				}).catch(e => done(e));
			});
	});

	it('should return 404 if todo is not found', done => {
		const hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', done => {
		request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
	});
});
