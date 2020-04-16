const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
const multer = require('multer');

//var url = 'mongodb://localhost:27017';
var url ='mongodb+srv://ChuppaChups:1234@4321@beginning-lbnvt.azure.mongodb.net/test';

router.get('/',async (req,res)=>  // có async thì phải có await
{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{SanPham:results});
})

//sanpham/search -> browser
router.get('/search',(req,res)=>{
    res.render('searchSanPham');
})

//sanpham/search nhưng dùng POST
router.post('/search',async (req,res)=>{ //search
  let searchSP = req.body.tenSP;
  let client= await MongoClient.connect(url);
  let dbo = client.db("NoSQLBoosterSamples");
  let results = await dbo.collection("SanPham").find({"TenSP":searchSP}).toArray();
    res.render('allSanPham',{SanPham:results});
})

//add san pham
var MongoClient = require('mongodb').MongoClient;

//sanpham/insert -> post luôn
/*
router.post('/insert',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    
    let name = req.body.tenSP; 
    let gia = req.body.giaSP;
    let mau = req.body.mauSP;

    let newSP = {TenSP : name, Color : mau, Price : gia}; //TenSP, Color, Price là ở trong mongodb
    await dbo.collection("SanPham").insertOne(newSP);
   
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{SanPham:results});
})
*/

//insert anh

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db('NoSQLBoosterSamples')
});
router.get('/insert', async (req, res) => {
    res.render('allSanPham');
});

router.post('/insert',upload.single('picture'), async (req, res) => {
var img = fs.readFileSync(req.file.path);
var encode_image = img.toString('base64');

var insertProducts = {
    _id: req.body._id,
    TenSP: req.body.tenSP,
    Price: req.body.giaSP,
    Color: req.body.mauSP,
    contentType: req.file.mimetype,
    image: new Buffer(encode_image, 'base64')
};
let client = await MongoClient.connect(url);
let dbo = client.db("NoSQLBoosterSamples");
await dbo.collection("SanPham").insertOne(insertProducts, (err, result)=>{
    console.log(result)
    if (err) return console.log(err)
    console.log('saved to database')
});
let result2 = await dbo.collection("SanPham").find({}).toArray();
res.render('allSanPham', {SanPham: result2});
});

router.get('/photos', (req, res) => {
db.collection('SanPham').find().toArray((err, result) => {
    const imgArray = result.map(element => element._id);
    console.log(imgArray);
    if (err) return console.log(err)
    res.send(imgArray)
})
});
router.get('/photo/:id', (req, res) => {
var filename = req.params.id;
db.collection('SanPham').findOne({'_id': ObjectId(filename)}, (err, result) => {
    if (err) return console.log(err);
    res.contentType('image/jpeg');
    res.send(result.image.buffer);
    //res.render('allSanPham',{img:result.image.buffer});
})
});


/* //update SanPham
router.get('/edit',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("SanPham").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{SanPham:results});
})

router.post('/edit',upload.single('picture'), async(req,res)=>{
    let id = req.body.id;
    console.log("ID " + id);
    let name = req.body.name;
    let color = req.body.color;
    let price = req.body.price;
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    let contentType = req.file.mimetype;
    image = new Buffer(encode_image, 'base64');
    let newValues = {
        $set: {
            TenSP: name,
            Price: price,
            Color: color,
            contentType: contentType,
            image: image
        }
    };
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id": ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    await dbo.collection("SanPham").updateOne(condition, newValues);
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham', {products: results});
}); */

    //update SanPham
router.get('/edit',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("SanPham").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{SanPham:results});
})

router.post('/edit', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let color = req.body.color;
    let price = req.body.price;
    let newValues ={$set : {TenSP: name, Color : color, Price:price}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    await dbo.collection("SanPham").updateOne(condition,newValues);

    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{SanPham:results});
    
})


//delete truc tiep
router.get('/delete', async (req, res) => {
    let client = await MongoClient.connect(url);
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let dbo = client.db("NoSQLBoosterSamples");
    let condition = { "_id": ObjectID(id) };
    await dbo.collection("SanPham").deleteOne(condition);
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham', { SanPham:results });
})

   
module.exports = router;