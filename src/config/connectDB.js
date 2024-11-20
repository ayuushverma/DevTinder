const mongoose= require("mongoose");

const connectDB = async ()=>{
        try {
            await mongoose.connect("mongodb+srv://ayushverma2112004:xfif2Zv3S55tkzZa@cluster0.w2xam.mongodb.net/DevTinder")
            console.log("database connected successfully");
        }
        catch (error) {
            console.log("An ERROR !! Ocuured",error);
        }

}
module.exports=connectDB