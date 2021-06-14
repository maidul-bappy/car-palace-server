const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const { ObjectID } = require('mongodb')
require('dotenv').config()
const port = 5000;
const app = express()
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gcd5g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

	const carCollection = client.db("carPalace").collection("cars");
	const orderCollection = client.db("carPalace").collection("orders");
	//Create
	app.post('/addCar', (req, res) => {
		const car = req.body;
		carCollection.insertOne(car)
			.then(result => {
				res.redirect('/')
			})
	})
	//Read
	app.get('/cars', (req, res) => {
		carCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Read
	app.get('/cars/:id', (req, res) => {
		carCollection.find({ _id: ObjectID(req.params.id) })
			.toArray((err, documents) => {
				res.send(documents[0]);
			})
	})
	//Delete
	app.delete('/delete/:id', (req, res) => {
		carCollection.deleteOne({ _id: ObjectID(req.params.id) })
			.then(result => {
				res.send(!! result.value)
			})
	})
	//addOrder
	app.post('/addOrder', (req, res) => {
		const order = req.body;
		orderCollection.insertOne(order)
			.then(result => {
				res.send(result.insertedCount > 0);
			})
	})
	//Read Order
	app.get('/orders', (req, res) => {
		orderCollection.find({})
			.toArray((err, orders) => {
				res.send(orders);
			})
	})

});

app.listen(process.env.PORT || port)



