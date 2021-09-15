"use strict";

var express = require('express');

var app = express();

var newsController = require('./news-controller');

var path = require('path');

var axios = require('axios');

app.use(express.urlencoded());
app.set('view engine', 'hbs');
app.set('views', './view');
app.use(express["static"]('./public'));
app.get('/news', newsController.news);
app.get('/', newsController.index);