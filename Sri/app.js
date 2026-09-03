import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

// 1. Fixed CORS spelling and variable name
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);



// Cookie parser MUST come before routes
app.use(cookieParser());

//  Routes
import router from "./routes/user.routes.js";
app.use("/api/v1/user", router);

export { app };