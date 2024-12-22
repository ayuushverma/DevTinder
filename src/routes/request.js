const express = require("express")
const User = require("../models/user.models.js")
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth.js")
const ConnectionRequest = require("../models/connectionRequest.model.js");
const { connection } = require("mongoose");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status;

        
        const toUser = await User.findById({_id:toUserId});
        if(!toUser){
            return res.status(400).json({
                message:"INVALID ! :: user doesn't exist"
            })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId },
                {fromUserId:toUserId, toUserId:fromUserId}
            ],
        });
        
        if(existingConnectionRequest){
            return res.status(400).json({
                message:"connection request is invalid : already exists",
            })
        }

        if(toUserId==fromUserId){
            return res.status(400).json({
                message:"INVALID!! :: Can't send connection request to itself"
            })
        }

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"invalid status type "+status
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        

        const data = await connectionRequest.save()

        res.json({
            message:"connection request send succesfully " + `${req.user.userName} send connection request to ${toUser.userName}` ,
            data:connectionRequest
        })
    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
    }

});

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req, res)=>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({message:"Invalid connection request type "+status+ " is invalid"})
    }
    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    });

    console.log(connectionRequest)

        if(!connectionRequest){
            return res.status(404).json({message:" connection request not found"})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()
        res.json({
            message:`connection request is ${status}`,
            data
        });
    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
    }

})



module.exports = requestRouter;