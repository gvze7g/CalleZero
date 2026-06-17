import express from "express";
import ordersController from "../controller/ordersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/")
  .get(verifyToken, ordersController.getAllOrders)
  .post(ordersController.insertOrder);

router.route("/:id")
  .put(verifyToken, ordersController.updateOrder)
  .delete(verifyToken, ordersController.deleteOrder)
  .get(verifyToken, ordersController.getOrderById);

export default router;