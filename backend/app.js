import express from "express";
import adminRoutes from "../backend/src/routes/administrador.js"
import categoriesRoutes from "../backend/src/routes/categories.js"
import orderRoutes from "../backend/src/routes/orders.js"
import productRoute from "./src/routes/productRoute.js"
import promotionRoute from "./src/routes/promotionRoute.js"
import limiter from "./src/middlewares/rate-middle.js";
import cookieParser from "cookie-parser";
import usersRoute from "./src/routes/UsersRoute.js"
import registerUsers from './src/routes/registerUserRoute.js'
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import loginUsersRoutes from "./src/routes/loginUser.js";
import logoutRoutes from "./src/routes/logout.js"
import adminUsersRoutes from "./src/routes/adminUsersRoutes.js"
import recoveryAdminRoutes from "./src/routes/recoveryAdminRoutes.js"
import cors from "cors";

const app = express();

console.log("✅ app.js cargado");

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/product", productRoute);
app.use("/api/promotion", promotionRoute);
app.use("/api/user",usersRoute);
app.use("/api/registerUser", registerUsers);
app.use("/api/loginAdmin", loginAdminRoutes);
app.use("/api/loginUsers", loginUsersRoutes);
app.use("/api/logout", logoutRoutes)
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/recovery", recoveryAdminRoutes);

console.log("✅ Todas las rutas registradas");
console.log("✅ /api/loginAdmin disponible");

export default app;