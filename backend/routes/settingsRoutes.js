import express from "express";
import {
  getSettings,
  addCouncilMember, deleteCouncilMember,
  addAudit, deleteAudit,
  addUnit, deleteUnit
} from "../controllers/settingsContoller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSettings);
router.post("/council-member", authMiddleware, addCouncilMember);
router.delete("/council-member/:index", authMiddleware, deleteCouncilMember);
router.post("/audit", authMiddleware, addAudit);
router.delete("/audit/:index", authMiddleware, deleteAudit);
router.post("/unit", authMiddleware, addUnit);
router.delete("/unit/:unit", authMiddleware, deleteUnit);

export default router;