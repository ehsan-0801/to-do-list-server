const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7huc3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const listCollection = client.db('ToDoList').collection('tasks');
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = listCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        app.post('/tasks', async (req, res) => {
            const newtasks = req.body;
            const result = await listCollection.insertOne(newtasks);
            res.send(result);
        });
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await listCollection.deleteOne(query);
            res.send(result);
        });
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const newTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedTask = {
                $set: {
                    Status: true
                }
            }
            const result = await listCollection.updateOne(filter, updatedTask, options);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server Started")
})

app.listen(port, () => {
    console.log("Server is Running on port", port)
})