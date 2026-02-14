import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import mongoose from "mongoose";
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/settings", settingsRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});


mongoose.connect(process.env.MONGO_URI).then(() => console.log("🚀 MongoDB Connected")).catch((err) => console.log(err.message));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));