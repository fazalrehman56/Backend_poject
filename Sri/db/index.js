import dotenv from "dotenv";
dotenv.config();//dotenv.config() reads your project's .env file and loads your hidden variables (like DATABASE_URI and PORT) into process.env
// console.log("DATABASE_URI:", process.env.DATABASE_URI);
// console.log("PORT:", process.env.PORT); //PORT values to the terminal so you can verify that Node.js successfully read them from your .env file

import mongoose from "mongoose";
import  {DB_NAME}  from "../constants.js"; // verify filename/spelling



const connectDB = async () => {
  try {
    const database = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
    console.log(`Database connected. Host: .....`);

   
  } catch (error) {
    console.log("DB connection error:", error);
  }
};

export default connectDB;