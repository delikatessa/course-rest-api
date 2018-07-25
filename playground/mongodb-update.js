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

		db.collection('todos').findOneAndUpdate({
			_id: new ObjectID('5b50603c04f2a9581dac0ef8')
		}, {
			$set: {
				completed: true
			}
		}, {
			returnOriginal: false
		}).then(result => console.log(result));

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
