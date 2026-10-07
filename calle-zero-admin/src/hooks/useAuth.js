import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api.js";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await apiFetch(
          "/api/loginAdmin/me",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        setAuthenticated(data.authenticated);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return { loading, authenticated };
}