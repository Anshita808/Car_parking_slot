const mongoose = require("mongoose")

const slotSchema = mongoose.Schema({
  slotNumber: Number,
  carNumber: String,
  ipAddress: String,
});


const SlotModel = mongoose.model('ParkingSlot',slotSchema);


module.exports = {SlotModel}