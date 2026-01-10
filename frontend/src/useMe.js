import { useEffect, useState } from "react";
import { apiFetch } from "./api";

export const useMe = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // 🔴 DO NOT call /me without token

    apiFetch("/me")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, [token]);

  return user;
};
