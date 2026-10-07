import { Schema, model } from "mongoose";

// Codigos promocionales para el carrito
const PromotionsSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    discountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    maxUses: { type: Number, default: 0 }, // 0 = ilimitado
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
})

export default model("Promotions", PromotionsSchema);
