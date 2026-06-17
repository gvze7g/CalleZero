import express from "express";
import {
  getCategories,
  deleteCategories,
  insertCategories,
  updateCategories,
} from "../controller/categoriesController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(verifyToken, insertCategories);

router
  .route("/:id")
  .put(verifyToken, updateCategories)
  .delete(verifyToken, deleteCategories);

export default router;