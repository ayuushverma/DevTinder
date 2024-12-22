const express = require("express")
const cookieParser = require("cookie-parser");
const connectDB=require("./config/connectDB.js");
const app = express();

app.use(express.json());
app.use(cookieParser());
connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("server is listening at port 7777")
    })
}).catch((err)=>{
    console.error("database cannot be connected")
})

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)






