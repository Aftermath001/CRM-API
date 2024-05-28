const { randomPinNumber } = require("../../utils/randomGenerator")
const { ResetPinSchema } = require("./ResetPin.schema")


const setPasswordResetPin = async (email) => {
    // Create unique 6 digit pin
    const pinLength = 6;
    const randPin = await randomPinNumber(pinLength);
  
    const restObj = {
      email,
      pin: randPin,
    };
  
    return new Promise((resolve, reject) => {
      ResetPinSchema(restObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
};

const getPinByEmailPin = async (email, pin) => {
  try {
    const data = await ResetPinSchema.findOne({ email, pin });
    return data || false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const deletePin = async (email, pin) => {
  try {
    const data = await ResetPinSchema.findOneAndDelete({ email, pin });
    return data || false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};









module.exports = {
    setPasswordResetPin,
    getPinByEmailPin,
    deletePin, 
}