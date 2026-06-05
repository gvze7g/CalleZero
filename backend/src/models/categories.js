import { Schema, model } from "mongoose";

const CategoriesSchema = new Schema({
    name: {type: String},
    description: {type: String},
    isActive: {type: Boolean}
}, {
    timestamps: true,
    strict: false
})

export default model("Categories", CategoriesSchema);
