import express from "express";
import ordersController from "../controller/ordersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(verifyToken);

router.get("/mine", ordersController.getMyOrders);
router.post("/", ordersController.insertOrder);

router.get("/", isAdmin, ordersController.getAllOrders);
router.get("/:id", isAdmin, ordersController.getOrderById);
router.put("/:id", isAdmin, ordersController.updateOrder);
router.delete("/:id", isAdmin, ordersController.deleteOrder);

export default router;