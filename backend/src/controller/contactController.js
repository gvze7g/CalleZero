import sendEmail from "../Utils/sendEmail.js";
import notify from "../Utils/notify.js";
import { config } from "../config.js";
import { clean, isName, isEmail, isSafeText, MESSAGES } from "../Utils/validators.js";

const contactController = {};

// POST /api/contact: envia el mensaje al correo de la tienda
contactController.send = async (req, res) => {
  try {
    const name = clean(req.body.name);
    const email = clean(req.body.email).toLowerCase();
    const subject = clean(req.body.subject);
    const message = String(req.body.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Debes completar todos los campos" });
    }
    if (!isName(name)) return res.status(400).json({ message: MESSAGES.name });
    if (!isEmail(email)) return res.status(400).json({ message: MESSAGES.email });
    if (!isSafeText(subject, 3, 80)) return res.status(400).json({ message: "El asunto debe tener entre 3 y 80 caracteres válidos" });
    if (!isSafeText(message, 10, 1000)) return res.status(400).json({ message: "El mensaje debe tener entre 10 y 1000 caracteres válidos" });

    await sendEmail({
      to: config.mailjet.senderEmail,
      replyTo: email,
      subject: `Contacto web: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:560px;">
          <h2 style="color:#B56CFF;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p style="white-space:pre-line; background:#f4f4f9; padding:12px; border-radius:8px;">${message}</p>
        </div>
      `,
    });

    await notify({
      audience: "admin",
      type: "system",
      title: "Nuevo mensaje de contacto",
      message: `${name}: ${subject}`,
    });

    return res.status(200).json({ message: "Mensaje enviado. Te responderemos pronto." });
  } catch (error) {
    console.error("Error en contacto:", error);
    return res.status(500).json({ message: "No se pudo enviar el mensaje, intenta más tarde" });
  }
};

export default contactController;
