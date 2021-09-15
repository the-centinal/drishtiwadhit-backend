"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  mothername: {
    type: String,
    required: true
  },
  fathername: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  doa: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  emailid: {
    type: String,
    required: true
  },
  mob: {
    type: Number,
    required: true,
    unique: true
  },
  pass: {
    type: String,
    required: true
  },
  cpass: {
    type: String,
    required: true
  },
  sugg: {
    type: String,
    required: true
  }
});
userSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified("pass")) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.pass, 10));

        case 3:
          this.pass = _context.sent;

        case 4:
          next();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
var Register = new mongoose.model("Register", userSchema);
module.exports = Register;