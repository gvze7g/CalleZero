import express from "express";
import adminRoutes from "./src/routes/administrador.js"
import categoriesRoutes from "./src/routes/categories.js"
import orderRoutes from "./src/routes/orders.js"
import productRoute from "./src/routes/productRoute.js"
import limiter from "./src/middlewares/rate-middle.js";
import cookieParser from "cookie-parser";
import usersRoute from "./src/routes/UsersRoute.js"
import registerUsers from './src/routes/registerUserRoute.js'
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import loginUsersRoutes from "./src/routes/loginUser.js";
import logoutRoutes from "./src/routes/logout.js"
import adminUsersRoutes from "./src/routes/adminUsersRoutes.js"
import recoveryAdminRoutes from "./src/routes/recoveryAdminRoutes.js"
import recoveryUsersRoutes from "./src/routes/recoveryUserRoutes.js"
import userProfileRoutes from "./src/routes/userProfile.js"
import promotionsRoutes from "./src/routes/promotions.js"
import notificationsRoutes from "./src/routes/notifications.js"
import contactRoutes from "./src/routes/contact.js"
import cors from "cors";
import { config } from "./src/config.js";


const app = express();

// Origenes web permitidos (webs locales + ALLOWED_ORIGINS)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    ...config.server.allowedOrigins,
];

// Necesario detras del proxy del hosting (rate limit por IP)
app.set("trust proxy", 1);

app.use(cors({
    origin: (origin, callback) => {
        // Sin origin = app movil o Postman
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        const error = new Error(`Origen no permitido por CORS: ${origin}`);
        error.status = 403;
        return callback(error);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ status: "ok", name: "Calle Zero API" }));

// Limitar intentos en las rutas de autenticacion
app.use([
    "/api/loginUser",
    "/api/loginAdmin",
    "/api/registerUser",
    "/api/admin/recovery",
    "/api/users/forgot-password",
    "/api/users/verify-recovery-code",
    "/api/users/verify-code",
    "/api/contact",
], limiter);

app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/product", productRoute);
app.use("/api/user", usersRoute);
app.use("/api/registerUser", registerUsers);
app.use("/api/loginUser", loginUsersRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/users", recoveryUsersRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/recovery", recoveryAdminRoutes);
// Al final para no capturar /api/admin/users ni /api/admin/recovery
app.use("/api/admin", adminRoutes);

// Errores no controlados
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

export default app;
