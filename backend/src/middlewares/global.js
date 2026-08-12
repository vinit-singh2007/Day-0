import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const configureMiddleware = (app) => {
 
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};