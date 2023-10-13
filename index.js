const express = require("express");
const { connection } = require("./config/db");
const { slotRouter } = require("./routes/parkslot.routes");

const app = express();


app.use(express.json());
app.use("/slot",slotRouter)



app.listen(8080,async()=>{
    try {
        await connection
        console.log("DB is connected")
    } catch (error) {
        
    }
    console.log("Server is running")
})