import express from "express";
import productController from "../controller/productController.js";
import upload from "../Utils/cloudinaryConfig.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router
  .route("/")
  .get(productController.getAll)
  .post(
    upload.single("image"),
    productController.InsertProducts
  );

router
  .route("/:id")
  .get(productController.getProductById)
  .put(
    upload.single("image"),
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

export default router;