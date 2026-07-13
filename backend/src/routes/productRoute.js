import express from "express";
import productController from "../controller/productController.js";
import upload from "../Utils/cloudinaryConfig.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Públicas: cualquiera puede ver el catálogo sin estar logueado
router.get("/", productController.getAll);
router.get("/:id", productController.getProductById);

// A partir de aquí, todo exige estar autenticado
router.use(verifyToken);

router.post("/", upload.array("images", 4), productController.InsertProducts);

router
  .route("/:id")
  .put(upload.array("images", 4), productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;