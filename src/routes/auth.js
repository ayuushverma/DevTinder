const {validateSignUpData} = require("../utils/signupDataValidation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.models.js");
const express = require ("express")
const authRouter  = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async(req,res)=>{
    try {
 
     //validation of data
 
     validateSignUpData(req);
 
     //encrypt password
     const{userName, password, emailId}=req.body
     const hashPassword = await bcrypt.hash(password,10)
 
     const user=new User({
         userName,
         password:hashPassword,
         emailId
         
     })
     await user.save()
    res.send("data added succesfully")
    } catch (error) {
     res.status(404).send("Error : "+error.message);
    }
 
 console.log(req.body);
 
 
});

authRouter.post("/login", async(req,res)=>{
    try{
        const{password, emailId} = req.body;
        const user = await User.findOne({emailId:emailId});
        
        if(!user){
            throw new Error("user Email ID does not exist");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect){
            //create a jwt token
            const token = await jwt.sign({_id:user._id}, "DEV@Tinder$790"); 
            res.cookie("token", token, {
                expires:new Date(Date.now()+8*3600000)
            }); 
            res.send("login succesfull");
        }
        else{
           throw new Error("Invalid password")
        }


    }catch(error){
        res.status(400).send("Invalid Credentials : " + error.message)
    }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("user logout");
})

module.exports = authRouter;