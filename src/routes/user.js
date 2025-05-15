const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const User = require("../models/user.models");
const ConnectionRequest = require("../models/connectionRequest.model")

userRouter.get("/user/requests/received",userAuth, async(req, res)=>{
    try {
        loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", "userName photoUrl gender about skills");
        res.json({
            message:"data fetched succesfully",
            data:connectionRequest
        })

    } catch (error) {
        res.status(400).json({
            message:"ERROR! : " + error.message
        })
    }
})

userRouter.get("/user/connnection", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
        $or:[{
            toUserId:loggedInUser._id,status:"accepted"
        },{
            fromUserId:loggedInUser._id,status:"accepted"
        }]
    }).populate("fromUserId","userName age skill gender  photoUrl about").populate("toUserId","userName age skill gender  photoUrl about")
    const data = (await connectionRequest).map((row)=>{
        if(row.fromUserId.toString()==loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    })
    res.json({data})
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})

userRouter.get("/user/feed", userAuth, async(req, res)=>{
    try{
        let limit = parseInt(req.query.limit) || 10
        limit = limit>50?50:limit;
        const skip = (page-1 )*limit
        const page = parseInt(req.query.page) || 1;
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
    }).select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
        hiddenUsersFromFeed.add(req.fromUserId.toString());
        hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
        $and:[{_id:{$nin:Array.from(hiddenUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
        ]
    }).select("userName age skill gender  photoUrl about").skip(skip).limit(limit)

    res.send(users)
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})

module.exports = userRouter;