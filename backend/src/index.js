import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import router from "./routes/experience.route.js";

dotenv.config();
const app = express();

connectDB().then(() => {
  app.use(cors());
  app.use(express.json()); // ✅ enable JSON body parsing
  app.use(express.urlencoded({ extended: true }));

  // ✅ move your routes here
  app.use("/api", router);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
