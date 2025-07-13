// lib/email.ts
import nodemailer from 'nodemailer';

export async function forgetpasswordLink({ to, subject, html }: { to: string, subject: string, html: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,     
    port: Number(process.env.SMTP_PORT) ,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: `"Thrifters" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
