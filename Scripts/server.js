const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const fs=require('fs').promises;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const session=require('express-session');

const app=express();
const port= 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 72, // 3 zile
    secure: false, 
    httpOnly: true,
    sameSite: 'strict'
  }
}));

app.use(cors({origin:'http://localhost:3000',credentials:true}));
app.use(express.static('C:\\Tehnici Web\\Tema'))

//Parte de login.register unde am Post-ul
const accountFilePath='./accounts.json';

async function readAccountData(){
    const json=await fs.readFile(accountFilePath);
    return JSON.parse(json);
}

async function writeAccountData(data){
    await fs.writeFile(accountFilePath,JSON.stringify(data,null,2));
}

const autorizat=(req,res,next)=>{
  if(req.session.username){
    next();
  }
  else{
    return res.status(401).send('Unauthorized!');
  }
};

app.post('/login',async (req,res)=>{
  const {username,password}=req.body;

  const accountsData=await readAccountData();
  const accountExisting=accountsData.accounts.find(account=>account.username===username && account.password===password);
  if(accountExisting){
      req.session.username=accountExisting.username;
      req.session.save();
      res.status(200).send('Authentification successful!');
  }
  else{
      res.status(401).send('Authentification failed! Check if the username and the password were correctly typed!')
  }
});

app.post('/register',async (req,res)=>{
    const {name,username,password,mail,tel,credit}=req.body;

    const accountsData=await readAccountData();
    const existingAccount=accountsData.accounts.find(account =>account.username===username);
    if(existingAccount){
        return res.status(400).send('Error! The username is already used by another account.');
    }

    accountsData.accounts.push({name,username,password,mail,tel,credit});
    await writeAccountData(accountsData);

    res.status(200).send('Account has been registered with success.');
});

app.post('/logout',(req,res)=>{
  req.session.destroy(err=>{
    if(err){
      return res.status(500).send('Error with the log out.');
    }
    res.status(200).send('Log out successful!');
  });
});

//Parte de MongoDb cu Get/Patch/Delete
const uri = "mongodb+srv://stinga2004:stinga2004@fosiledinozauri.t2rmyxf.mongodb.net/Tema?retryWrites=true&w=majority" || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function initMongo(){
    try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("stinga2004").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch(err) {
    console.error(err);
    }
}
initMongo();

let db = client.db("Tema");

const router = express.Router();

app.use("/dinosaur",router);

router.get("/", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});

router.get("/:id", async (req, res) => {
    let collection = await db.collection("Dinosaurs");
    let query;
    try{
        query = { _id: new ObjectId(req.params.id) };
    }
    catch{res.status(404).send("Not found!");return;}
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

router.patch("/:id", autorizat, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      let updates;
      if(!req.body.time){
        updates = {
            $set: {
              Name: req.body.Name,
              Habitat: req.body.Habitat,
              Hip_Clade: req.body.Hip_Clade,
              Diet:req.body.Diet,
              Order:req.body.Order
            },
          };
      }
    else{
        updates = {
        $set: {
          Name: req.body.Name,
          Habitat: req.body.Habitat,
          Hip_Clade: req.body.Hip_Clade,
          Diet:req.body.Diet,
          Time:req.body.Time,
          Areas_where_fossils_were_found:req.body.Areas_where_fossils_were_found,
          Order:req.body.Order,
          Contemporary:req.body.Contemporary
        },
      };
    }
  
      let collection = await db.collection("Dinosaurs");
      let result = await collection.updateOne(query, updates);
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating dinosaur");
    }
  });

  router.post("/", autorizat, async (req, res) => {
    try {
      let newDocument = {
        Name: req.body.Name,
        Habitat: req.body.Habitat,
        Hip_Clade: req.body.Hip_Clade,
        Diet:req.body.Diet,
        Time:req.body.Time,
        Areas_where_fossils_were_found:req.body.Areas_where_fossils_were_found,
        Order:req.body.Order,
        Contemporary:req.body.Contemporary
      };
      if(!req.body.Time){
        newDocument.Time='';
        newDocument.Areas_where_fossils_were_found='';
        newDocument.Contemporary='';
      }
      let collection = await db.collection("Dinosaurs");
      let result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding dinosaur");
    }
  });

  router.delete("/:id", autorizat, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
  
      const collection = db.collection("Dinosaurs");
      let result = await collection.deleteOne(query);
  
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting dinosaur");
    }
  });

app.listen(port,()=>{
    console.log(`The server is running on the http://localhost:${port} address`);
});

app.get("/*",(req,res)=>{
  res.status(404).send('<h1>Not found</h1>')
})