"use strict";

var mongoose = require("mongoose");

var docSchema = new mongoose.Schema({
  // userFiles : {
  //     type:Array,
  //     required:true
  // },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  files: [Object]
}, {
  timestamps: true
});
var Documents = new mongoose.model("Documents", docSchema);
module.exports = Documents;