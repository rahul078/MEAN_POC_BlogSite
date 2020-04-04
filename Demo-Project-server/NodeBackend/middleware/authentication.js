const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    try{
        const token = request.headers.authorization;
        console.log(token);
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
        request.userData = {email : decodedToken.email, id : decodedToken.id};
        next();
    }catch(error){
        console.log(error);
        response.status(401).json({
            message : "You are not authenticated"
        });
    };
}