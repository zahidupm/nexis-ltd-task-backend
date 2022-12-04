const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

const User = client.db('nexIsFrontendTask').collection('users');

function verifyJWT (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).send('unauthorized access')
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
            if(err) {
                return res.status(403).send({message: 'forbidden access'})
            }
            req.decoded = decoded;
            next();
        })
    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
}

app.get('/jwt', async (req, res) => {
    try {
        const email = req.query.email;
        const query = {email: email};
        const user = await User.findOne(query);
        if(user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '7d' });
            return res.send({ accessToken: token})
        }
        res.status(403).send({accessToken: ''})

    }  catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const result = await User.insertOne(user);
        res.send(result);

    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.put('/users', async(req, res) => {
    try {
        const email = req.query.email;
        const filter = { email: email };
        const options = {}
        const updatedDoc = {
            $set: {
                mobile_number: ''
            }
        }
        const result = await User.updateOne(filter, updatedDoc, options);
        res.send(result);

    } catch(error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.get('/', async (req, res) => {
    res.send(`Server is running`);
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})