const nodemailer = require("nodemailer");

const sendToEmail = async (email, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from environment variables
            user: 'nghiavu.dev@gmail.com',
            pass: 'zbhm bkdu uggz hwbh',
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"shopdientu" <shopdientu.com>', // sender address
            to: email, // list of receivers
            subject: "For password", // Subject line
            html: html, // html body
        });
        return info;
    } catch (error) {
        // Handle error
        console.error("Error sending email:", error);
        throw error;
    }
};


module.exports = sendToEmail;