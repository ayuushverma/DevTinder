const express = require("express")
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",async(req,res)=>{
    const user = req.body;
    console.log("sending a connection request");
    res.send(user.userName + " sent the connection request!");

});

module.exports = requestRouter;