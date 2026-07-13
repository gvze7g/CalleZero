import mongoose, { Schema, model } from "mongoose";

const ordersSchema = new Schema(
    {
        UsersId: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
        },
        items: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Products",
                },
                name: { type: String },
                quantity: { type: Number },
                size: { type: String },
                price: { type: Number },
            },
        ],
        totalAmount: { type: Number },
        OrderStatus: {
            type: String,
            enum: ["Pendiente", "Procesando", "Enviado", "Completado"],
            default: "Pendiente",
        },
        PaymentMethod: { type: String },
        ShippingAddress: { type: String },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Orders", ordersSchema);