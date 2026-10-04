import asyncHandler from "../utilities/asynchandler.js";
import  ApiError from "../utilities/apierrors.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utilities/cloudinary.js";
import { ApiResponse } from "../utilities/ResponseApi.js";
const generateAccessAndRefresgToken = async (user_id)=>{
  try{
     const user =  await User.findById(user_id)
     const accessToken =  user.generatorAccessToken
     const refreshToken = user.generatorRefreshToken
     //now we have to add refesh token on that user , add refresh token to db
     user.refresh_Token = refreshToken
     user.save({validateBeforeSave : flase}) // jab ham user save ya modify krty to jo requried filed hoty wo triger ho jati
  }
  catch(error){
throw new ApiError(500, "something went worng will generating access token and refresh token ")
  }
}
const registerUsers = asyncHandler(async(req,res)=>{
     // take user details from frontend
     // validation - no empty
     //check if user already exsit
     //check for img & avator
     //upload them to cloudinary
     //create user object & create entry in data base
     // remove password and refresh token 
     // return repsonse
     // cont a,b,c = 10
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
     console.log(req.files)
     const localCoverImgPath= req.files?.coverImg[0].path

     if(!localAvatorPath){
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
     //user field mae sy password and refresh_Token hta do
    const createdUser = await User.findById(user._id).select(
    "-Password -refresh_Token"
)
     if(!createdUser){
          throw new ApiError(500,"something went worng while register the user")
     }
   res.status(201).json(
     new ApiResponse(200,createdUser,"user register successfully")
   )
     })

     const loginUser = asyncHandler(async(req,res)=>{

          const {fullName,email,userName,Password} = req.body
          if(!userName || !email){
            throw new ApiError(400,"UserName or Email field requried")
          }
          const user = await User.findById({
               $or:[{userName},{email}]
          })
          if(!user){
               throw new ApiError(400,"THE User dosn't Exist BROOO")
          }
          const isPasswordValid = await user.isPasswordCorrect(Password);
          if(!isPasswordValid){
               throw new ApiError(401,"Password is not valid")
          }

      })
export  default registerUsers;