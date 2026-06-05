import express from "express";
import adminRoutes from "../backend/src/routes/administrador.js"
import registerAdminRoutes from "../backend/src/routes/registerAdmin.js"
import categoriesRoutes from "../backend/src/routes/categories.js"
import orderRoutes from "../backend/src/routes/orders.js"

import cors from "cors";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    // permitir el envio de cookies y credenciales
    credentials: true
}))

app.use(cookieParser());

//Que acepte JSON desde postman
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", orderRoutes);

export default app;