const {UserSchema} = require("./User.schema")

const insertUser = (useObj) => {
    return new Promise ((resolve, reject)=> {
        UserSchema(useObj).save()
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
 
}

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if (!email) return reject(new Error('Email is required'));

        UserSchema.findOne({ email })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

module.exports = {
    insertUser, 
    getUserByEmail,
    
    
}