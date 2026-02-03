import Receipt from "../models/Receipt.js";

export const createReceipt = async (req, res) => {
    try {
        if (!req.user) return res.status(400).json({ error: "Unauthorized Access" })

        const { name, position, date, receipt_no, items, purpose, certifiedBy, category } = req.body;

        if (!name || !position || !date || !receipt_no || !items || items.length === 0 || !purpose || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }

        for (const item of items) {
            if (!item.name || item.amount == null || item.quantity == null) {
                return res.status(400).json({ error: "Each item must have name, amount, and quantity" });
            }
        }

        const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);


        const receipt = await Receipt.create({
            name,
            position,
            date,
            receipt_no,
            items,
            totalAmount,
            purpose,
           category: category || "Uncategorized",
            certifiedBy: certifiedBy || {},
            createdBy: req.user._id,
        })

        return res.status(201).json({
            message: "Receipt created successfully",
            receipt,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getReceipts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.date) filter.date = req.query.date;
        if (req.query.receipt_no) filter.receipt_no = req.query.receipt_no;
        if (req.query.name) filter.name = req.query.name;
        if (req.query.category) filter.category = req.query.category;

        const receipts = await Receipt.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            count: receipts.length,
            receipts,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReceiptById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(401).json({ error: "Invalid receipt ID" });
        }
        const receipt = await Receipt.findById(id);
        if (!receipt) return res.status(401).json({ error: "Receipt not found" });

        res.status(200).json({
            message: "Receipt found",
            receipt
        })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

export const updateReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, date, receipt_no, items, purpose, certifiedBy, category } = req.body

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(401).json({ error: "Invalid Receipt ID" })
        };

        const receipt = await Receipt.findById(id)
        if (!receipt) return res.status(401).json({ error: "Receipt Not Found" });

        if (name) receipt.name = name;
        if (position) receipt.position = position;
        if (date) receipt.date = date;
        if (receipt_no) receipt.receipt_no = receipt_no;
        if (certifiedBy) receipt.certifiedBy = certifiedBy;
        if (items && items.length > 0) {
            for (const item of items) {
                if (!item.name || item.amount == null || item.quantity == null) {
                    return res.status(400).json({ error: "Each item must have name, amount, and quantity" });
                }
            }
            if (items && items.length > 0) {
                receipt.items = items;
                receipt.totalAmount = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
            }
            if (purpose) receipt.purpose = purpose;
            if (category) receipt.category = category;

            await receipt.save();

            return res.status(200).json({ message: "Receipt Updated Successfully", receipt })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const deleteReceipt = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid Receipt ID" })
        };

        const receipt = await Receipt.findById(id);
        if (!receipt) return res.status(404).json({ error: "Receipt Not Found" })

        if (req.user && receipt.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Forbidden: cannot delete this receipt" });
        }

        await receipt.deleteOne();

        return res.status(200).json({ message: "Receipt Deleted Successfully" })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}