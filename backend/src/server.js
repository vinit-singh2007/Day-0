import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/Mongodb_connect.js";
import authRoutes from "./routes/user.js"
import User from './models/user.js';
import { configureMiddleware } from "./middlewares/global.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT||5000;

connectDB();

configureMiddleware(app);

app.use("/api",authRoutes)

app.get('/', (req, res) => {
  res.json({ 
  "status":"server is working properly"
  });
});
app.listen(PORT, () => {
  console.log(`Server safely blasting off at http://localhost:${PORT}`);
});