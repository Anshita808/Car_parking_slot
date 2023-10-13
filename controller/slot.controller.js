const { rateLimit } = require("../middleware/ratelimiter");
const { SlotModel } = require("../models/carslot.model");

const bookSlot = async (req, res) => {
  try {
    const { carNumber, slotNumber } = req.body;

    // Check if parking lot is full
    const totalSlots = parseInt(process.env.PARKING_LOT_SIZE);
    const occupiedSlots = await SlotModel.countDocuments({
      carNumber: { $ne: null },
    });

    if (occupiedSlots == totalSlots) {
      return res.status(400).json({ message: "Parking lot is full." });
    }
    // Find an available slot that has not been booked
    const availableSlot = await SlotModel.findOne({ carNumber: null });
 if (!availableSlot) {
   if (occupiedSlots < totalSlots) {
     const slotNumber = occupiedSlots + 1; // Assign the next available slot number
     const newSlot = new SlotModel({
       carNumber,
       slotNumber,
       ipAddress: req.ip,
     });
     await newSlot.save();
     return res.json({
       message: "Car parked successfully",
       slotNumber: newSlot.slotNumber,
     });
   }
   return res.status(400).json({ message: "No available slots." });
 }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unparkSlot = async(req,res) =>{
try {
  const { slotNumber } = req.body;

  // Find the slot to unpark
  const slot = await SlotModel.findOne({
    slotNumber,
    carNumber: { $ne: null },
  });

  if (!slot) {
    return res
      .status(400)
      .json({ message: "Invalid slot or the slot is empty." });
  }

  // Unpark the car
  slot.carNumber = null;
  slot.ipAddress = null;
  await slot.save();

  return res.json({ message: "Car unparked successfully" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

const slotInfo = async(req,res) =>{
     try {
       const { slotNumber, carNumber } = req.query;

       if (!slotNumber && !carNumber) {
         return res
           .status(400)
           .json({ message: "Provide a slotNumber or carNumber" });
       }

       let query = {};

       if (slotNumber) {
         query = { slotNumber, carNumber: { $ne: null } };
       } else if (carNumber) {
         query = { carNumber };
       }

       const slot = await SlotModel.findOne(query);

       if (!slot) {
         return res.status(404).json({ message: "No information found." });
       }

       return res.json({
         slotNumber: slot.slotNumber,
         carNumber: slot.carNumber,
       });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
}


module.exports = {
    bookSlot,
    unparkSlot,
    slotInfo
}
