import express from "express";
import productController from "../controller/productController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(productController.getAll)
  .post(upload.single("image"), productController.InsertProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(upload.single("image"), productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;