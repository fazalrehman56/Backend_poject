import dotenv from "dotenv";
dotenv.config();
dotenv.config();
console.log("DATABASE_URI:", process.env.DATABASE_URI);
console.log("PORT:", process.env.PORT);

import mongoose from "mongoose";
import express from "express";
import  {DB_NAME}  from "../constants.js"; // verify filename/spelling

const app = express();

const connectDB = async () => {
  try {
    const database = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
    console.log(`Database connected. Host: ${database.connection.host}`);

    app.on("error", (error) => {
      console.log("Express error:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("DB connection error:", error);
  }
};

export default connectDB;