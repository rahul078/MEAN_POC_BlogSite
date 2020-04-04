const express = require("express");
const userFunctions = require("../NodeBackend/controllers/user");
const route = express.Router();

route.post("/signup",userFunctions.createUser);

route.post("/login",userFunctions.loginUser);

module.exports = route;