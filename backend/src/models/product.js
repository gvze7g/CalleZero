import { Schema, model } from "mongoose";

const ProductsSchema = new Schema({
    name: {type: String},
    price: {type: Number},
    description: {type: String},
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Categories"
    },
    Stock: {type: Number},
    size: [
        {
            0: {type: String},
            1: {type: String},
            2: {type: String}
        }
    ],
    imageUrl: [
        {
            0: {type: String}
        }
    ],
    isActive: {type: Boolean},
}, {
    timestamps: true,
    strict: false
})
export default model("Products", ProductsSchema)