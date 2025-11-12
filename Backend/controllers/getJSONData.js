import axios from "axios";
import User from "../models/User.js";
import { error } from "pdf-lib";

export const getJSONData = async (req, res, next) => {
    const jsonCID = req.params.jsonCID;
    const endpointUrl = `https://gateway.pinata.cloud/ipfs/${jsonCID}`;

    axios
        .get(endpointUrl)
        .then((response) => {
            console.log(response.data); // Certificate data
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
};


export const mapEmail=async (req,res)=>{
    const {email} =req.body
    if(!email){
        return res.status(202).json({
        message: "Enter Email",
        wallet_address: null,
      });
    }

    try {
        const user=await User.findOne({"email_id":email}).lean()
        if(!user){
            return res.status(400).json({message:"No email found", wallet_address: null,})
        }
        if(!user.wallet_address){
             return res.status(202).json({
             message: "User found but wallet not yet generated",
             wallet_address: null,
         });
        }
        const wallAdd=user.wallet_address
        return res.status(200).json({wallAdd:wallAdd})
    } catch (error) {
        console.log("Error:",error)
        return res.status(500).json({ message: "Server error in mapping email", error: error.message });
    }
}

export const addAddress=async (req,res)=>{
    const {email,address}=req.body
     if(!email || !address){
        return res.status(202).json({
        message: "Enter Email",
        wallet_address: null,
      });
     }
    try {
        const user = await User.findOne({"email_id":email})
        if(user && user.wallet_address){
            return res.status(200).json({message:"Aldready set!"})
        }
        if(!user){
            const newUser = await new User({"email_id":email,"wallet_address":address,"role":"user"}).save()
            return res.status(200).json({message:"Added to Database!"})
            
        }
        user.wallet_address = address;
        await user.save();
    } catch (error) {
         console.log("Error:",error)
        return res.status(500).json({ message: "Server error in adding user", error: error.message });
    }
}