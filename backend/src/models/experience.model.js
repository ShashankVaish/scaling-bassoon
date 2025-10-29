import mongoose from "mongoose";

const experiencesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: "https://placehold.co/400x300/cccccc/white?text=Activity",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Experiences = mongoose.model("Experiences", experiencesSchema);

export default Experiences;
