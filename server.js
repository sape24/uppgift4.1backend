const express = require("express")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/authRoutes")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())


app.use("/api", authRoutes)        

app.get("/api/protected", authenticateToken, (req, res) =>{    //en skyddad route som bara kan nås om användaren har giltig jwt token
    res.json({message: "Skyddad route"})
})

function authenticateToken(req, res, next){        //middleware som kontroller ifall en giltig jwt skickas med requesten
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]           //hämtar sjävlaste token från authorization headern

    if(token == null) res.status(401).json({message: "not authorized for this route - token missing"})
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {         //verifierar token med hjälp av hemliga nyckeln om den är giltig skickas payloaden tillbaka annars uppstår error
        if(err) return res.status(403).json({message: "Not correct JWT"})
        
        req.username = username
        next()
    })
}

app.listen(port, () => {
    console.log(`server running at ${port}`) 
})



