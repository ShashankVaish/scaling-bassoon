import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import router from "./routes/experience.route.js";
import Bookingroute from "./routes/booking.route.js"
dotenv.config();
const app = express();

connectDB().then(() => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  app.use("/api", router);
  app.use("/api",Bookingroute);


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
