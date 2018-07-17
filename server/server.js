const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		name: req.body.text,
	});
	todo
		.save()
		.then(doc => res.send(doc))
		.catch(error => res.status(400).send(error));
});

app.get('/todos', (req, res) => {
	Todo.find()
		.then(todos => res.send({todos}))
		.catch(error => res.status(400).send(error));
});

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
	} else {
		Todo.findById(id)
			.then(todo => {
				if (!todo) {
					res.status(400).send();
				}
				res.status(200).send(todo);
			})
			.catch(error => res.status(400).send());
	}
});

app.listen(3333, () => {
	console.log('Started on port 3333');
});

module.exports = {app};
