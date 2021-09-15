const mongoose = require("mongoose");



const docSchema = new mongoose.Schema({
    // userFiles : {
    //     type:Array,
    //     required:true
    // },
    title : {
        type:String,
        required:true
    },

    description : {
        type:String,
        required:true
    },
    files:[Object]
      
},  {timestamps: true});



const Documents = new mongoose.model("Documents", docSchema);

module.exports = Documents;