const bcrypt = require('bcrypt');
const saltRounds = 10;

 // hash Password
const hashPassword = (plainPassword) => {
    return new Promise (resolve =>{
        resolve(bcrypt.hashSync(plainPassword, saltRounds))
    })
}
const comparePassword = (plainPass, passFromDB) => {
    return new Promise((resolve, reject)=>{
        bcrypt.compare(plainPass, passFromDB, function(err, result) {
          if(err) reject(err);
            resolve(result)
        });
    })
}

module.exports = {
    hashPassword,
    comparePassword,
}