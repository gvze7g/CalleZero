import { Schema, model } from "mongoose";

// audience: "user" (un cliente), "users" (todos los clientes) o "admin" (panel)
const NotificationsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users", default: null },
    audience: { type: String, enum: ["user", "users", "admin"], default: "user" },
    type: { type: String, enum: ["order", "promo", "user", "stock", "system"], default: "system" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }]
}, {
    timestamps: true
})

export default model("Notifications", NotificationsSchema);
