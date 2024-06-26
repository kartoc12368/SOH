"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useEffect } from "react";

export const refreshContext = createContext();
export default function RefreshContext({ children }) {
  const router = useRouter();
  const refreshToken = Cookies.get("refreshToken");
  const token = Cookies.get("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (refreshToken && !token) {
          const config = {
            headers: {
              refreshToken: refreshToken,
              "Content-Type": "application/json",
            },
          };
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_serverAPI}/auth/refreshToken`,
            config
          );
          const expiryDate = new Date();
          expiryDate.setTime(expiryDate.getTime() + 15 * 60 * 1000);
          Cookies.set("token", response.data.data.token, {
            expires: expiryDate,
          });
        }
      } catch (error) {
        showSwal("error", "Login required", "Please Login").then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      }
    };

    fetchData();
  }, [token, Cookies.get("token"), Cookies.get("refreshToken"), router]);
  return (
    <refreshContext.Provider value={{ token }}>
      {children}
    </refreshContext.Provider>
  );
}
