import Experiences from "../models/experience.model.js";
export const addExperince = async (req, res) => {
  try {
    console.log(req)
    console.log(req.body)
    const {id,title,location,description,price,imageUrl,availableDates,availableTimes,about}=req.body
    const Experience = await Experiences.create({_id,id,title,location,description,price,imageUrl,availableDates,availableTimes,about});

    res.status(201).json({ success: true, data: Experience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExperince_detail = async (req,res)=>{

    try {
        const {id}=req.body

        const experience_data = await Experiences.findById({_id:id})
        res.status(201).json({ success: true, data: experience_data });

        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export const getExperince = async (req,res)=>{
    try {

        const experience_data = await Experiences.find({}).select("_id title location description price imageUrl")
        res.status(201).json({ success: true, data: experience_data });


        
    } catch (error) {

        res.status(400).json({ success: false, message: error.message });
    }
}
