import Settings from "../models/Settings.js";

const getSettingsDocument = async (userId) => {
  if (!userId) throw new Error("User ID is missing from request");

  return await Settings.findOneAndUpdate(
    { createdBy: userId },
    { $setOnInsert: { createdBy: userId, councilMembers: [], audits: [], units: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const getSettings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: Invalid Token" });

    const settings = await getSettingsDocument(userId);
    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings Fetch Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const addCouncilMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    const userId = req.user?._id || req.user?.id;
    const settings = await getSettingsDocument(userId);
    
    settings.councilMembers.push({ name, position });
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Add failed", error: error.message });
  }
};

export const deleteCouncilMember = async (req, res) => {
  try {
    const { index } = req.params;
    const userId = req.user?._id || req.user?.id;
    const settings = await Settings.findOne({ createdBy: userId });
    
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    settings.councilMembers.splice(parseInt(index), 1);
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error: error.message });
  }
};

export const addAudit = async (req, res) => {
  try {
    const { name, position } = req.body;
    const userId = req.user?._id || req.user?.id;
    const settings = await getSettingsDocument(userId);
    settings.audits.push({ name, position });
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Add failed", error: error.message });
  }
};

export const deleteAudit = async (req, res) => {
  try {
    const { index } = req.params;
    const userId = req.user?._id || req.user?.id;
    const settings = await Settings.findOne({ createdBy: userId });
    settings.audits.splice(parseInt(index), 1);
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error: error.message });
  }
};

export const addUnit = async (req, res) => {
  try {
    const { unit } = req.body;
    const userId = req.user?._id || req.user?.id;
    const settings = await getSettingsDocument(userId);
    
    if (!settings.units.includes(unit)) {
      settings.units.push(unit);
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Add failed", error: error.message });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const { unit } = req.params;
    const userId = req.user?._id || req.user?.id;
    const settings = await Settings.findOne({ createdBy: userId });
    settings.units = settings.units.filter(u => u !== unit);
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error: error.message });
  }
};