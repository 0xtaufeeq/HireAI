import FormData from "form-data";
import Mailgun from "mailgun.js";

export async function sendMail({ to, subject, text }: sendMailProps) {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY!,
    });
    try {
        const data = await mg.messages.create(
            "sandboxaae514be95574ab694328332f4202b8d.mailgun.org",
            {
                from: "Mailgun Sandbox <postmaster@sandboxaae514be95574ab694328332f4202b8d.mailgun.org>",
                to: to,
                subject: subject,
                text: text,
            }
        );

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

export interface sendMailProps {
    to: string[];
    subject: string;
    text: string;
}
