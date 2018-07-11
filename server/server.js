var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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
		.then(todos => {
			res.send({todos});
		})
		.catch(error => res.status(400).send(error));
});

app.listen(3333, () => {
	console.log('Started on port 3333');
});

module.exports = {app};
