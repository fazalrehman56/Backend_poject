import asyncHandler from "../utilities/asynchandler.js";
import ApiError from "../utilities/apierrors.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utilities/cloudinary.js";
import { ApiResponse } from "../utilities/ResponseApi.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const generateAccessAndRefresgToken = async (user_id) => {
     try {

          const user = await User.findById(user_id)
          const accessToken = user.generatorAccessToken()
          const refreshToken = user.generatorRefreshToken()
          user.refresh_Token = refreshToken
          await user.save({ validateBeforeSave: false })

          return { accessToken, refreshToken }
          console.log("ENV CHECK:", {
               accessExpire: process.env.ACCESS_TOKEN_EXPIRE,
               refreshExpire: process.env.REFRESH_TOKEN_EXPIRE,
               accessSecretSet: !!process.env.ACCESS_TOKEN_SECRATE,
               refreshSecretSet: !!process.env.REFRESH_TOKEN_SECRATE,
          })
     } catch (error) {
          console.log(error) // so you can see the real error in the terminal
          throw new ApiError(500, error.message)
     }
}
const registerUsers = asyncHandler(async (req, res) => {
     // take user details from frontend
     // validation - no empty
     //check if user already exsit
     //check for img & avator
     //upload them to cloudinary
     //create user object & create entry in data base
     // remove password and refresh token 
     // return repsonse
     // cont a,b,c = 10
     const { fullName, email, userName, Password } = req.body
     console.log("email is ", email)
     console.log("req.body", req.body)

     if ([fullName, email, userName, Password].some((fileds) =>
          fileds?.trim() === ""
     )) {
          throw new ApiError(501, "All Fields are requird")
     }

     const existedUSer = await User.findOne({
          $or: [{ userName }, { email }]
     })
     if (existedUSer) {
          throw new ApiError(400, "THE User is Already Exist BROOO")
     }
     const localAvatorPath = req.files?.avatar[0].path;
     console.log(req.files)
     const localCoverImgPath = req.files?.coverImg[0].path

     if (!localAvatorPath) {
          throw new ApiError(500, "avator field requird")
     }
     const avatar = await uploadCloudinary(localAvatorPath)
     const CoverImg = await uploadCloudinary(localCoverImgPath)

     if (!avatar) {
          throw new ApiError(500, "avator field requird")
     }
     const user = await User.create({
          userName,
          fullName,
          Password,
          email,
          avatar: avatar.url,
          coverImg: CoverImg.url

     })
     //user field mae sy password and refresh_Token hta do
     const createdUser = await User.findById(user._id).select(
          "-Password -refresh_Token"
     )
     if (!createdUser) {
          throw new ApiError(500, "something went worng while register the user")
     }
     res.status(201).json(
          new ApiResponse(200, createdUser, "user register successfully")
     )
})

const loginUser = asyncHandler(async (req, res) => {
     const { email, userName, Password } = req.body

     if (!userName && !email) {
          throw new ApiError(400, "UserName or Email field required")
     }

     const user = await User.findOne({ $or: [{ userName }, { email }] })
     if (!user) {
          throw new ApiError(404, "User doesn't exist")
     }

     const isPasswordValid = await user.isPasswordCorrect(Password)
     if (!isPasswordValid) {
          throw new ApiError(401, "Password is not valid")
     }

     const { accessToken, refreshToken } = await generateAccessAndRefresgToken(user._id)

     const loggedin = await User.findById(user._id).select("-Password -refresh_Token")

     const option = { httpOnly: true, secure: true }

     return res
          .status(200)
          .cookie("accessToken", accessToken, option)
          .cookie("refreshToken", refreshToken, option)
          .json(new ApiResponse(200, { user: loggedin, accessToken, refreshToken }, "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
     await User.findByIdAndUpdate(
          req.user._id,
          { $set: { refresh_Token: undefined } },
          { new: true }
     );

     const option = { httpOnly: true, secure: true };

     return res
          .status(200)
          .clearCookie("accessToken", option)
          .clearCookie("refreshToken", option)
          .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const RefreshAccessToken = asyncHandler(async (req, res) => {
     try {
          const IncommingAccessToken = req.cookies.refreshToken ||
               req.body.refreshToken

          if (!IncommingAccessToken) {
               throw new ApiError(401, "UnAuthraized Person!")
          }
          const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRATE);
          const user = await User.findById(decodedToken._id)

          if (!user) {
               throw new ApiError(401, "invalid Refresh token")
          }
          if (IncommingAccessToken !== user.refresh_Token) {
               throw new ApiError(401, "Refresh Token is expired or Used")
          }
          const { AccessToken, newRefreshToken } = await generateAccessAndRefresgToken(user._id)

          const option = { httpOnly: true, secure: true };

          return res
               .status(200)
               .clearCookie("accessToken", AccessToken, option)
               .clearCookie("refreshToken", newRefreshToken, option)
               .json(new ApiResponse(200, { AccessToken, refreshToken: newRefreshToken }, "Access Token Refreshed"));

     }
     catch (error) {
          throw new ApiError("something went worng")
     }
})
const changeUserPassword = asyncHandler(async (req, res) => {
     const { oldPassword, NewPassword } = req.body
     const user = await findById(req.user._id)
     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

     if (!isPasswordCorrect) {
          throw new ApiError(400, "invalid old password")
     }
     user.Password = isPasswordCorrect
     await user.save({ validateBeforeSave: false })
     return res.status(200)
          .json(200, {}, "Password updated Successfully");

})
const getCurrentUser = asyncHandler(async (req, res) => {
     return res.status(200)
          .json(new ApiResponse(200, req.user, "Current user fatched Successfully"))
})
const upadateUserDetails = asyncHandler(async (req, res) => {
     const { fullName, email } = req.body
     if (!fullName || !email) {
          throw new ApiError(400, "All fields are required")
     }
     const user = await findByIdAndUpdate(
          req.user._id,
          {
               fullName,
               email
          },
          { new: true }
     ).select("-Password")
     return res.status(200)
          .json(new ApiResponse(200, user, "User's Account details Updated/changed"))
})
const changeAvator = asyncHandler(async (req, res) => {
     const avatorLocalPath = req.file.path
     if (!avatorLocalPath) {
          throw new ApiError(400, "All fields are required")
     }
     const avator = await uploadCloudinary(avatorLocalPath)
     if (!avator.url) {
          throw new ApiError(400, "error while uplaoding file to cloudniary")
     }

     const user = await findByIdAndUpdate(
          req.user._id,
          {
               avatar: avator.url
          },
          { new: true }
     ).select("-Password")
     return res.status(200)
          .json(new ApiResponse(200, user, "User's Account details Updated/changed"))
})
const changeCoverImg = asyncHandler(async (req, res) => {
     const coverImgLocalPath = req.file.path
     if (!coverImgLocalPath) {
          throw new ApiError(400, "All fields are required")
     }
     const coverImg = await uploadCloudinary(coverImgLocalPath)
     if (!coverImg.url) {
          throw new ApiError(400, "error while uplaoding file to cloudniary")
     }

     const user = await findByIdAndUpdate(
          req.user._id,
          {
               coverImg: coverImg.url
          },
          { new: true }
     ).select("-Password")
     return res.status(200)
          .json(new ApiResponse(200, user, "User's Account details Updated/changed"))
})
const getUserChannelProfile = asyncHandler(async (req, res) => {
     const { userName } = req.params
     if (!userName.trim()) {
          throw new ApiError(400, "Username is missing")
     }
     const channel = await User.aggregate([
          {
               $match: {
                    userName: userName?.toLowerCase()
               }

          },
          {
               $lookup: {
                    from: "Subscription", //total subscriber
                    localField: "_id",
                    foreignField: "Channel",
                    as: "subcribers"
               },


          },
          {
               $lookup: {
                    from: "Subscription", // subscribed to
                    localField: "_id",
                    foreignField: "Subscriber",
                    as: "subcribedTo"
               },
          },
          {
               $addFields: {
                    TotalSubscribers: {
                         $size: "$subcribers"

                    },
                    TotalSubscribedTo: {
                         $size: "$subcribedTo"

                    },

                    isSubscribedCount: {
                         $cond: {
                              if: { $in: [req.user._id, "$subcribers.Subscriber"] },
                              then: true,
                              else: false
                         }
                    }

               }
          },
          {
               $project: {
                    userName: 1,
                    fullName: 1,
                    email: 1,
                    coverImg: 1,
                    avatar: 1,
                    TotalSubscribers: 1,
                    TotalSubscribedTo: 1,
                    isSubscribedCount: 1

               }
          }

     ])
     return res.status(200)
          .json(new ApiResponse(200, { channel }, "User channel fatched successfully"))
})
const getUserWatchedHistory = asyncHandler(async (req, res) => {
     const user = await User.aggregate([
          {
               $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
               }
          },
          {
               $lookup: {
                    from: "Video",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory", // yaha tak all videos docuumnet mil gaye Ab hamy owner ki details m jana han 
                    pipeline: [{ // pipe line lga k wapis user m gaye owner m jo user ki id thi usky through 
                         $lookup: { 
                              from: "User",
                              localField: "owner",
                              foreignField: "_id",
                              as: "owner", // hamy us user k sab kuch mil gya password tak bhi 
                              pipeline: [{
                                   $project: { // but hamy yaha p ab just user k ye 3 cheezy chaye 
                                        userName: 1,
                                        fullName: 1,
                                        avatar: 1,
                                   }
                              }]


                         },
                         $addFields:{
                              owner:{
                                   $first:"$owner" // first value of owner arry ke need nhi wasy aeey first lemnyt bhi kr skty thy , to ab reult m arry nhi ayega
                              }
                         }
                    }
                    ]
               }
          }
     ])
     return res.status(200)
     .json(new ApiResponse(200,user[0].watchHistory,"User's Watched History fetched successfully"))
})

export {
     registerUsers,
     loginUser,
     logoutUser,
     RefreshAccessToken,
     changeUserPassword,
     getCurrentUser,
     upadateUserDetails,
     changeAvator,
     changeCoverImg
};
