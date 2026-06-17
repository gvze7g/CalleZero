import express from "express";
import controllerUsers from "../controller/UsersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(controllerUsers.getAll);

router
  .route("/:id")
  .put(verifyToken, controllerUsers.updateUsers)
  .delete(verifyToken, controllerUsers.deleteUsers);

export default router;