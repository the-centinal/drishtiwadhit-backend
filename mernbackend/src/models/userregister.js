const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },

    mothername : {
        type:String,
        required:true
    },

    fathername : {
        type:String,
        required:true
    },

    address : {
        type:String, 
        required:true
    },

    gender : {
        type:String,
        required:true
    },

    dob : {
        type:Date,
        required:true
    },

    doa : {
        type:String,
        required:true
    },

    pincode : {
        type:Number,
        required:true
    },

    emailid : {
        type:String,
        required:true
    },

    mob: {
        type:Number,
        required:true,
        unique:true
    },

    pass: {
        type:String,
        required:true
    },

    cpass: {
        type:String,
        required:true
    },

    sugg: {
        type:String,
        required:true
    }
});

userSchema.pre("save", async function(next) {
    if(this.isModified("pass")){

        // console.log('the password is ${this.pass}' );
        this.pass = await bcrypt.hash(this.pass, 10);
        // console.log('the password is ${this.pass}' );
        // const passHash = await bcrypt.passHash(pass, 10);

        // this.cpass = undefined;
    }


    next();
});


const Register = new mongoose.model("Register", userSchema);

module.exports = Register;