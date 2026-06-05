import { Schema, model } from "mongoose";

const ordersSchema = new Schema({
    UsersId:{
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    promotionsId:{
        type: mongoose.Types.ObjectId,
        ref: "Promotions"
    },
    items: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Products"
            },
            name: {type: String},
            quantity: {type: Number},
            size: {type: Number},
            price: {type: Number}
        }
    ],
    totalAmount: {type: Number},
    Status: {type: Boolean},
    PaymentMethod: {type: String},
    ShippingAddress: {type: String}
}, {
    timestamps: true,
    strict: false
})
export default model("Orders", ordersSchema);
