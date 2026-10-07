import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String,
        default: ""
    },
    location: { 
        type: String,
        default: ""
    },
    recoveryCode: {
        type: String,
        default: null
    },
    recoveryCodeExpiry: {
        type: Date,
        default: null
    },
    addresses: [{
        label: { type: String, default: "Casa" },
        fullName: { type: String, default: "" },
        address: { type: String, required: true },
        city: { type: String, default: "" },
        zip: { type: String, default: "" },
        phone: { type: String, default: "" },
        isDefault: { type: Boolean, default: false }
    }],
    role: {
        type: Schema.Types.ObjectId, 
        ref: "Role"
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    timeOut: {
        type: Date,
        default: null
    },
    lastActivity: { 
        type: Date, 
        default: Date.now 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Users", UsersSchema);