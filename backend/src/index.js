import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import router from "./routes/experience.route.js";
import Bookingroute from "./routes/booking.route.js";
import path from "path";
import { fileURLToPath } from 'url'; 

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

connectDB().then(() => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);
  app.use("/api", Bookingroute);

  // Serve the static React build
  app.use(express.static(path.join(__dirname, '..', "client", 'dist')));

  // --- THIS IS THE FIX ---
  // Catch-all: send index.html for React Router
  // It must be '/*' not just '*'
  // app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Handle SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});
});