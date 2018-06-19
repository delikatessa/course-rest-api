require('dotenv').load();

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(
	'mongodb://localhost:27017/TodoApp',
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to MongoDB server');
		}
		console.log('Connected to MongoDB server');
		const db = client.db('TodoApp');

		const todos = db.collection('Todos');

		// deleteMany
		// todos.deleteMany({text: 'Eat lunch'}).then(result => {
		// 	console.log(result.result);
		// });

		// deleteOne
		// todos.deleteOne({text: 'Eat lunch'}).then(result => {
		// 	console.log(result.result);
		// });

		// findOneAndDelete
		// todos.findOneAndDelete({text: 'Eat lunch'}).then(result => {
		// 	console.log(result);
		// });

		// CHALLENGE
		db.collection('Users')
			.deleteMany({name: 'Andrew'})
			.then(result => console.log(result.result));

		db.collection('Users')
			.findOneAndDelete({_id: new ObjectID('5b28ac8ce0090a02d044608d')})
			.then(result => console.log(result));
		//client.close();
	}
);
