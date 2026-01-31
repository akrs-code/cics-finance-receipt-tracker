import express from "express"
import { createReceipt, deleteReceipt, getReceiptById, getReceipts, updateReceipt } from "../controllers/receiptController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/submit", authMiddleware, createReceipt);
router.get("/all", getReceipts);
router.get("/:id", getReceiptById);
router.patch("/:id", updateReceipt);
router.delete("/:id", authMiddleware, deleteReceipt);

export default router