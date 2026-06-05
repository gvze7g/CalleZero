import express from "express";
import ordersController from "../controller/ordersController.js";

const router = express.Router();

router.route("/")
  .get(ordersController.getAllOrders)
  .post(ordersController.insertOrder);

router.route("/:id")
  .put(ordersController.updateOrder)
  .delete(ordersController.deleteOrder)
  .get(ordersController.getOrderById);

export default router;