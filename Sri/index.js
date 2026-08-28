import connectDB from "./db/index.js";
import express from "express";
const app = express();
connectDB().then(()=>{
     app.on("error", (error) => {
      console.log("Express error:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
}).catch((err)=>{
  console.log("MongoDB Connect Falied : " ,err)
})