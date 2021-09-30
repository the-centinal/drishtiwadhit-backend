const https = require("https");

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const multer = require('multer');

const mongodb = require('mongodb');
const axios = require('axios');
const cors  = require('cors');
const Razorpay = require("razorpay");


require("./src/db/conn");
// require("./src/db/docconn");


app.use(express.static('public'));
app.use(express.static('images'));

app.use(express.urlencoded({extended:false}));
app.use(cors());

const Register = require("./src/models/userregister");
const Documents = require("./src/models/docschema");
// const { Db } = require("mongodb");



const port = process.env.PORT || 3000;
const template_path = path.join(__dirname, "./templates/views");

const image_path = path.join(__dirname, "./images");

const rzpInstance = new Razorpay({
    key_id: 'rzp_test_Za2z7I4DwM3hq2',
    key_secret: '0vLzh7U4MDCCToBIyUG2xKZl'
});


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "hbs");
app.set('views', './templates/views');
app.set("views", template_path);
app.set("images", image_path);




app.get("/", (req, res) => {
   return  res.render("index")
});

app.get("/register", (req, res) => {
   return res.render("register");
});

app.get("/loginmain", (req, res) => {
    return  res.render("loginmain");
 });
 
 app.get("/docupload", (req, res) => {
    return res.render("docupload");
 });



 app.get('/news', async function(req,res){
    try{
        const newsapi = await axios.get(`https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=226ce4281c3a491b9bb177b8f174ad32`)
        // console.log(newsapi.data.articles[0]);
        return res.render('news.hbs',{articles : newsapi.data.articles});



    }catch(err){
        console.log("***********************error",err);
        return res.send('error boi');
    }
});

app.get("/donation", (req, res) => {
    return res.render("donation");
});

// object to store donation details and push to database
function Donation(invoiceId, orderId, receipt, customerDetails, amount, paymentURL) {
    this.invoice_id = invoiceId;
    this.order_id = orderId;
    this.receipt = receipt;
    this.customer_details = {
        "id": customerDetails.id.toString(),
        "name": customerDetails.name.toString(),
        "email": customerDetails.email.toString(),
        
    },
    this.amount = amount,
    this.short_url = paymentURL
};

app.post("/newDonation", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    
    const amount = req.body.amount;
    const receipt = (Math.random()*0xffffff*10000000000).toString(16).slice(0,6);
    const callbackURL = "/donationthanks";

    // object to store invoice API options
    const invoiceOptions = {
        "type": "invoice",
        "description": "Invoice for test donation",
        "customer": {
            "name": name,
            
            "email": email
        },
        "line_items": [{
            "name": "Donation",
            "description": "Donation cause",
            "amount": amount
        }],
        "date": Math.round(Date.now()/1000),
        "receipt": receipt,
        "callback_method": "get",
        // "callback_url": "./donationthanks"
    }

    // creating a new invoice
    rzpInstance.invoices.create(invoiceOptions, (error, invoice) => {
        if(error) {
            console.log(error);
        } else {
            const invoiceId = invoice.id.toString();
            const orderId = invoice.order_id.toString();
            const customerDetails = {
                "id": invoice.customer_details.id.toString(),
                "name": invoice.customer_details.name.toString(),
                "email": invoice.customer_details.email.toString(),
                
            };
            const amount = invoice.amount.toString();
            const paymentURL = invoice.short_url.toString();
            const currentDonation = new Donation(invoiceId, orderId, receipt, customerDetails, amount, paymentURL);
            //console.log(currentDonation);
            res.json(paymentURL);
        }
    });
});

app.get("/donationthanks", (req, res) => {
   return res.sendFile("donationthanks");
});



app.post("/register", async (req, res) => {
   try{

    const password = req.body.pass;
    const cpassword = req.body.cpass;

    if(password === cpassword) {

        const userRegister = new Register({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            mothername : req.body.mothername,
            fathername : req.body.fathername,
            address : req.body.address,
            gender : req.body.gender,
            dob : req.body.dob,
            doa : req.body.doa,
            pincode : req.body.pincode,
            emailid : req.body.emailid,
            mob : req.body.mob,
            pass : req.body.pass,
            cpass : req.body.cpass,
            sugg : req.body.sugg
        })

       

        const registered = await userRegister.save();
        res.status(201).render("index");
 
 


    } else{
        res.send("password are not matching")
    }
       
      
   } catch (error) {
       res.status(400).send(error);
   }
});

//login validation

app.post("/loginmain" , async(req, res) => {
    try {
        const username = req.body.firstname;
        const password = req.body.pass;

        const fname = await Register.findOne({firstname:username});

        const isMatch = await bcrypt.compare(password, fname.pass);

        if(isMatch) {
            res.status(201).render("index");
        }else {
            res.send("invalid login details");
        }

    } catch (error) {
        res.status(400).send("error");
    }
 });





const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, '/uploads')
    },
    filename:function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    description:function(req,file,cb){
        cb(null, file.description);
    }
});
const upload = multer({storage: storage});

module.exports = {upload};
 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//code of docs upload
// var upload = multer();
// app.post('/uploadmultiple', upload.array('userFiles', 12), (req, res, next) => {
//     const files = req.files;

//     if(!files) {
//         const error = new Error("please choose files");

//         error.httpStatusCode = 400;

//         return next(error);
//     } else {
//         var userdoc = {
//             userFiles : req.body.userFiles,
//             title : req.body.title,
//             description : req.body.description
    
//         };    
//         // const uploaded = userdoc.save();
//     }
//     res.send(files);
//     // db.collection('Documents').insertMany(userdoc, (err, result) => {
//         // console.log(result);

//         if(err) return console.log(err);
        
//         console.log("Saved to Database");

  
// });


const docUpload = async(req, res, next) => {
    try {
        let filesArray = [];
        req.filesArray.array.forEach(element => {
            const file = {
                userFiles : element.userFiles,
                title : element.title,
                description : element.description,
                fileType : element.mimetype
    
            }
            filesArray.push(file)
        });
        const Documents = new Document ({
            title: req.body.title,
            files: filesArray
        });
        await Documents.save();
        res.status(201).send('Files saved to Database')
    } catch (error) {
        res.status(400).send(error.message);
    }
};
app.post ('/uploadmultiple', upload.array('Document'), docUpload);
module.exports = {
    docUpload
};





app.listen(port, () => {
    console.log("server is running at port: " , port);
});

 