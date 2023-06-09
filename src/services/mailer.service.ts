import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { createTransport, Transporter } from 'nodemailer'

export class MailerService {
    private static transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
        host: process.env.EMAIL_SMTP,
        secure: true,
        port: +process.env.EMAIL_PORT!,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    public static async sendMail(to: string, hex: string, subject: string) {
        await this.transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text: hex,
        })
    }
}
