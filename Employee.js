const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var bodyParser = require('body-parser')

//var url = 'mongodb://localhost:27017';
var url ='mongodb+srv://ChuppaChups:1234@4321@beginning-lbnvt.azure.mongodb.net/test';

router.get('/',async (req,res)=>  // có async thì phải có await
{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{Employee:results});
})

//sanpham/search nhưng dùng POST
router.post('/searchE',async (req,res)=>{ //search
  let searchE = req.body.tenE;
  let client= await MongoClient.connect(url);
  let dbo = client.db("NoSQLBoosterSamples");
  let results = await dbo.collection("Employee").find({"Name":searchE}).toArray();
    res.render('allEmployee',{Employee:results});
})

var MongoClient = require('mongodb').MongoClient;
//sanpham/insert -> post luôn
router.post('/insertE',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    
    let name = req.body.tenE; //tenSP là name ở bên addSanPham
    let DoB = req.body.DoB;
    let number = req.body.number;
    let email = req.body.email;

    let newE = {Name : name, DoB : DoB, Number : number, Email : email}; 
    await dbo.collection("Employee").insertOne(newE);
   
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{Employee:results});
})

//update SanPham
router.get('/editE',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("Employee").findOne({"_id" : ObjectID(id)});
    res.render('editEmployee',{Employee:results});
})

router.post('/editE', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let doB = req.body.dob;
    let number = req.body.number;
    let email = req.body.email;
    let newValues ={$set : {Name : name, DoB : doB, Number : number, Email : email}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    await dbo.collection("Employee").updateOne(condition,newValues);

    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{Employee:results});
    
})

//delete truc tiep
router.get('/deleteE', async (req, res) => {
    let client = await MongoClient.connect(url);
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let dbo = client.db("NoSQLBoosterSamples");
    let condition = { "_id": ObjectID(id) };
    await dbo.collection("Employee").deleteOne(condition);
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee', { Employee:results });
})

   
module.exports = router;