const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'margaretta.reichel@ethereal.email',
        pass: 't7BjRUpXtkR2hH8CY9'
    }
});
const send = (info) => {
    return new Promise( async (resolve, reject) =>{
        try {
             // send mail with defined transport object
            let result = await transporter.sendMail(info);

            console.log("Message sent: %s", result.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result))

            resolve(result)
        
        } catch (error) {
            console.log(error)
        }
    })
    

   

}



const emailProcessor = ({email, pin, type}) => {
    let info = ""
    switch (type) {
        case "request-new-password":
            info = {
        
                from: '"ICPALD CRM 👻" <margaretta.reichel@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: " Reset Password", // Subject line
                text: "Here is your password reset pin" + pin + "This pin will expire in 24hrs", // plain text body
                html: `<b>Hello</b>
                Here is your pin
                <b>${pin}</b>
                <p>This pin will expire in 24hrs</p>
                `, // html body
            
            }
            send(info)
            break;

        case "update-password-success":
            info = {
            
                from: '"ICPALD CRM 👻" <margaretta.reichel@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "Password Updated", // Subject line
                text: "Your new password has been update", // plain text body
                html: `<b>Hello</b>
                Here is your pin
                <p>Your new password has been update</p>
                `, // html body
            
            }
            send(info)
    
        default:
            break;
    }

    
}

module.exports = {emailProcessor}