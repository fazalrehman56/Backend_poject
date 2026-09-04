import asyncHandler from "../utilities/asynchandler.js";

const registerUsers = asyncHandler(async(req,res)=>{
     // take user details from frontend
     // validation - no empty
     //check if user already exsit
     //check for img & avator
     //upload them to cloudinary
     //create user object & create entry in data base
     // remove password and refresh token 
     // return repsonse
     const {fullName,email,userName,Password} = req.body()
     console.log("emial is ",email)
     })
export  default registerUsers;