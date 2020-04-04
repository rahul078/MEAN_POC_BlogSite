const express = require("express");
const route = express.Router();
const postFunction = require("../NodeBackend/controllers/post");
const fileExtractor = require("../NodeBackend/middleware/fileExtractor");
const authorization = require('../NodeBackend/middleware/authentication');

  
  route.post("/",authorization,fileExtractor,postFunction.addPost);
  
  route.put("/:id",authorization,fileExtractor,postFunction.editPost);
  
  route.get("/",postFunction.getPosts);
  
  route.delete("/:id",authorization,postFunction.deletePost);

  module.exports = route;