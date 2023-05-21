const express= require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app= express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// mongodb
  console.log(process.env.toy_password)

const uri = `mongodb+srv://${process.env.Toy_user}:${process.env.toy_password}@cluster0.xcj5skh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const AllToysCollection =client.db("allToys").collection("toys")
   

    app.post("/addToys",async(req,res)=>{
        const toys = req.body;
        //  console.log(toys)
         const result = await AllToysCollection.insertOne(toys)
         res.send(result)
         
      })

      app.get("/allToys",async(req,res)=>{
        const result = await AllToysCollection.find({}).toArray()
        res.send(result)
      })
     
      app.get('/myToys',async(req,res)=>{

        console.log(req.query.email)
        let query ={};
        if(req.query?.email){
          query = {email: req.query.email}
        }
        const result = await AllToysCollection.find(query).toArray();
        res.send(result)
       })

       app.get('/myToys/:id',async(req,res)=>{
        const id = req.params.id;
        const query ={_id: new ObjectId(id)}
        const result = await AllToysCollection.findOne(query)
        res.send(result)
      })



      app.get("/allToysByCategory/:category", async (req, res) => {
        // console.log(req.params.id);
        const toys = await AllToysCollection
          .find({
            category: req.params.category,
          })
          .toArray();
        res.send(toys);
      });

      app.get('/toys/:id',async(req,res) =>{
        const id= req.params.id
         const query ={_id: new ObjectId(id)}
          
         const result = await AllToysCollection.findOne(query)
         res.send(result)
    });
 
    // updated
    app.put('/myToys/:id', async(req,res)=>{
        const id=req.params.id;
        const filter = {_id: new  ObjectId(id)}
        const options = {upsert:true}
        const updatedToy=req.body
        const  toy = {
          $set:{
            toyName:updatedToy.toyName,
            quantity: updatedToy.quantity,
            sellerName: updatedToy.sellerName,
            rating: updatedToy.rating,
            price: updatedToy.price,
            category:updatedToy.category,
            description: updatedToy.description,
            photo:updatedToy.photo
          }
        }
        const result = await AllToysCollection.updateOne(filter,toy,options)
           res.send(result)
       })

//   photo,toyName,sellerName,category,price,rating,quantity,description
  
    // delete

    app.delete('/myToys/:id',async(req,res)=>{
     
        const id =req.params.id;
        console.log(id)
   
        const query = {_id: new ObjectId(id)}
        const result =  await AllToysCollection.deleteOne(query)
        res.send(result)
      })



//    console.log(uri)

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('backend running is running')
})
app.listen(port,()=>{
    console.log(` server working ${port}`)
})
