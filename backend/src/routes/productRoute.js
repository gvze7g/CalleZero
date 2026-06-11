import express from "express";
import productController from "../controller/productController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Crear carpeta de uploads si no existe
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes: JPEG, PNG, WEBP"));
    }
  },
});

router
  .route("/")
  .get(productController.getAll)
  .post(upload.single("file"), productController.InsertProducts); // ← CAMBIAR A "file"

router
  .route("/:id")
  .get(productController.getProductById)
  .put(upload.single("file"), productController.updateProduct) // ← CAMBIAR A "file"
  .delete(productController.deleteProduct);

export default router;