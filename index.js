const express = require('express')
const app = express();

// cors
var cors = require('cors')
app.use(cors())

// body parser
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// dotenv
require('dotenv').config()


//mongo db connect
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });


app.get('/products',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.find().toArray((err,documents)=>{
        if(err){
          console.log(err);
        }else{
          res.send(documents);
        }
      })
    client.close();
    });

  });

app.get('/fruit/banana',(req,res)=>res.send({mango:'am'}))

const user = ['nayon','korim','khan','abbas']



app.get('/product/:key',(req,res)=>{
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.find({key}).toArray((err,documents)=>{
        if(err){
          console.log(err);
        }else{
          res.send(documents[0]);
        }
      })
    client.close();
    });
})

app.post('/getProductByKey',(req,res)=>{
  const key = req.params.key;
  const productKeys = req.body;
  console.log(productKeys)
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
  const collection = client.db("onlineStore").collection("products");
  collection.find({key:{$in:productKeys}}).toArray((err,documents)=>{
      if(err){
        console.log(err);
      }else{
        res.send(documents);
      }
    })
  client.close();
  });
})


app.post('/addProduct',(req,res)=>{
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
      const collection = client.db("onlineStore").collection("products");
      collection.insert(product,(err,result)=>{
          if(err){
            console.log(err);
          }else{
            res.send(result.ops[0]);
          }
            
            
        })
      client.close();
    });
})

app.post('/placeOrder',(req,res)=>{
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  console.log(orderDetails);
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    collection.insert(orderDetails,(err,result)=>{
        if(err){
          console.log(err);
        }else{
          res.send(result.ops[0]);
        }
      })
    client.close();
  });
})








const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`Example app listening at 3000`))