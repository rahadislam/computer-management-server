const express = require('express');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors =require('cors');
//manufacture
//c5uDTfHnU1csdoXl

app.use(cors());
app.use(express.json());

//environment variable use command
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmwjg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        console.log('mongodb connet');
        const serviceCollecton = client.db('manufactur').collection('service');
       
        app.get('/service',async(req,res)=>{
            const query={};
            const carsor=serviceCollecton.find(query);
            const service=await carsor.toArray();
            res.send(service);
        })
        app.delete('/service/:id', async (req, res) => {
            const id=req.params.id;
            console.log(id);
            const filter={_id:ObjectId(id)};
            const result = await serviceCollecton.deleteOne(filter);

            res.send(result);
        });

    }
    finally{

    }

}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('welcome manufacture server!!!!');
})

app.listen(port,()=>{
    console.log('the manufacture server is running');
})