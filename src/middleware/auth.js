const jwt = require("jsonwebtoken");
const User = require("../models/user.models")

const userAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error("token in invalid !!!!");
        }
        const decodedObj = await jwt.verify(token,"DEV@Tinder$790");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user
        next();
    } catch (error) {
        res.status(400).send("ERROR : "+ error.message)
    }
}
module.exports = {userAuth}