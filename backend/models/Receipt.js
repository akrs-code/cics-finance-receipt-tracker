import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const CertifiedBySchema = new mongoose.Schema({
    name: { type: String, default: "" },
});

const ReceiptSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    date: { type: String, required: true },
    receipt_no: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    pdfUrl: { type: String, default: null },
    driveFileId: { type: String, default: null },
    purpose: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    certifiedBy: { type: CertifiedBySchema, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true })

export default mongoose.model("Receipt", ReceiptSchema)