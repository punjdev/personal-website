"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendContactEmail(name: string, email: string, message: string) {
  const { error } = await resend.batch.send([
    {
      // Notification to Dev
      from: "contact@devpunjabi.com",
      to: "dev@devpunjabi.com",
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    },
    {
      // Confirmation to sender
      from: "contact@devpunjabi.com",
      to: email,
      subject: `Got your message`,
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out. I got your message and will get back to you soon.</p>
        <p>Dev</p>
      `,
    },
  ]);

  if (error) throw new Error(error.message);
}
