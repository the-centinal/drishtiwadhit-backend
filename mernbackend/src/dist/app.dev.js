"use strict";

var https = require("https");

var express = require("express");

var app = express();

var path = require("path");

var hbs = require("hbs");

require("./db/conn");

var Register = require("./models/userregister"); // const hostname = '127.0.0.1';


var port = process.env.PORT || 3000;
var template_path = path.join(__dirname, "../templates/views");
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.set("view engine", "hbs");
app.set("views", template_path);
app.get("/", function (req, res) {
  return res.send("index");
});
app.get("/register", function (req, res) {
  return res.render("register");
});
app.get("/login-main", function (req, res) {
  return res.render("login-main");
});
app.post("/register", function _callee(req, res) {
  var userRegister, registered;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userRegister = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mothername: req.body.mothername,
            fathername: req.body.fathername,
            address: req.body.address,
            gender: req.body.gender,
            dob: req.body.dob,
            pincode: req.body.pincode,
            emailid: req.body.emailid
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(userRegister.save());

        case 4:
          registered = _context.sent;
          res.status(201).render("index");
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(400).send(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
app.listen(port, function () {
  console.log("server is running at port: ", port);
});