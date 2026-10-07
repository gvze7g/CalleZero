import promotionsModel from "../models/promotions.js";
import notify from "../Utils/notify.js";
import { clean, isPromoCode, isSafeText, isPositiveNumber, isNonNegativeInt } from "../Utils/validators.js";

// Devuelve el mensaje de error o null
const promotionError = (p) => {
  if (p.code !== undefined && !isPromoCode(p.code)) return "El código solo puede tener letras y números (3 a 20)";
  if (p.description && !isSafeText(p.description, 0, 120)) return "La descripción tiene caracteres no permitidos (máx. 120)";
  if (p.discountType !== undefined && !["percent", "fixed"].includes(p.discountType)) return "Tipo de descuento no válido";
  if (p.value !== undefined && !isPositiveNumber(p.value)) return "El descuento debe ser un número mayor a 0";
  if (p.discountType === "percent" && p.value !== undefined && Number(p.value) > 100) return "El porcentaje no puede ser mayor a 100";
  if (p.minPurchase !== undefined && p.minPurchase !== "" && (isNaN(p.minPurchase) || Number(p.minPurchase) < 0)) return "La compra mínima debe ser 0 o más";
  if (p.maxUses !== undefined && p.maxUses !== "" && !isNonNegativeInt(p.maxUses)) return "Los usos máximos deben ser un número entero (0 = ilimitado)";
  if (p.expiresAt && isNaN(new Date(p.expiresAt).getTime())) return "Fecha de expiración no válida";
  return null;
};

const promotionsController = {};

// Revisa si un codigo aplica al subtotal y calcula el descuento
export const checkPromotion = async (code, subtotal) => {
  if (!code) return { error: "Ingresa un código" };

  const promo = await promotionsModel.findOne({ code: String(code).trim().toUpperCase() });

  if (!promo || !promo.isActive) return { error: "Código no válido" };
  if (promo.expiresAt && promo.expiresAt < new Date()) return { error: "Este código ya expiró" };
  if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) return { error: "Este código ya alcanzó su límite de usos" };
  if (subtotal < promo.minPurchase) return { error: `Compra mínima de $${promo.minPurchase.toFixed(2)} para usar este código` };

  const raw = promo.discountType === "percent" ? (subtotal * promo.value) / 100 : promo.value;
  const discount = Math.min(Math.round(raw * 100) / 100, subtotal);

  return { promo, discount };
};

const promoLabel = (p) => (p.discountType === "percent" ? `${p.value}%` : `$${p.value}`);

// GET (admin)
promotionsController.getAll = async (req, res) => {
  try {
    const promotions = await promotionsModel.find().sort({ createdAt: -1 });
    return res.status(200).json(promotions);
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST (admin)
promotionsController.create = async (req, res) => {
  try {
    const { code, description, discountType, value, minPurchase, maxUses, expiresAt, isActive } = req.body;

    if (!code || value === undefined || value === "") {
      return res.status(400).json({ message: "Código y valor son requeridos" });
    }
    const invalid = promotionError({ ...req.body, discountType: discountType || "percent" });
    if (invalid) return res.status(400).json({ message: invalid });
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res.status(400).json({ message: "La fecha de expiración debe ser futura" });
    }

    const exists = await promotionsModel.findOne({ code: String(code).trim().toUpperCase() });
    if (exists) {
      return res.status(409).json({ message: "Ese código ya existe" });
    }

    const promo = await promotionsModel.create({
      code: clean(code).toUpperCase(),
      description: clean(description),
      discountType: discountType || "percent",
      value: Number(value),
      minPurchase: Number(minPurchase) || 0,
      maxUses: Number(maxUses) || 0,
      expiresAt: expiresAt || null,
      isActive: isActive !== false,
    });

    // Aviso a todos los clientes
    if (promo.isActive) {
      await notify({
        audience: "users",
        type: "promo",
        title: `Nuevo código: ${promo.code}`,
        message: `${promoLabel(promo)} de descuento${promo.description ? ` · ${promo.description}` : ""}`,
      });
    }

    return res.status(201).json({ message: "Promoción creada", promotion: promo });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT (admin)
promotionsController.update = async (req, res) => {
  try {
    const { code, description, discountType, value, minPurchase, maxUses, expiresAt, isActive } = req.body;

    const current = await promotionsModel.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Promoción no encontrada" });
    const invalid = promotionError({ ...req.body, discountType: discountType || current.discountType });
    if (invalid) return res.status(400).json({ message: invalid });

    const update = {};
    if (code !== undefined) update.code = String(code).trim().toUpperCase();
    if (description !== undefined) update.description = clean(description);
    if (discountType !== undefined) update.discountType = discountType;
    if (value !== undefined) update.value = Number(value);
    if (minPurchase !== undefined) update.minPurchase = Number(minPurchase) || 0;
    if (maxUses !== undefined) update.maxUses = Number(maxUses) || 0;
    if (expiresAt !== undefined) update.expiresAt = expiresAt || null;
    if (isActive !== undefined) update.isActive = isActive;

    const promo = await promotionsModel.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!promo) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }

    return res.status(200).json({ message: "Promoción actualizada", promotion: promo });
  } catch (error) {
    console.log("Error: " + error);
    if (error.code === 11000) return res.status(409).json({ message: "Ese código ya existe" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE (admin)
promotionsController.remove = async (req, res) => {
  try {
    const promo = await promotionsModel.findByIdAndDelete(req.params.id);
    if (!promo) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }
    return res.status(200).json({ message: "Promoción eliminada" });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /validate (cliente): { code, subtotal }
promotionsController.validate = async (req, res) => {
  try {
    const subtotal = Number(req.body.subtotal) || 0;
    const result = await checkPromotion(req.body.code, subtotal);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      code: result.promo.code,
      description: result.promo.description,
      discountType: result.promo.discountType,
      value: result.promo.value,
      discount: result.discount,
    });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default promotionsController;
