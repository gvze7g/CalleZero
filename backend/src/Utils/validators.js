// Reglas de validacion compartidas por los controladores

export const clean = (value) => String(value ?? "").trim().replace(/\s+/g, " ");

const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?[0-9 -]+$/;
const SAFE_TEXT_RE = /^[^<>{}$\\]*$/;

export const isEmail = (v) => EMAIL_RE.test(clean(v)) && clean(v).length <= 100;

export const isName = (v, min = 3, max = 50) => {
  const s = clean(v);
  return s.length >= min && s.length <= max && NAME_RE.test(s);
};

export const isPhone = (v) => {
  const s = clean(v);
  const digits = s.replace(/\D/g, "");
  return PHONE_RE.test(s) && digits.length >= 8 && digits.length <= 15;
};

export const isPassword = (v) =>
  typeof v === "string" && v.length >= 8 && v.length <= 64 && /[A-Za-z]/.test(v) && /[0-9]/.test(v);

export const isSafeText = (v, min = 0, max = 500) => {
  const s = clean(v);
  return s.length >= min && s.length <= max && SAFE_TEXT_RE.test(s);
};

export const isZip = (v) => /^[0-9]{4,10}$/.test(clean(v));

export const isCode = (v) => /^[0-9]{6}$/.test(clean(v));

export const isPromoCode = (v) => /^[A-Z0-9]{3,20}$/.test(clean(v).toUpperCase());

export const isPositiveNumber = (v) => v !== "" && v !== null && !isNaN(v) && Number(v) > 0;

export const isNonNegativeInt = (v) => v !== "" && v !== null && Number.isInteger(Number(v)) && Number(v) >= 0;

export const MESSAGES = {
  name: "El nombre solo puede tener letras y espacios (3 a 50 caracteres)",
  email: "Ingresa un correo válido (ejemplo@correo.com)",
  phone: "El teléfono debe tener entre 8 y 15 dígitos",
  password: "La contraseña debe tener 8 caracteres o más y combinar letras y números",
  code: "El código debe tener 6 dígitos",
  text: "El texto contiene caracteres no permitidos",
  zip: "El código postal debe tener solo números (4 a 10)",
};

// Busqueda de correo sin importar mayusculas
export const emailQuery = (email) => ({
  email: { $regex: `^${clean(email).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
});
