const express = require("express")
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const authRoute = require("./routes/authRoute")
const checklistRoute = require("./routes/checklistRoute")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
mongoose.connect(process.env.MONGO_URL)
.then(() => {console.log("database connected")})
.catch(() => {console.log("database not connected");})

app.use("/api/auth", authRoute)
app.use("/api/checklist", checklistRoute)
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log(`server running at ${PORT}`);
})