/*const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail(to, otp) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Your verification code',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Your one-time verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };*/

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"My Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your verification code',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Your one-time verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

async function sendResetEmail(to, resetLink) {
  await transporter.sendMail({
    from: `"My Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
        <p><a href="${resetLink}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail, sendResetEmail };