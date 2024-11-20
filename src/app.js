const express = require("express");
const User = require("./models/user.models.js");
const {validateSignUpData} = require("./utils/signupDataValidation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB=require("./config/connectDB.js");
const app = express();
connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("server is listening at port 7777")
    })
})
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
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


})
app.get("/user", async(req,res)=>{
    const name = req.body.userName
    try {
        const user = await User.find({userName:name})
        if(user.length===0){
            res.status(404).send("User not found")
        }else{
        res.send(user);
        }
        
    } catch (error) {
        res.status(404).send("Somethig went wrong");
    }
})

app.post("/login", async(req,res)=>{
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
            res.cookie("token", token); 
            res.send("login succesfull");
        }
        else{
           throw new Error("Invalid password")
        }


    }catch(error){
        res.status(400).send("Invalid Credentials : " + error.message)
    }
});

app.get("/feed", async(req,res)=>{
    try {
        const users = await User.find({})
        if(users.length===0){ 
            res.status(404).send("User not found")
        }else{
        res.send(users);
        }
        
    } catch (error) {
        res.status(404).send("Somethig went wrong");
    }
})
app.get("/profile", async (req, res)=>{
    const cookies = req.cookies
    const {token} = cookies;
    
    //valdation of cookie
    const validateToken = await jwt.verify(token,"DEV@Tinder$790")
    const {_id} = validateToken
    console.log(cookies)
    res.send("reading cookie")
})

