import asyncHandler from "../utilities/asynchandler.js";
import  ApiError from "../utilities/apierrors.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utilities/cloudinary.js";
import { ApiResponse } from "../utilities/ResponseApi.js";
const registerUsers = asyncHandler(async(req,res)=>{
     // take user details from frontend
     // validation - no empty
     //check if user already exsit
     //check for img & avator
     //upload them to cloudinary
     //create user object & create entry in data base
     // remove password and refresh token 
     // return repsonse
     const {fullName,email,userName,Password} = req.body
     console.log("email is ",email)
     
     if([fullName,email,userName,Password].some((fileds)=>
      fileds?.trim()===""
     )){
          throw new ApiError(501,"All Fields are requird")
     }

     const existedUSer = await User.findOne({
          $or :[{userName},{email}]
     })
     if(existedUSer){
          throw new ApiError(400,"THE User is Already Exist BROOO")
     }
     const localAvatorPath= req.files?.avator[0]
     const localCoverImgPath= req.files?.avator[0]

     if(localAvatorPath){
          throw new ApiError(500,"avator field requird")
     }
     const avator = await uploadCloudinary(localAvatorPath)
     const CoverImg = await uploadCloudinary(localCoverImgPath)

     if(!avator){
            throw new ApiError(500,"avator field requird")
     }
    const user = await User.create({
          userName,
          fullName,
          Password,
          email,
          avator : avator.url,
          coverImg : CoverImg.url

     })
     const createdUser = user.findbyId(user._id).select(
          "-password -refresh_Token"
     )
     if(!createdUser){
          throw new ApiError(500,"something went worng while register the user")
     }
   res.status(201).json(
     new ApiResponse(200,createdUser,"user register successfully")
   )
     })
export  default registerUsers;