const mongoose = require("mongoose");
const validator = require("validator")
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
    },
    photUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo Url "+value )
            }
        }
    },
    about:{
        type:String,
        default:"This is my about section"
    },
    skills:{
        type:[String]
    },
    gender:{
        type:String,
        enum:["male","female","others"]
    },
    age:{
        type:Number
    }
},{
    timestamps:true
});
const User = mongoose.model("User",userSchema);
module.exports = User