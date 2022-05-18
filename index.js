const express = require('express');
const cors = require('cors');


require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvlbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run() {
    try {
      await client.connect();
      const toDoCollection = client.db('ToDoList').collection('Tasks')
      console.log('Connected');
  
      app.post('/tasks', async (req, res) => {
        const task = req.body;
        const result = await toDoCollection.insertOne(task);
        res.send(result);
      });
  
      app.get('/tasks',  async (req, res) => {
        const tasks = await toDoCollection.find().toArray();
        res.send(tasks);
      })
  
      app.delete('/tasks/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await toDoCollection.deleteOne(query);
        res.send(result);
    });


    
    }
    finally { }
  }
  run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })