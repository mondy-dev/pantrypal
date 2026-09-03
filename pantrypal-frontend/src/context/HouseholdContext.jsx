import { useState, useCallback } from "react";
import * as householdService from "../services/householdService";
import { HouseholdContext } from "./HouseholdContextObject";

export function HouseholdProvider({ children }) {
  const [household, setHousehold] = useState(null);
  const [checked, setChecked] = useState(false);

  const refreshHousehold = useCallback(async () => {
    try {
      const data = await householdService.getMyHousehold();
      setHousehold(data);
      return data;
    } catch (err) {
      setHousehold(null);
      throw err;
    } finally {
      setChecked(true);
    }
  }, []);

  const createHousehold = async (name) => {
    const data = await householdService.createHousehold(name);
    setHousehold(data);
    return data;
  };

  const inviteMember = async (email) => {
    const data = await householdService.inviteMember(email);
    setHousehold(data);
    return data;
  };

  const removeMember = async (userId) => {
    const data = await householdService.removeMember(userId);
    setHousehold(data);
    return data;
  };

  const clearHousehold = () => {
    setHousehold(null);
    setChecked(false);
  };

  const value = {
    household,
    checked,
    hasHousehold: !!household,
    refreshHousehold,
    createHousehold,
    inviteMember,
    removeMember,
    clearHousehold,
  };

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}
