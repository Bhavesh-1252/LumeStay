
import nodemailer from "nodemailer";
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.GOOGLE_EMAIL_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((err) => {
    if (err) {
        throw new Error("Error connecting to email server:", err);
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function verifyEmail(toEmail, link) {

    const html = await ejs.renderFile(path.join(__dirname, "..", "views/templates/email.ejs"), { link })

    const mainOptions = {
        from: `"LumeStay" <${config.GOOGLE_EMAIL_USER}>`, // sender address
        to: `${toEmail}`, // list of recipients
        subject: "Verify email to register", // subject line
        html: html, // HTML body
    }

    try {
        await transporter.sendMail(mainOptions);
    } catch (err) {
        console.error("Error while sending mail:", err);
        return err;
    }
}