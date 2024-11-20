const validator = require("validator");
const validateSignUpData=(req)=>{
    const {userName, emailId, password} = req.body
    if(!userName || !emailId){
        throw new Error("details can not be empty");
    }
    else if(userName.length<4){
        throw new Error("username cant be smaller")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("incorrect email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong");
    }
}
module.exports={validateSignUpData,}

