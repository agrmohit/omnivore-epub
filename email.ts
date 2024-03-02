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
    from: `${config.emailFrom} <${config.emailUser}>`,
    to: config.emailRecipient,
    subject: config.title,
    text: `Sent by Omnivore EPUB (https://github.com/agrmohit/omnivore-epub)`,
    attachments: [
      {
        path: config.outputFileName,
      },
    ],
  };

  if (await verifyEpub()) {
    try {
      console.log(`📧 Sending email from '${config.emailFrom} <${config.emailUser}>' to '${config.emailRecipient}'`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`📨 Email sent: ${info.messageId}`);
    } catch (error) {
      console.error(`🚫 Error: ${error}`);
      Deno.exit(1);
    }
  }
}

async function verifyEpub(): Promise<boolean> {
  try {
    const file = await Deno.stat(config.outputFileName);

    // Check if it is indeed a file
    if (!file.isFile) {
      console.error(`🚫 ${config.outputFileName} is not a file`);
      Deno.exit(1);
    }

    // Convert from bytes to MB (not MiB) rounded off to 2 digits after decimal
    const ebookSize = (file.size / 1_000_000).toFixed(2);

    // Show a warning if ebook is over a specified size
    if (!config.emailSizeWarningSuppress && Number(ebookSize) >= config.emailSizeWarningMinSize) {
      console.warn(`⚠️ ebook size is too large at ${ebookSize} MB (limit: ${config.emailSizeWarningMinSize} MB)`);
      console.warn("⚠️ Many email providers and eReader emailing services may reject this email");
      console.warn("⚠️ To suppress this warning, set 'emailSuppressSizeWarning' to true in 'config.json'");
    }
  } catch (_err) {
    console.error(`🚫 ebook file '${config.outputFileName}' is missing`);
    Deno.exit(1);
  }

  return true;
}
