import mongoose, {Schema, model} from "mongoose"

const ProductsSchema = new Schema({
    name: {type: String},
    price: {type: Number},
    description: {type: String},
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Categories"
    },
    stock: {type: Number},
    size: [String],
    imageUrl: [String],
    isActive: {type: Boolean},
}, {
    timestamps: true,
    strict: false
})
export default model("Products", ProductsSchema)