import mongoose from "mongoose";
import bcrypt from "bcrypt"
//import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken"; // ✅ default import, use as jwt.sign(...)
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
     },
    refresh_Token: {
          type : String
     }
   },{timestamps:true})


 userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
 })
 userSchema.methods.generatorAccessToken = function(){
   const Token = jwt.sign({
      _id:this.id,
      email : this.email,//this means we accses our value uper ke
      username :this.userName,
      fullname : this.fullName

   },
   process.env.ACCESS_TOKEN_SECRATE,
   {expireIn : ACCESS_TOKEN_EXPIRE}
  )
 }
 userSchema.methods.generatorRefreshToken = function(){
   const tokenRef = jwt.sign({
      _id:this.id,

   },
   process.env.REFRESH_TOKEN_SECRATE,
   {expiresIn : REFRESH_TOKEN_EXPIRE}
  )
 }
   
export const User = mongoose.model("User",userSchema)


