const https = require("https");

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");


const Register = require("./models/userregister");
// const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const template_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views", template_path);

app.get("/", (req, res) => {
   return  res.send("index")
});

app.get("/register", (req, res) => {
    return  res.render("register");
});

app.get("/login-main", (req, res) => {
    return    res.render("login-main");
});



app.post("/register", async (req, res) => {
   try{
       const userRegister = new Register({
           firstname : req.body.firstname,
           lastname : req.body.lastname,
           mothername : req.body.mothername,
           fathername : req.body.fathername,
           address : req.body.address,
           gender : req.body.gender,
           dob : req.body.dob,
           pincode : req.body.pincode,
           emailid : req.body.emailid
       })

       const registered = await userRegister.save();
       res.status(201).render("index");

   } catch (error) {
       res.status(400).send(error);
   }
});

app.listen(port, () => {
    console.log("server is running at port: " , port);
});

