const express = require('express');
const engines = require('consolidate');
const app = express();

//Kết nói tới folder public
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//bang search
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


var HomepageController = require("./homepage.js");
var SanPhamController = require("./SanPham.js");
var EmployeeController = require("./Employee.js");
var uploadFileController= require('./uploadFile.js');


app.use('/', HomepageController);
app.use('/SanPham', SanPhamController);
app.use('/Employee', EmployeeController);
app.use('/upload',uploadFileController);

var port = process.env.PORT || 5000;

var server=app.listen(port,function() {});

