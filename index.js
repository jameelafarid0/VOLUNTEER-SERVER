const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l4d6v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/',(req,res) => {
    res.send('hi db i am working!')
})


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });
client.connect(err => {
  const taskCollection = client.db("volunteerdb").collection("tasks");
  app.post('/addTask', (req, res) => {
      const task = req.body;
      console.log(task)
      taskCollection.insertMany(task)
      .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })
  }) 

  app.get('/tasks', (req,res) => {
      taskCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })



});

client.connect(err => {
    const users = client.db("volunteerdb").collection("UserList");

    app.post('/addUserList', (req, res) => {
        const newUser = req.body;
        users.insertOne(newUser)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/userTask', (req, res) => {
        users.find({email: req.query.email})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        users.deleteOne({_id: ObjectId(req.params.id)})
        .then((err, result)=>{
            // console.log(result)
        })
    })


    

});


app.listen(process.env.PORT || port)