const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true,
        minLength:3,
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    }
},{
    timestamps:true
});
const User = mongoose.model("User",userSchema);
module.exports = User