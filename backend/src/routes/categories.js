import express from "express";
import {
  getCategories,
  deleteCategories,
  insertCategories,
  updateCategories,
} from "../controller/categoriesController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(verifyToken, isAdmin, insertCategories);

router
  .route("/:id")
  .put(verifyToken, isAdmin, updateCategories)
  .delete(verifyToken, isAdmin, deleteCategories);

export default router;