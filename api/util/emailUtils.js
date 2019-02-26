"use strict";
const nodemailer = require("nodemailer");
const emailPass = process.env.EMAIL_PASS;

// async..await is not allowed in global scope, must use a wrapper
exports.sendEmail = function sendEmail(reciver,htmlContent){
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        //let account = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'beknazarsuranchiyev@gmail.com', // generated ethereal user
                pass: emailPass
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Cybertek Team 👻" <foo@example.com>', // sender address
            to: reciver, // list of receivers
            subject: "Resume App notification ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: htmlContent // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);

}


