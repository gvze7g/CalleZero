import express from "express";
import notificationsController from "../controller/notificationsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", notificationsController.getMine);
router.put("/read-all", notificationsController.readAll);
router.put("/:id/read", notificationsController.readOne);

export default router;
