const express = require("express");
const User = require("./models/user.models.js");

const connectDB=require("./config/connectDB.js");
const app = express();
connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("server is listening at port 7777")
    })
})
app.use(express.json());

app.post("/signup",async (req,res)=>{
   try {
    const user=new User(req.body)
   await user.save()
   res.send("data added succesfully")
   } catch (error) {
    res.status(404).send("Something went wrong"+error);
   }

console.log(req.body);


})
app.get("/feed", async(req,res)=>{
    const userEmail = req.body.emailID
    try {
        const user = await User.find({email:userEmail})
        res.send(user);

        
    } catch (error) {
        res.status(404).send("Somethig went wrong");
    }
})


