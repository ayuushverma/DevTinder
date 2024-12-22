const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["interested", "accepted", "ignored", "pending"],
            message:`{VALUE} is incorrect status type`
        }
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest