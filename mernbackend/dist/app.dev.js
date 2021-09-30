"use strict";

var https = require("https");

var express = require("express");

var app = express();

var path = require("path");

var hbs = require("hbs");

var bcrypt = require("bcryptjs");

var bodyParser = require('body-parser');

var multer = require('multer');

var mongodb = require('mongodb');

var axios = require('axios');

var cors = require('cors');

var Razorpay = require("razorpay");

require("./src/db/conn"); // require("./src/db/docconn");


app.use(express["static"]('public'));
app.use(express["static"]('images'));
app.use(express.urlencoded({
  extended: false
}));
app.use(cors());

var Register = require("./src/models/userregister");

var Documents = require("./src/models/docschema"); // const { Db } = require("mongodb");


var port = process.env.PORT || 3000;
var template_path = path.join(__dirname, "./templates/views");
var image_path = path.join(__dirname, "./images");
var rzpInstance = new Razorpay({
  key_id: 'rzp_test_Za2z7I4DwM3hq2',
  key_secret: '0vLzh7U4MDCCToBIyUG2xKZl'
});
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "hbs");
app.set('views', './templates/views');
app.set("views", template_path);
app.set("images", image_path);
app.get("/", function (req, res) {
  return res.render("index");
});
app.get("/register", function (req, res) {
  return res.render("register");
});
app.get("/loginmain", function (req, res) {
  return res.render("loginmain");
});
app.get("/docupload", function (req, res) {
  return res.render("docupload");
});
app.get('/news', function _callee(req, res) {
  var newsapi;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get("https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=226ce4281c3a491b9bb177b8f174ad32"));

        case 3:
          newsapi = _context.sent;
          return _context.abrupt("return", res.render('news.hbs', {
            articles: newsapi.data.articles
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("***********************error", _context.t0);
          return _context.abrupt("return", res.send('error boi'));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.get("/donation", function (req, res) {
  return res.render("donation");
}); // object to store donation details and push to database

function Donation(invoiceId, orderId, receipt, customerDetails, amount, paymentURL) {
  this.invoice_id = invoiceId;
  this.order_id = orderId;
  this.receipt = receipt;
  this.customer_details = {
    "id": customerDetails.id.toString(),
    "name": customerDetails.name.toString(),
    "email": customerDetails.email.toString()
  }, this.amount = amount, this.short_url = paymentURL;
}

;
app.post("/newDonation", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var amount = req.body.amount;
  var receipt = (Math.random() * 0xffffff * 10000000000).toString(16).slice(0, 6);
  var callbackURL = "/donationthanks"; // object to store invoice API options

  var invoiceOptions = {
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
    "date": Math.round(Date.now() / 1000),
    "receipt": receipt,
    "callback_method": "get" // "callback_url": "./donationthanks"

  }; // creating a new invoice

  rzpInstance.invoices.create(invoiceOptions, function (error, invoice) {
    if (error) {
      console.log(error);
    } else {
      var invoiceId = invoice.id.toString();
      var orderId = invoice.order_id.toString();
      var customerDetails = {
        "id": invoice.customer_details.id.toString(),
        "name": invoice.customer_details.name.toString(),
        "email": invoice.customer_details.email.toString()
      };

      var _amount = invoice.amount.toString();

      var paymentURL = invoice.short_url.toString();
      var currentDonation = new Donation(invoiceId, orderId, receipt, customerDetails, _amount, paymentURL); //console.log(currentDonation);

      res.json(paymentURL);
    }
  });
});
app.get("/donationthanks", function (req, res) {
  return res.sendFile("donationthanks");
});
app.post("/register", function _callee2(req, res) {
  var password, cpassword, userRegister, registered;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          password = req.body.pass;
          cpassword = req.body.cpass;

          if (!(password === cpassword)) {
            _context2.next = 11;
            break;
          }

          userRegister = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mothername: req.body.mothername,
            fathername: req.body.fathername,
            address: req.body.address,
            gender: req.body.gender,
            dob: req.body.dob,
            doa: req.body.doa,
            pincode: req.body.pincode,
            emailid: req.body.emailid,
            mob: req.body.mob,
            pass: req.body.pass,
            cpass: req.body.cpass,
            sugg: req.body.sugg
          });
          _context2.next = 7;
          return regeneratorRuntime.awrap(userRegister.save());

        case 7:
          registered = _context2.sent;
          res.status(201).render("index");
          _context2.next = 12;
          break;

        case 11:
          res.send("password are not matching");

        case 12:
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          res.status(400).send(_context2.t0);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); //login validation

app.post("/loginmain", function _callee3(req, res) {
  var username, password, fname, isMatch;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          username = req.body.firstname;
          password = req.body.pass;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Register.findOne({
            firstname: username
          }));

        case 5:
          fname = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(bcrypt.compare(password, fname.pass));

        case 8:
          isMatch = _context3.sent;

          if (isMatch) {
            res.status(201).render("index");
          } else {
            res.send("invalid login details");
          }

          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          res.status(400).send("error");

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
  description: function description(req, file, cb) {
    cb(null, file.description);
  }
});
var upload = multer({
  storage: storage
});
module.exports = {
  upload: upload
};
app.use('/uploads', express["static"](path.join(__dirname, 'uploads'))); //code of docs upload
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

var docUpload = function docUpload(req, res, next) {
  var filesArray, _Documents;

  return regeneratorRuntime.async(function docUpload$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          filesArray = [];
          req.filesArray.array.forEach(function (element) {
            var file = {
              userFiles: element.userFiles,
              title: element.title,
              description: element.description,
              fileType: element.mimetype
            };
            filesArray.push(file);
          });
          _Documents = new Document({
            title: req.body.title,
            files: filesArray
          });
          _context4.next = 6;
          return regeneratorRuntime.awrap(_Documents.save());

        case 6:
          res.status(201).send('Files saved to Database');
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(400).send(_context4.t0.message);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

app.post('/uploadmultiple', upload.array('Document'), docUpload);
module.exports = {
  docUpload: docUpload
};
app.listen(port, function () {
  console.log("server is running at port: ", port);
});