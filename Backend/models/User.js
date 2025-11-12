import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email_id:{type:String,required:true,unique:true},
        wallet_address:{type:String,sparse:true,unique:true},
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
    },{timestamps:true}
)

export default mongoose.model("User",UserSchema)

