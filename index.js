const express  = require('express');
const bodyParser = require ('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId


const uri = "mongodb+srv://farhan:bCBXJlKHG99wzUWM@cluster0.2xoju.mongodb.net/firstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get ('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
});


app.listen(3000);

client.connect(err => {
  const productCollection = client.db("firstDatabase").collection("product");

  app.get('/product', (req, res) =>{
      productCollection.find({})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
  })

  app.get('/singleProduct/:id' , (req, res) =>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray( (err, documents) =>{
        res.send(documents[0])
    })

  })

  app.post('/addProduct', (req, res) =>{
      const product = req.body;
      productCollection.insertOne(product)
        .then(result =>{
          //  console.log("data added");
            res.redirect('/')
        })
  })

  app.patch('/update/:id' , (req, res) =>{
  //  console.log(req.body.price);
    productCollection.updateOne({_id:ObjectId(req.params.id)},
    {
        $set:{price: req.body.price, quantity: req.body.quantity}
    })
    .then(  result=>{
        res.send(result.matchedCount > 0)
    })
  })

  app.delete('/delete/:id' , (req, res) =>{
      console.log(req.params.id);
       productCollection.deleteOne({_id:ObjectId(req.params.id)})
       .then(  result =>{
           res.send(result.deletedCount > 0)
      })
  })

})




    // .then(result =>{
    //     console.log("one product added")
    // })
//   console.log("database connected")
  // perform actions on the collection object
 
// });

