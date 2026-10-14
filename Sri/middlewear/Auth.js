import { User } from "../models/user.models";
import ApiError from "../utilities/apierrors";
import asyncHandler from "../utilities/asynchandler";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.models";

export const jwtVerify = asyncHandler(async(req,res,next)=>{
 try {
     const token =  req.cookie.accsessToken || req.header("Authorization")?.replace("Bearer","")
     if(!token){
       throw new ApiError("unauthorized request")
     }
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRATE)
     const user = await User.findById(decodedToken._id).select("-Password -refresh_Token" )
     req.user = user
     next()
 } catch (error) {
    throw new ApiError("error :",error)
 }


})