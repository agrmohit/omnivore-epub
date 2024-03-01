import nodemailer from "npm:nodemailer";
import config from "./config.json" with { type: "json" };

export async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: !config.emailAllowSTARTTLS,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });

  const mailOptions = {
    from: `Omnivore EPUB Mailer <${config.emailUser}>`,
    to: config.emailRecipient,
    subject: config.title,
    attachments: [
      {
        path: config.outputFileName,
      },
    ],
  };

  if (
    await Deno.stat(config.outputFileName).catch((_err) => {
      console.error(`🚫 ebook file '${config.outputFileName}' is missing`);
      Deno.exit(1);
    })
  ) {
    try {
      console.log(`📧 Sending email from 'Omnivore EPUB Mailer <${config.emailUser}>' to '${config.emailRecipient}'`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`📨 Email sent: ${info.messageId}`);
    } catch (error) {
      console.error(`🚫 Error: ${error}`);
      Deno.exit(1);
    }
  }
}
