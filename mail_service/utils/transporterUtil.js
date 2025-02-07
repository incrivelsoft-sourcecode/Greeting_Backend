import nodemailer from "nodemailer";

const EMAIL = process.env.EMAIL; // Your Gmail address
const PASS_KEY = process.env.PASS_KEY; // Your Gmail app password

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true, 
    auth: {
        user: EMAIL,
        pass: PASS_KEY,
    },
});

export const getTransportConfig = (emailType, email, paaskey) => {
    switch (emailType) {
        case "gmail":
            return nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: { user: email, pass: paaskey },
            });
        case "outlook":
            return nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        case "zoho":
            return nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true,
                auth: { user: email, pass: paaskey },
            });
        case "yahoo":
            return nodemailer.createTransport({
                host: "smtp.mail.yahoo.com",
                port: 465,
                secure: true,
                auth: { user: email, pass: paaskey },
            });
        case "icloud":
            return nodemailer.createTransport({
                host: "smtp.mail.me.com",
                port: 587,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        case "yandex":
            return nodemailer.createTransport({
                host: "smtp.yandex.com",
                port: 465,
                secure: true,
                auth: { user: email, pass: paaskey },
            });
        case "proton":
            return nodemailer.createTransport({
                host: "127.0.0.1",
                port: 1025,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        case "mailgun":
            return nodemailer.createTransport({
                host: "smtp.mailgun.org",
                port: 587,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        case "sendgrid":
            return nodemailer.createTransport({
                host: "smtp.sendgrid.net",
                port: 587,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        case "postmark":
            return nodemailer.createTransport({
                host: "smtp.postmarkapp.com",
                port: 587,
                secure: false,
                auth: { user: email, pass: paaskey },
            });
        default:
            return nodemailer.createTransport({
                host: 'smtp.gmail.com', 
                port: 465, 
                secure: true, 
                auth: {
                    user: EMAIL,
                    pass: PASS_KEY,
                },
            });
    }
};

