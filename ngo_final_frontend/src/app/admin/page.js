"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "../../component/sidebar";
import useAuth from "@/context/auth";
import styles from "./admin.module.css";
import Image from "next/image";
import Loading from "../loading";
import Swal from "sweetalert2";

export default function FundraiserPage() {
  const { user } = useAuth("ADMIN");
  const [allData, setAllData] = useState([]);

  const [token, setToken] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data || "");
  }, [Cookies]);
  const fetchData = async () => {
    if (!token) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_serverAPI}/admin/adminDashboard`,
        config
      );

      if (response.status === 200) {
        setAllData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      console.error("Error while getting data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  return !user && loading ? (
    <Loading />
  ) : (
    <>
      {Swal.close()}
      <section className={styles.section}>
        <Sidebar />
        {user && !loading && allData ? (
          <div className={styles.rightwrapper}>
            <div className={styles.rightmain}>
              <div className={styles.mainbox}>
                <div className={styles.box}>
                  <Image src="/images/coins-hand.svg" width={58} height={58} />
                  <p>
                    <span> &#8377; {allData.totalDonations}/-</span>
                    <span>Total Donation</span>
                  </p>
                </div>
                <div className={`${styles.box} ${styles.secend}`}>
                  <img src="/images/Icon.svg" />
                  {/* icon */}
                  <p>
                    <span> {allData.totalFundraisers}</span>
                    <span>Total Fundraisers</span>
                  </p>
                </div>
                <div className={styles.box}>
                  {/* icon */}

                  <img src="/images/Icon.svg" />
                  <p>
                    <span>{allData.activeFundraisers}</span>
                    <span>Active Fundraisers</span>
                  </p>
                </div>
                <div className={`${styles.box} ${styles.secend}`}>
                  <img src="/images/coins-03.svg" />
                  <p>
                    <span> &#8377; {allData.todayDonations}/-</span>
                    <span>Today’s Donation</span>
                  </p>
                </div>
                <div className={styles.box}>
                  <img src="/images/coins-03.svg" />
                  <p>
                    <span> &#8377; {allData.thisMonthDonations}/-</span>
                    <span>This Month Donation</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
