const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');



//CREATE A MONGOOSE,USER OBJ
var {mongoose} = require('.././db/mongoose');
var {User} = require('.././models/user');
var {authenticateCookie} = require('.././middleware/authenticateCookie');
const {Threads} = require('./../models/threads');
const {Comment} = require('./../models/comment');

var urlEncodedParser = bodyParser.urlencoded({extended: false});



module.exports = function (app, port) {
  app.get('/forum', authenticateCookie, (req, res) =>{

    res.render("forumindex");
  });
}
