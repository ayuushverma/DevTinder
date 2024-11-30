const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth.js")
const connectionRequest = require("../models/connectionRequest.model.js");
const ConnectionRequest = require("../models/connectionRequest.model.js");
requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save()

        res.json({
            message:"connection request sebd succesfully",
            data
        })
    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
    }

});

module.exports = requestRouter;