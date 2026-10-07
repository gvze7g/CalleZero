// Reglas de validacion de formularios (iguales a las del backend)

export const clean = (value) => String(value ?? "").trim().replace(/\s+/g, " ");

const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const SAFE_TEXT_RE = /^[^<>{}$\\]*$/;

export const isEmail = (v) => EMAIL_RE.test(clean(v)) && clean(v).length <= 100;

export const isName = (v, min = 3, max = 50) => {
  const s = clean(v);
  return s.length >= min && s.length <= max && NAME_RE.test(s);
};

export const isPhone = (v) => {
  const s = clean(v);
  const digits = s.replace(/\D/g, "");
  return /^\+?[0-9 -]+$/.test(s) && digits.length >= 8 && digits.length <= 15;
};

export const isPassword = (v) =>
  typeof v === "string" && v.length >= 8 && v.length <= 64 && /[A-Za-z]/.test(v) && /[0-9]/.test(v);

export const isSafeText = (v, min = 0, max = 500) => {
  const s = clean(v);
  return s.length >= min && s.length <= max && SAFE_TEXT_RE.test(s);
};

export const isZip = (v) => /^[0-9]{4,10}$/.test(clean(v));

// Filtros para escribir solo lo permitido en cada campo
export const onlyLetters = (v) => v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, "").slice(0, 50);
export const onlyDigits = (v, max = 10) => v.replace(/\D/g, "").slice(0, max);
export const phoneChars = (v) => v.replace(/[^0-9 +-]/g, "").slice(0, 20);
export const emailChars = (v) => v.replace(/\s/g, "").slice(0, 100);
export const promoChars = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
export const safeChars = (v, max = 150) => v.replace(/[<>{}$\\]/g, "").slice(0, max);

export const MESSAGES = {
  name: "El nombre solo puede tener letras y espacios (3 a 50 caracteres)",
  email: "Ingresa un correo válido (ejemplo@correo.com)",
  phone: "El teléfono debe tener entre 8 y 15 dígitos",
  password: "La contraseña debe tener 8 caracteres o más y combinar letras y números",
  code: "Ingresa el código de 6 dígitos",
  zip: "El código postal debe tener solo números (4 a 10)",
};
