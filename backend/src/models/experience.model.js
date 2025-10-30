import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    id:{
        type:Number,
        unique:true,
        required:true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    availableDates: [
      {
        type: Date,
      },
    ],
    availableTimes: [
      {
        time: { type: String },
        slotsLeft: { type: Number, default: 0 },
        soldOut: { type: Boolean, default: false },
      },
    ],
    about: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;