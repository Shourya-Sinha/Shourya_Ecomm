import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport

const sendMail = asyncHandler(async (emailData)=>{
    try {
        let transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            auth:{
                user:process.env.MAIL_ID,
                pass:process.env.MAIL_PASSWORD,
            },
        });
        
        let info = await transporter.sendMail({
            from: '"Hey 👻" <info@ShouryaSinha.com>',
            to: emailData.recipient,
            subject:emailData.subject,
            text: emailData.text,
            html: emailData.html,
        });

        console.log('Message sent %s',info.messageId);
        return info;
    } catch (error) {
        console.log('Error in sending mail',error);
        throw new Error(error);
    }
});

export default sendMail;