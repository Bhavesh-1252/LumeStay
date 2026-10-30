import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"
import config from "../config/config.js";
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: config.BREVO_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendUserVerificationEmail(toEmail, otp) {

    const html = await ejs.renderFile(path.join(__dirname, "..", "views/templates/userVerificationEmail.ejs"), { otp })

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Verify email to register",
            htmlContent: html,
            sender: { name: 'LumeStay', email: `${config.GOOGLE_EMAIL_USER}` },
            to: [{ email: toEmail }],
        });
    } catch (error) {
        console.error("Error while sending user verification email:", error);
        throw new Error(error.body.message);
    }
}

export async function sendPasswordResetEmail(toEmail, otp) {
    const html = await ejs.renderFile(path.join(__dirname, "..", "views/templates/passwordResetEmail.ejs"), { otp })

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Reset your password",
            htmlContent: html,
            sender: { name: "LumeStay", email: `${config.GOOGLE_EMAIL_USER}` },
            to: [{ email: toEmail }]
        });
    } catch (error) {
        console.error("Error while sending password reset email", error)
        throw new Error(error.body.message);
    }
}