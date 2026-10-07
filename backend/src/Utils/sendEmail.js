import { config } from "../config.js";

// Envia correos con la API de Mailjet (HTTP, no SMTP)
const sendEmail = async ({ to, subject, html }) => {
  const { apiKey, secretKey, senderEmail, senderName } = config.mailjet;

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: senderEmail, Name: senderName },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.Messages?.[0]?.Status !== "success") {
    const detail = data.Messages?.[0]?.Errors?.[0]?.ErrorMessage || data.ErrorMessage || response.statusText;
    throw new Error(`Mailjet: ${detail}`);
  }

  return data;
};

export default sendEmail;
