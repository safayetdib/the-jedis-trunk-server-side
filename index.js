const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dc2rluc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// collections
		const categoriesCollection = client
			.db('theJedisTrunk')
			.collection('categories');
		const toyCollection = client.db('theJedisTrunk').collection('toys');

		// get categories data
		app.get('/categories', async (req, res) => {
			const result = await categoriesCollection.find().toArray();
			res.send(result);
		});

		// get all toys data : limit 20
		app.get('/toys', async (req, res) => {
			const page = parseInt(req.query.page) || 0;
			const limit = parseInt(req.query.limit) || 20;
			const skip = page * limit;

			const result = await toyCollection
				.find()
				.skip(skip)
				.limit(limit)
				.toArray();
			res.send(result);
		});

		// get toys data by category
		app.get('/toys/category/:category', async (req, res) => {
			const category = req.params.category;
			const query = { category: category };
			const result = await toyCollection.find(query).toArray();
			res.send(result);
		});

		// get toys data by seller email
		app.get('/my-toys', async (req, res) => {
			const seller_email = req.query.email;
			const query = { seller_email };
			const result = await toyCollection.find(query).toArray();
			res.send(result);
		});

		// get a toy data by id
		app.get('/toy/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await toyCollection.findOne(query);
			res.send(result);
		});

		// add a new toy data
		app.post('/toy/add', async (req, res) => {
			const newToy = req.body;
			const result = await toyCollection.insertOne(newToy);
			if (result.insertedId !== undefined) {
				res.send({
					success: true,
					message: 'A new toy is added successfully!',
				});
			} else {
				res.send({
					success: false,
					message: 'Something went wrong. Please try again later.',
				});
			}
		});

		// delete a toy data
		app.delete('/toy/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await toyCollection.deleteOne(query);
			if (result.deletedCount === 1) {
				res.send({
					success: true,
					message: 'Successfully deleted!',
				});
			} else {
				res.send({
					success: false,
					message: 'No toys matched the query. Deleted 0 toys.',
				});
			}
		});

		await client.db('admin').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('A long time ago, in a galaxy far, far away...');
});

app.listen(port, () => {
	console.log('The Force is strong with this one -> port:', port);
});
