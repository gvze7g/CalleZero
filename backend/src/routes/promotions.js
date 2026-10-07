import express from "express";
import promotionsController from "../controller/promotionsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(verifyToken);

router.post("/validate", promotionsController.validate);

router.get("/", isAdmin, promotionsController.getAll);
router.post("/", isAdmin, promotionsController.create);
router.put("/:id", isAdmin, promotionsController.update);
router.delete("/:id", isAdmin, promotionsController.remove);

export default router;
