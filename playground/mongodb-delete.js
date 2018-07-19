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

		const collection = db.collection('Todos');

		// deleteMany
		// collection.deleteMany({text: 'Eat lunch'}).then(result => {
		// 	console.log(result);
		// });

		// deleteOne
		// collection.deleteOne({text: 'Eat lunch'}).then(result => {
		// 	console.log(result);
		// });

		// findOneAndDelete
		collection.findOneAndDelete({completed: false}).then(result => {
			console.log(result);
		});
		// OUTPUT
		// { lastErrorObject: { n: 1 },
		// 	value:
		// 	{ _id: 5b1f7bd2d46efa1963326af0,
		// 		completed: false,
		// 		text: 'Walk the dog' },
		// 	ok: 1 }

		//client.close();
	}
);
