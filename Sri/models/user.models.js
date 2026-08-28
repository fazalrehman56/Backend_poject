import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
     userName:{
        type:String,
        required : true,
        lowercase :true,
        unique : true,
     },
     email:{
        type:String,
        required : true,
        lowercase :true,
        unique : true,
     },
     fullName:{
        type:String,
        required : true,
        lowercase :true,
     },
     avator:{
        type : String, // from aws kin services
        required : true,
     },
      coverImg:{
        type : String, // from aws kin services
        required : true,
     },
     password:{
        type : String, 
        required : true,
        required :[true,"password field is required !"]
     }
   },{timestamps:true})

const User = mongoose.model("User",userSchema)