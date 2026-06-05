import { Schema, model } from "mongoose";

const UserssSchema = new Schema({
   fullName: {type: String},
   email: {type: String},
   Password: {type: String},
   isActive: {type: Boolean},
   createdAt: {type: Date}

}, {
    timestamps: true,
    strict: false
})

export default model("Users", UserssSchema);
