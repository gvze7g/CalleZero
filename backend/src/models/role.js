import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        enum: ["Administrador", "Cliente"]
    },
    description: { 
        type: String 
    },
    permissions: [{
        type: String
    }],
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

export default model("Role", RoleSchema);