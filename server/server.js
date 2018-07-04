var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
	'mongodb://localhost:27017/TodoApp',
	{useNewUrlParser: true}
);

var Todo = mongoose.model('Todo', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	completedAt: {
		type: Number,
		default: null,
	},
});

var newTodo = new Todo({
	name: 'Eat lunch',
	completed: true,
	completedAt: 666,
});
//saveDocument(newTodo);

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
	},
});

var newUser = new User({
	email: 't@t.com',
});
//saveDocument(newUser);

function saveDocument(doc) {
	doc.save().then(
		doc => {
			console.log(JSON.stringify(doc, undefined, 2));
		},
		error => {
			console.log('Unable to save', error);
		}
	);
}
