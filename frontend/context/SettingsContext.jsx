import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import * as api from "../api/api";

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [audits, setAudits] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchSettings = async () => {
    const token = getToken();
    if (!token || !user) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.getSettings(token);
      setCouncilMembers(res.data.councilMembers || []);
      setAudits(res.data.audits || []);
      setUnits(res.data.units || []);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const handleAddMember = async (data) => {
    const res = await api.addCouncilMember(data, getToken());
    setCouncilMembers(res.data.councilMembers);
  };

  const handleDeleteMember = async (index) => {
    const res = await api.deleteCouncilMember(index, getToken());
    setCouncilMembers(res.data.councilMembers);
  };

  const handleAddAudit = async (data) => {
    const res = await api.addAudit(data, getToken());
    setAudits(res.data.audits);
  };

  const handleDeleteAudit = async (index) => {
    const res = await api.deleteAudit(index, getToken());
    setAudits(res.data.audits);
  };

  const handleAddUnit = async (unitName) => {
    const res = await api.addUnit({ unit: unitName }, getToken());
    setUnits(res.data.units);
  };

  const handleDeleteUnit = async (unitName) => {
    const res = await api.deleteUnit(unitName, getToken());
    setUnits(res.data.units);
  };

  return (
    <SettingsContext.Provider value={{
      councilMembers, audits, units, loading,
      handleAddMember, handleDeleteMember,
      handleAddAudit, handleDeleteAudit,
      handleAddUnit, handleDeleteUnit,
      refreshSettings: fetchSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};