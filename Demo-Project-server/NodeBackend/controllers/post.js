const Post = require("../../models/post");

exports.addPost = (request,response, next) => {
    const url = request.protocol + "://" + request.get("host");
    const post = new Post(
      {header : request.body.header,
        Content : request.body.Content,
        imagePath : url + "/images/" + request.file.filename,
        creator : request.userData.id
      });
    new Post(post).save()
    .then(item => {
      console.log("item successfully saved to database");
      response.status(201).json({
        message : "Post successfully added",
        post : {...post,
        id :  post._id,
      }
      });
    })
    .catch(error =>{
      response.status(500).json({
        message : "Couldnot add the post"
      });
    });
    
  }

  exports.editPost = (request,response, next) => {
    let imagePath = request.body.imagePath;
    if(request.file){
      const url = request.protocol + "://" + request.get("host");
      imagePath = url + "/images/" + request.file.filename;
    }
    Post.updateOne({ _id: request.params.id, creator : request.userData.id }, 
      {
      header: request.body.header,
      Content: request.body.Content,
      imagePath : imagePath
      }).then(result => {
        if(result.n > 0){
          response.status(200).json({ message: "Update successful!", imageUrl : imagePath });
        }
        response.status(401).json({ message: "Edit unsuccessful, Not creator of post" });
    })
    .catch(error => {
      response.status(500).json({
        message : "Couldnot edit the post"
      });
    });
  }

  exports.deletePost = (request, response, next)=>{
    console.log(request.params.id);
    Post.deleteOne({_id : request.params.id , creator :request.userData.id})
    .then(result => {
      if(result.n > 0){

        console.log(result);
        response.status(200).json({ message: "delete successful!" });
      }
      response.status(401).json({ message: "Delete unsuccessful, Not creator of post" });
    })
    .catch(error =>
      {
        response.status(500).json({
          message : "Couldnot delete the post"
        });
      })
  }

  exports.getPosts = (request, response, next) =>
  {
    const pageSize = +request.query.pageSize;
    const pageNumber = +request.query.pageNumber;
    const postQuery = Post.find();
    let postData;
    if(pageSize && pageNumber){
      postQuery.skip(pageSize * ( pageNumber - 1 ))
      .limit(pageSize);
    }
    postQuery.then(data =>{
      postData = data
      return Post.countDocuments();
    })
    .then(count =>{
      response.status(200).json(
        {
          message : "Succesasfully fetched data",
          posts : postData,
          numberOfPosts : count
        }
        );
    })
    .catch(error => {
      response.status(500).json({
        message : "Error in server!. Please try after some time"
      });
    });
  }

