const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png' : "png",
    "image/jpeg" : "jpg",
    "image/jpg" : "jpg"
  };
  
  const storage = multer.diskStorage({
    destination : (request , file , callback) =>{
      callback(null, "images");
    },
    filename: (request , file , callback) =>{
      const file_name = file.originalname.toLowerCase().split(" ").join("_");
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(( (ext) ? null : new Error("Invalid MIME type") ), Date.now()+ file_name + "." + ext);
    }
  });
  
  module.exports = multer({storage:storage}).single("image");