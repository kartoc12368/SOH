"use client";
import { TopHeader } from "@/component/fundraiser/fundraiserSidebar";
import styles from "./dashboard.module.css";
import AsideBar from "@/component/fundraiser/fundraiserSidebar";
import useAuth from "@/context/auth";
import { useContext } from "react";
import { FundraiserContext } from "@/context/FundraiserContext";
import Loading from "@/app/loading";
import Swal from "sweetalert2";

export default function Dashboard() {
  const { user } = useAuth("FUNDRAISER");

  const fundraiserCtx = useContext(FundraiserContext);
  return user && fundraiserCtx ? (
    <>
      {Swal.close()}

      <TopHeader
        link={`${fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page?.id}`}
      />
      <aside className={styles.aside}>
        <AsideBar />
        {fundraiserCtx.fundraiser ? (
          <div className={styles.rightAside}>
            <div className={styles.upperPortion}>
              <h2>Welcome to your Support our Heroes Account!</h2>
            </div>
            <div className={styles.lowerPortion}>
              <div className={styles.donors}>
                <div className={styles.totalRaise}>
                  <p>
                    <img src="/images/Frame 269.png"></img>
                    Total Amount Raised
                  </p>
                  <p
                    className={styles.amtMoney}
                    style={{ marginTop: "0.625rem", marginLeft: "4.7rem" }}
                  >
                    &#8377; {fundraiserCtx.fundraiser.dashboard_data?.amount}
                    {/* // .fundraiser.total_amount_raised */}
                  </p>
                </div>
                <div className={styles.totalDonors}>
                  <p>
                    <img src="/images/Frame 268.png"></img>
                    No. of Donors
                  </p>
                  <p
                    className={`${styles["no-donor"]}`}
                    style={{ marginTop: "0.625rem", marginLeft: "4.7rem" }}
                  >
                    {fundraiserCtx.fundraiser.dashboard_data?.totalDonor}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </aside>
    </>
  ) : (
    <Loading />
  );
}
