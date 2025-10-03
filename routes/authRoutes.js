const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
require("dotenv").config()

mongoose.set("strictQuery", false)
mongoose.connect(process.env.DATABASE).then(()=>{           //ansluter till databsen med hjälp av collectionstringen som finns i env
    console.log("connected to database")
}).catch((error) => {
    console.log("error connecting to database")
})

const User = require("../models/user")                  //hämtar in user modellen som definierats i user.js

router.post("/register", async (req,res) => {          //post route för /register som hanterar registrering av nya användare
    try{
        const { username, password} = req.body

        if(!username || !password ) {
            return res.status(400).json({error: "Invalid input"})
        }

        const newUser = new User({username, password})
        await newUser.save()
        res.status(201).json({message:"User Created"})

    } catch(error){
        res.status(500).json({error: error.message})
    }
})

router.post("/login", async (req,res) => {          //post route för /login som hanterar inloggning av användare
    try{
        const {username, password} = req.body

        if(!username || !password) {
            return res.status(400).json({error: "Invalid input"})
        }

        const user = await User.findOne( {username} )
    
        if(!user){
            return res.status(401).json({error : "incorrect username/password"})
        }


        const isPasswordMatch = await user.comparePassword(password)
        if(!isPasswordMatch){
            return res.status(401).json({error : "incorrect username/password"})
        }else{
            const payload = {username:username, date: user.date}             //skapar ett payload objekt
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:'1h'})    //skapar en jwt token med den tidigare skapade payloaden och använder ens hemliga nyckel från env. Sätter giltighetstiden till 1 timme
            const response = {
                message: "user logged in",
                token: token

            }
            res.status(200).json({response})
        }

    } catch(error){
        res.status(500).json({error: "Server Error"})
    }
})

module.exports = router            //exporterar router så att dom kan avnändas i server.js