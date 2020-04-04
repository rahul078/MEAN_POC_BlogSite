const User = require("../../models/user");
const encrypter = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (request, response, next) => {
    encrypter.hash(request.body.password,10).then(hash =>{
        const userModel = new User({
            email : request.body.email,
            password : hash,
            name : request.body.name
         });
         userModel.save()
         .then(result => {
             response.status(200).json({
                 message : "user successfully added",
                 result : result
             })
         })
         .catch(error => {
             response.status(500).json({
                 message : "User Email already exists",
                 result : error
             })
         });
    }) 
}

exports.loginUser =(request, response, next) =>{
    let userStore;
    console.log(request.body);
    User.findOne({email : request.body.email})
    .then(
        user => {
            if(!user){
                response.status(401).json(
                    {message: "Invalid email"}
                );
            }
            userStore = user;
            return encrypter.compare(request.body.password, user.password);
        }
    )
    .then(
        passwordResult => {
            console.log(passwordResult);
            if(!passwordResult){
                return response.status(401).json(
                    {message: "Invalid Passowrd"}
                );
            }
            const token = jwt.sign({email : userStore.email, id : userStore._id}, 
                process.env.JWT_KEY,
                {
                    expiresIn : "1h"
                });
                console.log(token);
            response.status(200).json({
                message : "Valid user authenticated",
                token : token,
                timeoutTimer : 3600,
                userID : userStore._id
            });
        }
    )
    .catch(error => {
        console.log(error);
        response.status(401).json(
            {message: "authentication denied"}
        );
    })
}