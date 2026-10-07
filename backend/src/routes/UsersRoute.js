import express from "express";
import controllerUsers from "../controller/UsersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router
  .route("/")
  .get(controllerUsers.getAll);

router
  .route("/:id")
  .put(controllerUsers.updateUsers)
  .delete(controllerUsers.deleteUsers);

export default router;
