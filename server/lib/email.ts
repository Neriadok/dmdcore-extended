import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import smtp from "../env/smtp.json"

export async function sendEmail(mail: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
    let transporter = createTransport(smtp);
    return new Promise((resolve, reject) => transporter.sendMail(mail, (err, info) => err ? reject(err) : resolve(info)));
}

export function getEmailTemplate(title: string, body: string, ctaLink: string, ctaText: string): string{
    return `<h1>${title}</h1><p>${body}</p><a href='${ctaLink}'>${ctaText}</a>`
}