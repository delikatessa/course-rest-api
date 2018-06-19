require('dotenv').load();

/* Object destructuring */
// var user = {name: 'Andrew', age: 25};
// var {name} = user;
// console.log(name);

//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

/* ObjectID generate a new document _id */
// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect(
	'mongodb://localhost:27017/TodoApp',
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to MongoDB server');
		}
		console.log('Connected to MongoDB server');
		const db = client.db('TodoApp');

		/* Create a Collection and insert a Document */
		db.collection('Todos').insertOne(
			{
				text: 'Walk the dog',
				completed: false,
			},
			(err, result) => {
				if (err) {
					return console.log('Unable to insert todo', err);
				}
				console.log(JSON.stringify(result.ops, undefined, 2));
			}
		);

		// db.collection('Users').insertOne(
		// 	{
		// 		name: 'Andrew',
		// 		age: 25,
		// 		location: 'SFO',
		// 	},
		// 	(err, result) => {
		// 		if (err) {
		// 			return console.log('Unable to insert user', err);
		// 		}
		// 		console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
		// 	}
		// );

		client.close();
	}
);
