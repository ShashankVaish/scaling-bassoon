import Experiences from "../models/experience.model.js";
export const addExperince = async (req, res) => {
  try {
    console.log(req)
    console.log(req.body)
    const {title,location,description,price,imageurl}=req.body
    const Experience = await Experiences.create({title,location,description,price,imageurl});
    res.status(201).json({ success: true, data: Experience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

