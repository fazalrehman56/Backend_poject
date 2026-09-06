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
     console.log("req.body",req.body)
     
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
     const localAvatorPath= req.files?.avatar[0].path;
     console.log(req.file)
     const localCoverImgPath= req.files?.coverImg[0].path

     if(localAvatorPath){
          throw new ApiError(500,"avator field requird")
     }
     const avatar = await uploadCloudinary(localAvatorPath)
     const CoverImg = await uploadCloudinary(localCoverImgPath)

     if(!avatar){
            throw new ApiError(500,"avator field requird")
     }
    const user = await User.create({
          userName,
          fullName,
          Password,
          email,
          avatar : avatar.url,
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