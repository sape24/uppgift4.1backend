const express = require("express")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/authRoutes")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())


app.use("/api", authRoutes)

app.listen(port, () => {
    console.log(`server running at ${port}`) 
})



