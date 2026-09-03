import dotenv from "dotenv";
dotenv.config();
dotenv.config();
console.log("DATABASE_URI:", process.env.DATABASE_URI);
console.log("PORT:", process.env.PORT);

import mongoose from "mongoose";

import  {DB_NAME}  from "../constants.js"; // verify filename/spelling



const connectDB = async () => {
  try {
    const database = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
    console.log(`Database connected. Host: ${database.connection.host}`);

   
  } catch (error) {
    console.log("DB connection error:", error);
  }
};

export default connectDB;