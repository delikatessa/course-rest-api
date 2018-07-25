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

		const todos = db.collection('todos');

		//todos.update({text: 'Walk the dog'}, {completed: true});

		// todos
		// 	.find({
		// 		//_id is an ObjectID!
		// 		_id: new ObjectID('5b1f7bd2d46efa1963326af0'),
		// 	})
		// 	.toArray()
		// 	.then(
		// 		docs => {
		// 			console.log('Todos');
		// 			console.log(JSON.stringify(docs, undefined, 2));
		// 		},
		// 		err => {
		// 			console.log('Unable to fetch todos', err);
		// 		}
		// 	);

		// todos
		// 	.find()
		// 	.count()
		// 	.then(
		// 		count => {
		// 			console.log('Todos');
		// 			console.log(`Todos count: ${count}`);
		// 		},
		// 		err => {
		// 			console.log('Unable to fetch todos', err);
		// 		}
		// 	);

		const collection = db.collection('todos');

		collection
			.find()
			.toArray()
			.then(
				docs => {
					console.log(collection.collectionName);
					console.log(JSON.stringify(docs, undefined, 2));
				},
				err => {
					console.log('Unable to fetch todos', err);
				}
			);

		client.close();
	}
);
