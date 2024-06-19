"use client";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
export const FundraiserContext = createContext([]);

export default function FundraiserContextData({ children }) {
  const [fundraiser, setFundraiser] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(() => data);
  }, [Cookies.get("token")]);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser`,
        config
      );
      if (response.status == 200) {
        setFundraiser((oldState) => {
          return {
            ...oldState,
            ...response.data.data,
          };
        });
      } else {
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  useEffect(() => {
    const profile = fundraiser?.fundraiser?.profileImage;
    localStorage.setItem("profile", profile);
  }, [fundraiser]);
  return (
    <FundraiserContext.Provider value={{ fundraiser, fetchData }}>
      {children}
    </FundraiserContext.Provider>
  );
}
