const jwt = require('jsonwebtoken');


const crateAccessJWT =  (email, _id) =>{
    try {
        const accessJWT = jwt.sign(
        { email },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '30m',}
        )
        // await setJWT(accessJWT, _id)
        return Promise.resolve(accessJWT);
        
    } catch (error) {
        return Promise.reject(error);
    }
   
}

const crateRefreshJWT =  (email, _id) =>{
    try {
        const refreshJWT = jwt.sign(
            { email }, 
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: '30d',}
        )
        // await storeUserRefreshJWT(_id,refreshJWT)
        return Promise.resolve(refreshJWT);
        
    } catch (error) {
        return Promise.reject(error)
    }
   
}

module.exports = {
    crateAccessJWT,
    crateRefreshJWT,
  
}