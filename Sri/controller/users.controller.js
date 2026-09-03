import asyncHandler from "../utilities/asynchandler.js";

const registerUsers = asyncHandler(async(req,res)=>{
    res.status(200).json({
      message:"ok doke"
    })
})
export  default registerUsers;