"use strict";

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Documents", {
  useNewUrlParser: true,
  useUnifiedTopology: true // useCreateIndex: true

}).then(function () {
  console.log("connection successfull");
})["catch"](function (e) {
  console.log(e);
});