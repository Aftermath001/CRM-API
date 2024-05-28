const express = require("express")
const { route } = require("./ticket.router")
const router = express.Router()
const {insertUser, getUserByEmail, getUserById,updatePassword,storeUserRefreshJWT} = require("../model/user/User.model")
const {hashPassword, comparePassword} = require("../helper/bcrypt.helper")
const { crateAccessJWT, crateRefreshJWT } = require ("../helper/jwt.helper")
const {userAuthorization} = require("../middlewares/auth.middleware")
const {newUserValidation} = require("../middlewares/formValidation.middleware")
const {setPasswordResetPin, getPinByEmailPin,deletePin} = require("../model/resetPin/ResetPin.model")
const {emailProcessor} = require("../helper/email.helper")
const {resetPassReqValidation, updatePassValidation} = require("../middlewares/formValidation.middleware")
const {deleteJWT} = require("../helper/redis.helper")



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
router.post("/",newUserValidation, async (req, res) => {
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

// Sign in a user
router.post("/login", async (req, res) => {
    console.log(req.body)
    
    const {email, password} = req.body

    if (!email || !password){
        return res.json({status:"error", message:" Check Credentials, Invalid submission!"})
    }
    // get user email from DB
    const user = await getUserByEmail(email)
    // console.log(user)
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

router.post("/reset-password",resetPassReqValidation, async (req,res)=>{
    // Recive email
    const { email } = req.body
    // Check if email exists
    const user = await getUserByEmail(email)
    if(user && user._id){
        // Create unique 6 digit pin
        const setPin = await setPasswordResetPin(email)
        // save pin and email 
        await emailProcessor({email,pin:setPin.pin, type: "request-new-password"})
        // email the pin
    
        return res.json({
             status: "Success",
             message:"If the email exists, the password reset pin will be sent shortly"

        })

        
        
    }
    res.json({status: "Error", message:"If the email exists, the password reset pin will be sent shortly"})
})

router.patch("/reset-password",updatePassValidation, async (req,res)=>{
    // Receive email, pin and newpassword
    const {email, pin, newPassword} = req.body
    const getPin = await getPinByEmailPin(email, pin)
    // validate pin
    if (getPin._id){
        const dbDate = getPin.addedAt;
        const expiresIn = 1
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn)
        const today = new Date()
        
        if (today > expDate){
            res.json({status: "error", message:"Invalid or expired pin"})
        }
        // Encrypt new password
        const hashedPass = await hashPassword(newPassword)
        // Get updated password from DB
        const user = await updatePassword(email, hashedPass)

        if(user._id){
            // Send email notification
            await emailProcessor({email, type:"update-password-success"})

            // delete previous pin from db
            deletePin(email,pin)

            return res.json({
                status:"success",
                message:"Your password has been updated"
            })
        }
    }
    res.json ({status: "Error", message:"Unable to update your password"})
})

// Log out user ain invalidate JWT
router.delete("/logout", userAuthorization, async (req, res) => {
	const { authorization } = req.headers;
	//this data coming form database
	const _id = req.userId;

	// 2. delete accessJWT from redis database
	deleteJWT(authorization);

	// 3. delete refreshJWT from mongodb
	const result = await storeUserRefreshJWT(_id, "");
    if (result._id) {
		return res.json({ status: "success", message: "Loged out successfully" });
	}
	res.json({
		status: "error",
		message: "Unable to logg you out, plz try again later",
	});
});

module.exports = router;

