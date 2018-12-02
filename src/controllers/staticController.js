// module.exports = {
//     index(req, res, next){
//         res.render("static/index", {title: "Welcome to Blocipedia"});
//     }
//   }

const express = require('express');
const router = express.Router();

module.exports = {
    index(req, res, next){
        res.render("index.ejs", {title: "Welcome to Bloccit"});
    }
}