"use client";
import { useEffect, useState } from "react";
import styles from "../donationFail.module.css";
import axios from "axios";
import jsPDF from "jspdf";
import { renderField } from "@/validation";

export default function page({ params }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_serverAPI}/donate/donation/${params.id}`
        );
        setData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(12);

  //   // Adding the header with the image
  //   const logo = new Image();
  //   logo.src = "/images/logo.png"; // Path to your logo image
  //   logo.onload = () => {
  //     doc.addImage(logo, "PNG", 10, 10, 50, 20); // Adjust the position and size of the logo
  //     doc.setFontSize(16);
  //     doc.text("Donation Details", 70, 20);

  //     const tableData = [
  //       ["Transaction Status", "Failed"],
  //       ["Transaction Reference Number", data.reference_payment || ""],
  //       ["Transaction Date & Time", data.created_at || "--"],
  //       ["Mode Of Payment", data.payment_method || "--"],
  //       ["Email", data.donor_email || "--"],
  //       ["Phone Number", data.donor_phone || "--"],
  //       ["Payment Amount (₹)", data.amount || "--"],
  //       ["Receipt", "Download Receipt"],
  //     ];

  //     let startY = 40;
  //     tableData.forEach((row, index) => {
  //       doc.text(row[0], 20, startY + index * 10);
  //       doc.text(row[1], 100, startY + index * 10);
  //     });

  //     // Adding the "Thank you for donation" message
  //     doc.setFontSize(14);
  //     doc.text(
  //       "Thank you for your donation",
  //       20,
  //       startY + tableData.length * 10 + 20
  //     );

  //     doc.save("donation-details.pdf");
  //   };
  // };

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
                    {renderField(data.reference_payment)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Transaction Date & Time</th>
                  <td className={styles.tableColumn}>
                    {renderField(data.created_at)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Mode Of Payment</th>
                  <td className={styles.tableColumn}>
                    {renderField(data.payment_method)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Email</th>
                  <td className={styles.tableColumn}>
                    {renderField(data.donor_email)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Phone Number</th>
                  <td className={styles.tableColumn}>
                    {renderField(data.donor_phone)}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Payment Amount (&#8377;)</th>
                  <td className={styles.tableColumn}>
                    {renderField(data.amount)}
                  </td>
                </tr>
                {/* <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Receipt:</th>
                  <td className={styles.tableColumn}>
                    <a
                      href=""
                      // onClick={generatePDF}
                      className={styles.tableLink}
                    >
                      Download Receipt
                    </a>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className={styles.groupbtn}>
            <button type="submit" className={styles.donateBtn}>
              <a href="/donation">Make Another Donation</a>
            </button>
            <button
              type="submit"
              className={`${styles.donateBtn} ${styles.filled}`}
            >
              <a href="https://supportourheroes.in/">Done</a>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
