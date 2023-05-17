const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('A long time ago, in a galaxy far, far away...');
});

app.listen(port, () => {
	console.log('The Force is strong with this one -> port:', port);
});
