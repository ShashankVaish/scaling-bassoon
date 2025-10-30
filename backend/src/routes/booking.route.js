import { createBooking } from "../controllers/booking.controller.js"; 
import express from "express"
const Bookingroute = express.Router()
Bookingroute('/booking',createBooking)
export default Bookingroute
