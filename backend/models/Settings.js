import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  councilMembers: [{ name: { type: String, required: true }, position: { type: String, required: true } }],
  audits: [{ name: { type: String, required: true }, position: { type: String, required: true } }],
  units: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Settings", SettingsSchema);