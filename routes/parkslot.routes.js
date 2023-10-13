const express = require("express")
const slotController = require("../controller/slot.controller");
const { rateLimit } = require("../middleware/ratelimiter");
const slotRouter = express.Router();


slotRouter.post("/park",slotController.bookSlot);
slotRouter.post("/unpark", rateLimit,slotController.unparkSlot);
slotRouter.get("/slotinfo", rateLimit,slotController.slotInfo);


module.exports = {slotRouter}