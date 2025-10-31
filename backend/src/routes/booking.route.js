import { createBooking } from "../controllers/booking.controller.js"; 
import express from "express"
const Bookingroute = express.Router()
Bookingroute.post('/booking',createBooking)
export default Bookingroute
