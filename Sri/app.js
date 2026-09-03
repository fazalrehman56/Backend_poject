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

//  Parsers & Static Files
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // added extended: true
app.use(express.static("public"));

// Cookie parser MUST come before routes
app.use(cookieParser());

//  Routes
import router from "./routes/user.routes.js";
app.use("/api/v1/user", router);

export default app;