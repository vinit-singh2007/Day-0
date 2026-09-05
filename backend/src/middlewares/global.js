import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const configureMiddleware = (app) => {
 
const allowedOrigins = [
  "http://localhost:5173",
  "https://day-0-delta.vercel.app",
  "https://day-0-njhqil2aa-axe-vin.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};