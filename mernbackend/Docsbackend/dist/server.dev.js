"use strict";

var express = require("express");

var bodyParser = require('body-parser');

var multer = require('multer');

var app = express();
var port = process.env.PORT || 5000;

var mongodb = require('mongodb');

app.use(express["static"]('public'));
app.use(express["static"]('images'));

var Documents = require("../src/models/docschema"); //use the middleware of bodypasrer


app.use(bodyParser.urlencoded({
  extended: true
})); //configuring mongodb

var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017";
MongoClient.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true // useCreateIndex: true

}, function (err, client) {
  if (err) return console.log(err);
  db = client.db('Documents'), app.listen(function () {
    console.log("connection successfull");
  });
}); //configuring upload route

var upload = multer();
app.post('/uploadmultiple', upload.array('userFiles', 12), function (req, res, next) {
  var files = req.files;

  if (!files) {
    var error = new Error("please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send(files);
  db.collection('Documents').insertMany(files, function (err, result) {
    var userdoc = new Documents({
      userFiles: req.body.userFiles,
      title: req.body.title,
      description: req.body.description
    });
    var uploaded = userdoc.save();
    console.log(result);
    if (err) return console.log(err);
    console.log("Saved to Database"); //     res.json({
    //         err_code: 0
    //     })
  }); // db.close
}); //configuring home route

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(port, function () {
  console.log("server is running at port: ", port);
});