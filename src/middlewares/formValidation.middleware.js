const Joi = require('joi');

const email = Joi.string().email({
	minDomainSegments: 2,
	tlds: { allow: ["com", "net"] },
})


const pin = Joi.number().min(10000).max(999999).required();
const newPassword = Joi.string().min(3).max(30).required();
const shortStr = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const phone = Joi.string()
  .pattern(/^07\d{8}$/)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be a valid Kenyan number starting with 07 and followed by 8 digits.'
  });

const resetPassReqValidation = (req, res, next) =>{

	const schema = Joi.object({email})
	const value = schema.validate(req.body)
	if(value.error){
		res.json({status: "Error", message: value.error.message})
	}
	next()
}
const updatePassValidation = (req, res, next) => {
	const schema = Joi.object({ email, pin, newPassword });

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};
const createNewTicketValidation = (req, res, next) => {
	const schema = Joi.object({
		subject: shortStr.required(),
		sender: shortStr.required(),
		message: longStr.required(),
	})
	// console.log(req.body);
	const value = schema.validate(req.body)
	console.log(value);

	if(value.error){
		return res.json({ status: "error", message: value.error.message });
	}
	next();

}
const replyTicketMessageValidation = (req, res, next) => {
	const schema = Joi.object({
		sender: shortStr.required(),
		message: longStr.required(),
	});

	console.log(req.body);
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}

	next();
};
const newUserValidation = (req, res, next) => {
	const schema = Joi.object({
		name: shortStr.required(),
		company: shortStr.required(),
		address: shortStr.required(),
		phone: phone,
		email: shortStr.required(),
		password: shortStr.required(),
	});

	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}

	next();
};
module.exports = {
	resetPassReqValidation,
	updatePassValidation,
	createNewTicketValidation,
	replyTicketMessageValidation,
	newUserValidation,
	
};