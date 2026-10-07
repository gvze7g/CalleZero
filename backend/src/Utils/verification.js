import sendEmail from "./sendEmail.js";

// Codigo numerico de 6 digitos
export const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const verificationHTML = (code) => `
  <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#fff; padding:32px; border-radius:12px; max-width:480px; margin:0 auto; text-align:center;">
    <h2 style="margin:0 0 8px;">Bienvenido al movimiento urbano</h2>
    <p style="color:#9ca3af; margin:0 0 24px;">Usa este codigo para verificar tu cuenta:</p>
    <div style="font-size:34px; letter-spacing:10px; font-weight:bold; color:#B56CFF;">${code}</div>
    <p style="color:#6b7280; font-size:13px; margin-top:24px;">El codigo expira en 10 minutos.</p>
  </div>
`;

// Guarda un codigo nuevo en el usuario y lo envia por correo
export const startVerification = async (user) => {
  const code = generateCode();
  user.recoveryCode = code;
  user.recoveryCodeExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Verifica tu cuenta - Calle Zero",
    html: verificationHTML(code),
  });
};
