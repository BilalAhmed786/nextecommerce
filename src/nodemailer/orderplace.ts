// utils/mailer.ts
import nodemailer from 'nodemailer';

export const sendOrderEmail = async ({
  to,
  name,
  orderId,
  total,
}: {
  to: string;
  name: string;
  orderId: string;
  total: number;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,      // e.g., smtp.mailtrap.io
    port: Number(process.env.SMTP_PORT) || 587, // e.g., 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"My Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Order Confirmation (#${orderId})`,
    html: `
      <h3>Hello ${name},</h3>
      <p>Thanks for placing your order.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <br />
      <p>We will contact you once it's shipped.</p>
    `,
  });
};
