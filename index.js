const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
//manufacture
//c5uDTfHnU1csdoXl

app.use(cors());
app.use(express.json());

//environment variable use command
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmwjg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}


async function run() {
    try {
        await client.connect();
        console.log('mongodb connet');
        const serviceCollecton = client.db('manufactur').collection('service');
        const userCollecton = client.db('manufactur').collection('user');
        const reviewCollecton = client.db('manufactur').collection('review');
        const orderCollecton = client.db('manufactur').collection('order');
        const updateuserCollecton = client.db('manufactur').collection('updateuser');

        app.get('/service', async (req, res) => {

            const query = {};
            const carsor = serviceCollecton.find(query);
            const service = await carsor.toArray();
            res.send(service);
        })
        app.get('/order', async (req, res) => {

            const query = {};
            const carsor = orderCollecton.find(query);
            const service = await carsor.toArray();
            res.send(service);
        })
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollecton.insertOne(newService);

            res.send(result);
        });
        app.post('/order', async (req, res) => {
            const newService = req.body;
            const result = await orderCollecton.insertOne(newService);

            res.send(result);
        });
        app.get('/review', async (req, res) => {

            const query = {};
            const carsor = reviewCollecton.find(query);
            const service = await carsor.toArray();
            res.send(service);
        })
        app.get('/userUpdate', async (req, res) => {

            const query = {};
            const carsor = updateuserCollecton.find(query);
            const service = await carsor.toArray();
            res.send(service);
        })
        app.post('/review', async (req, res) => {
            const newService = req.body;
            const result = await reviewCollecton.insertOne(newService);

            res.send(result);
        });
        app.post('/userUpdate', async (req, res) => {
            const newService = req.body;
            const result = await updateuserCollecton.insertOne(newService);

            res.send(result);
        });


        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await serviceCollecton.deleteOne(filter);

            res.send(result);
        });
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await orderCollecton.deleteOne(filter);

            res.send(result);
        });
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollecton.deleteOne(filter);

            res.send(result);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await serviceCollecton.findOne(filter);

            res.send(result);
        });
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollecton.findOne(filter);

            res.send(result);
        });
        app.get('/user', async (req, res) => {
            const result = await userCollecton.find().toArray();
            res.send(result);
        })
        app.get('/admin/:email', async(req, res) =>{
            const email = req.params.email;
            const user = await userCollecton.findOne({email: email});
            const isAdmin = user.role === 'admin';
            res.send({admin: isAdmin})
          })
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollecton.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res.send({ result, token });
        })
        app.put('/user/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAccount = await userCollecton.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                const filter = { email: email };
                const updateDoc = {
                  $set: { role: 'admin' },
                };
                const result = await userCollecton.updateOne(filter, updateDoc);
                res.send(result);
              }
              else{
                res.status(403).send({message: 'forbidden'});
              }
        })

    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('welcome manufacture server!!!!');
})

app.listen(port, () => {
    console.log('the manufacture server is running');
})