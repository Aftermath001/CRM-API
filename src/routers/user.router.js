const express = require("express")
const router = express.Router()
const {hashPassword, comparePassword} = require("../helper/bcrypt.helper")
const {insertUser} = require("../model/user/User.model")

router.all("/", (req, res, next)=>{
    
    // res.json({ message: "Return from user router"})
    next();
});


// Create a new user
router.post("/", async (req, res) => {
    const {name, company, address, phone, email, password} = req.body

    try {
        // hash Password
        const hashedPass = await hashPassword(password)

        // Create a new object with the hashedpassword
        const newUserObj ={
            name, 
            company, 
            address, 
            phone, 
            email, 
            password:hashedPass

        }

        const result = await insertUser(newUserObj)
        console.log(result)
        res.json({ message: "New User Created", result});
        
    } catch (error) {
        console.log(error)
        res.json({ status: "error", message:error.message });
        
    }
})

module.exports = router;