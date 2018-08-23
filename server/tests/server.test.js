const request = require('supertest');
const expect = require('chai').expect;
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

describe('test server', () => {
	beforeEach(populateUsers);
	beforeEach(populateTodos);

	describe('Todos', () => {
		describe('POST /todos', () => {
			it('should create a new todo', done => {
				var text = 'Test todo text';

				request(app)
					.post('/todos')
					.set('x-auth', users[0].tokens[0].token)
					.send({text})
					.expect(201)
					.expect(res => {
						expect(res.body.text).to.be.equal(text);
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						Todo.find({text: text, _creator: users[0]._id})
							.then(todos => {
								expect(todos).to.have.length(1);
								expect(todos[0].text).to.be.equal(text);
								done();
							})
							.catch(e => done(e));
					});
			});

			it('should not create todo with invalid body data', done => {
				request(app)
					.post('/todos')
					.set('x-auth', users[0].tokens[0].token)
					.send({})
					.expect(400)
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						Todo.find({_creator: users[0]._id})
							.then(todos => {
								expect(todos).to.have.length(1);
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
					.set('x-auth', users[0].tokens[0].token)
					.expect(200)
					.expect(res => {
						expect(res.body.todos).to.have.length(1);
					})
					.end(done);
			});
		});

		describe('GET /todos/:id', () => {
			it('should return todo doc', done => {
				request(app)
					.get(`/todos/${todos[0]._id.toHexString()}`)
					.set('x-auth', users[0].tokens[0].token)
					.expect(200)
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(todos[0].text);
					})
					.end(done);
			});

			it('should not return todo doc created by other user', done => {
				request(app)
					.get(`/todos/${todos[1]._id.toHexString()}`)
					.set('x-auth', users[0].tokens[0].token)
					.expect(404)
					.end(done);
			});

			it('should return 404 if todo is not found', done => {
				const hexId = new ObjectID().toHexString();
				request(app)
					.get(`/todos/${hexId}`)
					.set('x-auth', users[0].tokens[0].token)
					.expect(404)
					.end(done);
			});

			it('should return 404 for non-object ids', done => {
				request(app)
					.get(`/todos/123`)
					.set('x-auth', users[0].tokens[0].token)
					.expect(404)
					.end(done);
			});
		});

		describe('DELETE /todos/:id', () => {
			it('should remove a odo', done => {
				request(app)
					.delete(`/todos/${todos[1]._id.toHexString()}`)
					.set('x-auth', users[1].tokens[0].token)
					.expect(200)
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(todos[1].text);
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						Todo.findById(todos[1]._id)
							.then(todo => {
								expect(todo).to.not.exist;
								done();
							})
							.catch(e => done(e));
					});
			});

			it('should not remove a todo of another user', done => {
				request(app)
					.delete(`/todos/${todos[1]._id.toHexString()}`)
					.set('x-auth', users[0].tokens[0].token)
					.expect(404)
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						Todo.findById(todos[1]._id)
							.then(todo => {
								expect(todo).to.exist;
								done();
							})
							.catch(e => done(e));
					});
			});

			it('should return 404 if todo is not found', done => {
				const hexId = new ObjectID().toHexString();
				request(app)
					.delete(`/todos/${hexId}`)
					.set('x-auth', users[1].tokens[0].token)
					.expect(404)
					.end(done);
			});

			it('should return 404 for non-object ids', done => {
				request(app)
					.delete(`/todos/123`)
					.set('x-auth', users[1].tokens[0].token)
					.expect(404)
					.end(done);
			});
		});

		describe('PATCH /todos/:id', () => {
			it('should update a todo', done => {
				const updates = {
					text: 'patched1',
					completed: true,
				};
				request(app)
					.patch(`/todos/${todos[0]._id.toHexString()}`)
					.set('x-auth', users[0].tokens[0].token)
					.send(updates)
					.expect(200)
					.expect(res => {
						expect(res.body.todo.text).to.be.equal(updates.text);
						expect(res.body.todo.completed).to.be.equal(updates.completed);
						expect(res.body.todo.completedAt).to.be.a('number');
					})
					.end(done);
			});

			it('should not update a todo of another user', done => {
				const updates = {
					text: 'patched1',
					completed: true,
				};
				request(app)
					.patch(`/todos/${todos[0]._id.toHexString()}`)
					.set('x-auth', users[1].tokens[0].token)
					.send(updates)
					.expect(404)
					.end(done);
			});

			it('should clear completedAt when todo is not completed', done => {
				const updates = {
					text: 'patched2',
					completed: false,
				};
				request(app)
					.patch(`/todos/${todos[1]._id.toHexString()}`)
					.set('x-auth', users[1].tokens[0].token)
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
		describe('GET /users/me', () => {
			it('should return user if authenticated', done => {
				request(app)
					.get('/users/me')
					.set('x-auth', users[0].tokens[0].token)
					.expect(200)
					.expect(res => {
						expect(res.body._id).to.be.equal(users[0]._id.toHexString());
						expect(res.body.email).to.be.equal(users[0].email);
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
				request(app)
					.post('/users/login')
					.send({
						email: users[1].email,
						password: users[1].password,
					})
					.expect(200)
					.expect(res => {
						expect(res.headers['x-auth']).to.exist;
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findById(users[1]._id)
							.then(user => {
								expect(user.tokens[1]).to.include({
									access: 'auth',
									token: res.headers['x-auth'],
								});
								done();
							})
							.catch(err => done(err));
					});
			});

			it('should reject invalid token', done => {
				request(app)
					.post('/users/login')
					.send({
						email: users[1].email,
						password: users[1].password + '1',
					})
					.expect(400)
					.expect(res => {
						expect(res.headers['x-auth']).to.not.exist;
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findById(users[1]._id)
							.then(user => {
								expect(user.tokens).to.have.length(1);
								done();
							})
							.catch(err => done(err));
					});
			});
		});

		describe('DELETE /users/me/token', () => {
			it('should remove auth token on logout', done => {
				request(app)
					.delete('/users/me/token')
					.set('x-auth', users[0].tokens[0].token)
					.expect(200)
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						User.findById(users[0]._id)
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
