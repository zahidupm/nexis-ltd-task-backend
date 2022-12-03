const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
require('colors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vggwpnk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        // await client.connect();
        console.log('Database connected'.yellow.italic);
    } catch(error) {
        console.log(error.name.red, error.message.bold);
    }
}

dbConnect();

app.get('/', async (req, res) => {
    res.send(`Server is running`);
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})