import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url"
import config from "../config/config.js";
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: config.BREVO_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function verifyEmail(toEmail, link) {

    const html = await ejs.renderFile(path.join(__dirname, "..", "views/templates/email.ejs"), { link })

    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: "Verify email to register",
            htmlContent: html,
            sender: { name: 'LumeStay', email: `${config.GOOGLE_EMAIL_USER}` },
            to: [{ email: toEmail }],
        });
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw new Error(err.body.message);
    }
}