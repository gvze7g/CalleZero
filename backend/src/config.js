import dotenv from "dotenv"


dotenv.config()

export const config = {
    db:{
        URI: process.env.DB_URI
    },
    server: {
        port: process.env.PORT || 4000,
        isProduction: process.env.NODE_ENV === "production",
        // Origenes web permitidos por CORS, separados por coma
        allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
            .split(",")
            .map((origin) => origin.trim().replace(/\/$/, ""))
            .filter(Boolean)
    },
    JWT:{
        secret: process.env.JWT_SECRET_KEY
    },
    mailjet:{
        apiKey: process.env.MAILJET_API_KEY,
        secretKey: process.env.MAILJET_SECRET_KEY,
        senderEmail: process.env.MAILJET_SENDER_EMAIL,
        senderName: process.env.MAILJET_SENDER_NAME || "Calle Zero"
    },

    cloudinary:{
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,     
        api_key: process.env.CLOUDINARY_API_KEY,             
        api_secret: process.env.CLOUDINARY_API_SECRET         
    },
}

if (!config.db.URI || !config.JWT.secret) {
    throw new Error("Faltan variables de entorno: DB_URI y JWT_SECRET_KEY son obligatorias");
}
