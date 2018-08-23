const request = require('supertest');
const expect = require('chai').expect;
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos: testTodos, populateTodos, users: testUsers, populateUsers} = require('./seed/seed');

describe('test server', () => {
	describe('Todos', () => {
		beforeEach(populateTodos);

		describe('POST /todos', () => {
			it('should create a new todo', done => {
				var text = 'Test todo text';

				request(app)
					.post('/todos')
					.send({text})
					.expect(201)
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
					.expect(res => {
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
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(todo.text);
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						Todo.findById(todo._id)
							.then(todo => {
								expect(todo).to.not.exist;
								done();
							})
							.catch(e => done(e));
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

		describe('PATCH /todos/:id', () => {
			it('should update the todo', done => {
				const updates = {
					text: 'patched1',
					completed: true,
				};
				request(app)
					.patch(`/todos/${testTodos[0]._id.toHexString()}`)
					.send(updates)
					.expect(200)
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(updates.text);
						expect(res.body.todo.completed).to.be.equal(updates.completed);
						expect(res.body.todo.completedAt).to.be.a('number');
					})
					.end(done);
			});

			it('should clear completedAt when todo is not completed', done => {
				const updates = {
					text: 'patched2',
					completed: false,
				};
				request(app)
					.patch(`/todos/${testTodos[1]._id.toHexString()}`)
					.send(updates)
					.expect(200)
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(updates.text);
						expect(res.body.todo.completed).to.be.equal(updates.completed);
						expect(res.body.todo.completedAt).to.not.exist;
					})
					.end(done);
			});
		});
	});

	describe('Users', () => {
		beforeEach(populateUsers);

		describe('GET /users/me', () => {
			it('should return user if authenticated', done => {
				const user = testUsers[0];
				request(app)
					.get('/users/me')
					.set('x-auth', user.tokens[0].token)
					.expect(200)
					.expect(res => {
						expect(res.body._id).to.be.equal(user._id.toHexString());
						expect(res.body.email).to.be.equal(user.email);
					})
					.end(done);
			});

			it('should return 401 if not authenticated', done => {
				request(app)
					.get('/users/me')
					.expect(401)
					.expect(res => {
						expect(res.body).to.be.empty;
					})
					.end(done);
			});
		});

		describe('POST /users', () => {
			it('should create a user', done => {
				const email = 'test@test.com';
				const password = 'test123';

				request(app)
					.post('/users')
					.send({email, password})
					.expect(201)
					.expect(res => {
						expect(res.headers['x-auth']).to.exist;
						expect(res.body._id).to.exist;
						expect(res.body.email).to.be.equal(email);
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findOne({email})
							.then(user => {
								expect(user).to.exist;
								expect(user.password).to.not.equal(password);
								done();
							})
							.catch(err => done(err));
					});
			});

			it('should return validation errors if request invalid', done => {
				const email = 'test';
				const password = 'test';

				request(app)
					.post('/users')
					.send({email, password})
					.expect(400)
					.end(done);
			});

			it('should not create user if email in use', done => {
				const email = 'user1@test.com';
				const password = 'test123';

				request(app)
					.post('/users')
					.send({email, password})
					.expect(400)
					.end(done);
			});
		});

		describe('POST /users/login', () => {
			it('should login user and return auth token', done => {
				const user = testUsers[1];
				request(app)
					.post('/users/login')
					.send({
						email: user.email,
						password: user.password,
					})
					.expect(200)
					.expect(res => {
						expect(res.headers['x-auth']).to.exist;
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findById(user._id)
							.then(user => {
								expect(user.tokens[0]).to.include({
									access: 'auth',
									token: res.headers['x-auth'],
								});
								done();
							})
							.catch(err => done(err));
					});
			});

			it('should reject invalid token', done => {
				const user = testUsers[1];
				request(app)
					.post('/users/login')
					.send({
						email: user.email,
						password: user.password + '1',
					})
					.expect(400)
					.expect(res => {
						expect(res.headers['x-auth']).to.not.exist;
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findById(user._id)
							.then(user => {
								expect(user.tokens).to.be.empty;
								done();
							})
							.catch(err => done(err));
					});
			});
		});
	});
});
