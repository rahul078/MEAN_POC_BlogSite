const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postRoute = require('../routes/PostRoutes');
const userRoute = require('../routes/authUser');
const path = require("path");

//Mongoose db connection

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://node_server_user:" + process.env.MONGO_PWD + "@cluster0-buc84.mongodb.net/PostDb?retryWrites=true&w=majority")
.then(() =>{
  console.log("Established connection to database");
}).catch(() =>   {
  console.log("Connection to database failed");
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join('images')));

app.use((request, response, next) =>{
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT, DELETE");
  next();
});

app.use("/api/posts/",postRoute);

app.use("/api/user/",userRoute);

module.exports = app;
