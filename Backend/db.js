import mongoose from "mongoose";

export const ConnectDB=async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/kol")
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
        console.log("Could not Connect to DB")
    }
}