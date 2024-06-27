"use client";
import { useEffect, useState } from "react";
import styles from "../donationFail.module.css";
import axios from "axios";
import { renderField } from "@/validation";
import "jspdf-autotable";
import jsPDF from "jspdf";
import moment from "moment-timezone";
import Loading from "@/app/loading";
export default function page({ params }) {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_serverAPI}/donate/donation/${params.id}`
        );
        setData(() => response.data?.data);
       } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const convertUTCToIST = (utcDateString) => {
    return moment
      .utc(utcDateString)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");
  };
  useEffect(() => {
    if (data?.payment_status == "success") {
      window.location.href = `${process.env.NEXT_PUBLIC_frontEndAPI}/thank-you/${params.id}`;
    }
   }, [data]);
  return (
    <>
      <main className={styles.mainClass}>
        <section className={styles.pageSection}>
          <h1>Donation Details</h1>
          <div className={styles.message}>
            <div className={styles.successIcon}>
              <img
                src="/images/FailedIcon.png"
                alt="Success Icon"
                width="70"
                height="70"
                className={styles.successImg}
              />
            </div>
            <div className={styles.successMessage}>
              <h2>
                We’re sorry, your donation failed to process. Please try again
                shortly, or contact us at (inquiry.soh@gmail.com) if the problem
                persists.{" "}
              </h2>
            </div>
          </div>
          <div className={styles.successTable}>
            <table className={styles.pageTable}>
              <tbody className={styles.tableBody}>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Transaction Status</th>
                  <td className={`${styles.tableColumn} ${styles.red}`}>
                    Failed
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>
                    Transaction Reference Number
                  </th>
                  <td className={styles.tableColumn}>
                    {renderField(data?.reference_payment)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Transaction Date & Time</th>
                  <td className={styles.tableColumn}>
                    {data?.created_at &&
                      renderField(convertUTCToIST(data?.created_at))}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Mode Of Payment</th>
                  <td className={styles.tableColumn}>
                    {renderField(data?.payment_method)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Email</th>
                  <td className={styles.tableColumn}>
                    {renderField(data?.donor_email)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Phone Number</th>
                  <td className={styles.tableColumn}>
                    {renderField(data?.donor_phone)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Payment Amount (&#8377;)</th>
                  <td className={styles.tableColumn}>
                    {renderField(data?.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.groupbtn}>
            <button type="submit" className={styles.donateBtn}>
              <a href={`${process.env.NEXT_PUBLIC_frontEndAPI}/summary`}>
                Try Donation Again
              </a>
            </button>
            <button
              type="submit"
              className={`${styles.donateBtn} ${styles.filled}`}
            >
              <a href="https://supportourheroes.in">Done</a>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
