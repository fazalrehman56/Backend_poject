import asyncHandler from "../utilities/asynchandler.js";
import { ApiError } from "../utilities/apierrors.js";
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
     if([fullName,email,userName,Password].some((fileds)=> 
      fileds?.trim()===""
    )){
       new ApiError(300,"all fields are required")
    }

     




     })
export  default registerUsers;