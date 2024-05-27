const express = require("express")
const router = express.Router()
const { crateAccessJWT, crateRefreshJWT } = require ("../helper/jwt.helper")
const {userAuthorization} = require("../middlewares/auth.middleware")
const {hashPassword, comparePassword} = require("../helper/bcrypt.helper")
const {insertUser, getUserByEmail,getUserById} = require("../model/user/User.model")

router.all("/", (req, res, next)=>{
    
    // res.json({ message: "Return from user router"})
    next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res)=>{
    // data from DB
    const _id = req.userId

    // Extract userID
    const userProf = await getUserById(_id)
    res.json({user: userProf})
})

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


// Login in a user
router.post("/login", async (req, res) => {
    const {email, password} = req.body
    if (!email || !password){
        return res.json({status:"error", message:" Check Credentials, Invalid submission!"})
    }

    // get user email from DB
    const user = await getUserByEmail(email)
    const passFromDB = user && user._id ? user.password : null;
    if(!passFromDB) 
        return res.json({status:"error", message:" Invalid email or password!"})

    const result = await  comparePassword(password, passFromDB)
    if(!result){
        return res.json({status:"error", message:" Invalid email or password!"})
        
    }
    const accessJWT =  await crateAccessJWT(user.email, `${user._id}`)
    const refreshJWT = await crateRefreshJWT(user.email, `${user._id}`)
    res.json({
        status:"success", 
        message:"Login Successful",
        accessJWT,
        refreshJWT,
    })

  
})

module.exports = router;