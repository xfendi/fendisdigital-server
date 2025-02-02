require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");

const app = express();
app.use(express.json());
app.use(cors());

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

app.post("/send-newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const personalization = [
      {
        email: email,
        data: {
          ceo_name: "Fendis Digital",
        },
      },
    ];

    const sentFrom = new Sender(
      "newsletter@fendisdigital.pl",
      "Fendis Digital"
    );

    const recipients = [new Recipient(email, "Klient")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Subject")
      .setTemplateId("x2p0347mxe94zdrn")
      .setPersonalization(personalization);

    await mailersend.email.send(emailParams);
    res.json({ message: "Newsletter sent successfully" });
  } catch (error) {
    console.error(
      "MailerSend Error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Failed to send the newsletter" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
