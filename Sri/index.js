import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Express error:", error);
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed:", err);
  });