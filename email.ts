import nodemailer from 'npm:nodemailer';
import config from "./config.json" with { type: "json" };

export async function sendEmail() {
    const transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
  
    const mailOptions = {
      from: config.emailUser,
      to: config.emailRecipient,
      subject: config.title,
      attachments: [
        {
          path: config.outputFileName,
        },
      ],
    };
  
    if (await Deno.stat(config.outputFileName)) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`📨 Message sent: ${info.messageId}`);
          } catch (error) {
            console.error(`🚫 Error: ${error}`);
          }
    } else {
        console.error("🚫 ebook file is missing");
    }
    
  };