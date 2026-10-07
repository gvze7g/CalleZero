import userModel from "../models/users.js";
import { clean, isName, isPhone, isSafeText, isZip, MESSAGES } from "../Utils/validators.js";

const usersProfileController = {};

usersProfileController.getCurrentUser = async (req, res) => {
  try {
    console.log("📍 GET /me - User ID:", req.user?.id);

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ Usuario encontrado:", user.email);
    return res.status(200).json(user);
  } catch (error) {
    console.log("❌ Error getting current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

usersProfileController.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Validaciones (el correo no se cambia desde el perfil)
    if (fullName !== undefined && !isName(fullName)) {
      return res.status(400).json({ message: MESSAGES.name });
    }
    if (phone && !isPhone(phone)) {
      return res.status(400).json({ message: MESSAGES.phone });
    }
    if (location && !isSafeText(location, 3, 120)) {
      return res.status(400).json({ message: "La ubicación debe tener entre 3 y 120 caracteres válidos" });
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = clean(fullName);
    if (phone !== undefined) updateData.phone = clean(phone);
    if (location !== undefined) updateData.location = clean(location);

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ Perfil actualizado:", updatedUser.email);
    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.log("❌ Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* =========================
   DIRECCIONES GUARDADAS
========================= */
const pickAddress = (body) => ({
  label: clean(body.label) || "Casa",
  fullName: clean(body.fullName),
  address: clean(body.address),
  city: clean(body.city),
  zip: clean(body.zip),
  phone: clean(body.phone),
});

// Devuelve el mensaje de error o null si la direccion es valida
const addressError = (a) => {
  if (!isSafeText(a.label, 2, 30)) return "La etiqueta debe tener entre 2 y 30 caracteres válidos";
  if (!isName(a.fullName)) return MESSAGES.name;
  if (!isSafeText(a.address, 5, 150)) return "La dirección debe tener entre 5 y 150 caracteres válidos";
  if (!isName(a.city, 2, 50)) return "La ciudad solo puede tener letras y espacios";
  if (a.zip && !isZip(a.zip)) return MESSAGES.zip;
  if (!isPhone(a.phone)) return MESSAGES.phone;
  return null;
};

// Deja una sola direccion predeterminada
const setDefault = (user, addressId) => {
  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === addressId.toString();
  });
};

usersProfileController.getAddresses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("addresses");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json(user.addresses);
  } catch (error) {
    console.log("Error getAddresses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

usersProfileController.addAddress = async (req, res) => {
  try {
    const data = pickAddress(req.body);
    const invalid = addressError(data);
    if (invalid) {
      return res.status(400).json({ message: invalid });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.addresses.push(data);
    const added = user.addresses[user.addresses.length - 1];
    if (req.body.isDefault || user.addresses.length === 1) setDefault(user, added._id);

    await user.save();
    return res.status(201).json({ message: "Dirección guardada", addresses: user.addresses });
  } catch (error) {
    console.log("Error addAddress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

usersProfileController.updateAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Dirección no encontrada" });

    const data = pickAddress({ ...address.toObject(), ...req.body });
    const invalid = addressError(data);
    if (invalid) {
      return res.status(400).json({ message: invalid });
    }

    Object.assign(address, data);
    if (req.body.isDefault) setDefault(user, address._id);

    await user.save();
    return res.status(200).json({ message: "Dirección actualizada", addresses: user.addresses });
  } catch (error) {
    console.log("Error updateAddress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

usersProfileController.deleteAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Dirección no encontrada" });

    const wasDefault = address.isDefault;
    address.deleteOne();
    if (wasDefault && user.addresses.length) setDefault(user, user.addresses[0]._id);

    await user.save();
    return res.status(200).json({ message: "Dirección eliminada", addresses: user.addresses });
  } catch (error) {
    console.log("Error deleteAddress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default usersProfileController;