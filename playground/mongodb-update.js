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

		// findOneAndUpdate
		collection
			.findOneAndUpdate({completed: false}, {completed: true})
			.then(result => console.log(result));

		// print collection
		// collection
		// 	.find()
		// 	.toArray()
		// 	.then(
		// 		docs => {
		// 			console.log(collection.collectionName);
		// 			console.log(JSON.stringify(docs, undefined, 2));
		// 		},
		// 		err => {
		// 			console.log('Unable to fetch todos', err);
		// 		}
		// 	);

		//client.close();
	}
);
