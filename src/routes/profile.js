const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const { validateSignUpData, validateEditProfileData } = require("../utils/signupDataValidation");
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile/view",userAuth, async (req, res)=>{
    // const cookies = req.cookies
    // const {token} = cookies;
    
    // //valdation of token
    // const validateToken = await jwt.verify(token,"DEV@Tinder$790")
    // const {_id} = validateToken
    // console.log(cookies)
    const user = req.user
    res.send(user)
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("invalid update request")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key]=req.body[key]))
        await loggedInUser.save()
        res.json({message:`${loggedInUser.userName}, just updated the profile`,
            data:loggedInUser
        });

    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
    }
})
module.exports = profileRouter; 