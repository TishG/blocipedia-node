const express = require("express");
const app = express();
// const appConfig = require("./db/config/main-config.js");

// appConfig.init();

app.use("/", (req, res, next) => {
    res.send("Welcome to Blocipedia")
  });

module.exports = app;