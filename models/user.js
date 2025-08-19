const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema ({  //skapar ett mongoose userschema som definierar hur användatan ska struktureras i database
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre("save", async function(next){  //en pre save som körs automatiskt innan ett nytt dokument sparas till databasen
    try{
        if(this.isNew || this.isModified("password")){
            const hashedPassword = await bcrypt.hash(this.password, 10)  //hashar användarens lösenord med hjälp av bcrypt
            this.password = hashedPassword
        }

        next()
    } catch(error){
        next(error)
    }
})

userSchema.statics.register = async function(username, password){ //statisk metod för att spara nya registreade användare
    try{
        const user = new this({username, password})
        await user.save()
        return user
    } catch(error){
        throw error
    }
}

userSchema.methods.comparePassword = async function(password){  //metod som jämför inskrivet lösenord med sparade hashade lösenord
    try{
        return await bcrypt.compare(password, this.password)
    } catch (error){
        throw error
    }
}

userSchema.statics.login = async function(username, password){ //statisk metod som kallas via user.login kontrollerar på användarnamn och lösenord
    try{
        const user = await this.findOne({username})

        if(!user){
            throw new Error("incorrect username/password")
        }
        const isPasswordMatch = await user.comparePassword(password)  //avnänder comparepassword för att kontrollera att de inskriva lösenorder stämmer med hashade lösenord i databasen

        if(!isPasswordMatch){
            throw new Error("incorrect username/password")
        }

        return user
    }catch(error){
        throw error
    }
}

const User = mongoose.model("User", userSchema)  
module.exports = User