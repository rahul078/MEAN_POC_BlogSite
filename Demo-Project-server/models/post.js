const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    header : {type : String, required: true} ,
    Content : {type : String, required: true},
    imagePath : {type : String, required: true},
    creator : {type : mongoose.Schema.Types.ObjectId, ref : "postSchema", required : true}
});

module.exports =  mongoose.model("post", postSchema);