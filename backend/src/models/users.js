import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
    fullName: { 
        type: String, 
        required: true 
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
    role: { 
        type: Schema.Types.ObjectId, 
        ref: "Role",
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
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