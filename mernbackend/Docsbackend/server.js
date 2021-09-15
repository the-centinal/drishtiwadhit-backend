const express = require("express");

const bodyParser = require('body-parser');

const multer = require('multer');

const app = express();

const port = process.env.PORT || 5000;

const mongodb = require('mongodb');

app.use(express.static('public'));

app.use(express.static('images'));


const Documents = require("../src/models/docschema");


//use the middleware of bodypasrer

app.use(bodyParser.urlencoded({extended:true}));

//configuring mongodb

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
    // useCreateIndex: true
}, (err, client) => {
    if(err) return console.log(err);

    db = client.db('Documents'),
    app.listen( () => {
        console.log("connection successfull")
    })


});

//configuring upload route
var upload = multer();
app.post('/uploadmultiple', upload.array('userFiles', 12), (req, res, next) => {
    const files = req.files;

    if(!files) {
        const error = new Error("please choose files");

        error.httpStatusCode = 400;

        return next(error);
    }
    

    res.send(files);

    db.collection('Documents').insertMany(files, (err, result) => {

        const userdoc = new Documents ({
            userFiles : req.body.userFiles,
            title : req.body.title,
            description : req.body.description
    
        })    
        const uploaded = userdoc.save();


        console.log(result);

        if(err) return console.log(err);
        
        console.log("Saved to Database");
        
    //     res.json({
    //         err_code: 0
    //     })
    
    })
    // db.close


});



//configuring home route

app.get('/', (req, res) => {
      res.sendFile(__dirname + "/index.html");
});






















app.listen(port, () => {
    console.log("server is running at port: " , port);
});