"use strict";

var axios = require('axios');

module.exports.news = function _callee(req, res) {
  var newsapi;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get('https://newsapi.org/v2/top-headlines?country=in&apiKey=34cd96a9f1f3429ba8d51f22228b9ac8'));

        case 3:
          newsapi = _context.sent;
          return _context.abrupt("return", res.render('/news', {
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
};

module.exports.index = function (req, res) {
  try {
    return res.render('index.hbs');
  } catch (err) {
    console.log("***********************error", err);
    return res.send('error boi');
  }
};