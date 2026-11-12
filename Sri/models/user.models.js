import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
//import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken"; // ✅ default import, use as jwt.sign(...)
const userSchema = new mongoose.Schema(
   {

      userName: {
         type: String,
         required: true,
         lowercase: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         lowercase: true,
         unique: true,
      },
      fullName: {
         type: String,
         required: true,
         lowercase: true,
      },
      avatar: {
         type: String, // from aws kin services
         required: true,
      },
      coverImg: {
         type: String, // from aws kin services
         required: true,
      },
      watchHistory: [
         {
            type: Schema.Types.ObjectId,
            ref: "Video"
         }
      ],

      Password: {
         type: String,
         required: true,
         required: [true, "password field is required !"]
      },
      refresh_Token: {
         type: String
      }
   }, { timestamps: true })


userSchema.pre("save", async function () {
   if (!this.isModified("Password")) return
   this.Password = await bcrypt.hash(this.Password, 10);

})
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.Password)
}
userSchema.methods.generatorAccessToken = function () {
   const token = jwt.sign(
      {    // jab ham refresh and acees token banaty controler m to usky parameters mae jo id hoti wo ismy dal deta is waja sy ham id lay lety us user ke
         _id: this._id,
         email: this.email,
         username: this.userName,
         fullname: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRATE,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
   )
   return token   // ✅
}

userSchema.methods.generatorRefreshToken = function () {
   const token = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRATE,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
   )
   return token   // ✅
}

export const User = mongoose.model("User", userSchema)


