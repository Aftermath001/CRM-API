const {UserSchema} = require("./User.schema")

const insertUser = (useObj) => {
    return new Promise ((resolve, reject)=> {
        UserSchema(useObj).save()
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
 
}

module.exports = {
    insertUser, 
    
    
}