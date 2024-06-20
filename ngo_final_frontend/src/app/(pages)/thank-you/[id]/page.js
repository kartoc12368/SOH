"use client";
import axios from "axios";
import styles from "../thank.module.css";
import { useEffect, useState } from "react";
import { renderField } from "@/validation";
export default function Page({ params }) {
  const [data, setData] = useState([]);

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

  //   doc.text("Donation Details", 20, 10);

  //   const tableData = [
  //     ["Transaction Status", "Failed"],
  //     ["Transaction Reference Number", data.reference_payment || "--"],
  //     ["Transaction Date & Time", data.created_at || "--"],
  //     ["Mode Of Payment", data.payment_method || "--"],
  //     ["Email", data.donor_email || "--"],
  //     ["Phone Number", data.donor_phone || "--"],
  //     ["Payment Amount (₹)", data.amount || "--"],
  //   ];

  //   let startY = 20;
  //   tableData.forEach((row, index) => {
  //     doc.text(row[0], 20, startY + index * 10);
  //     doc.text(row[1], 100, startY + index * 10);
  //   });

  //   doc.save("donation-details.pdf");
  // };

  return (
    <>
      <main className={styles.mainClass}>
        <section className={styles.pageSection}>
          <h1>Donation Details</h1>
          <div className={styles.message}>
            <div className={styles.successIcon}>
              <img
                src="/images/Success-Icon.png"
                alt="Success Icon"
                width="70"
                height="70"
                className={styles.successImg}
              />
            </div>
            <div className={styles.successMessage}>
              <h2>
                Thank you for your generous contribution! Your donation will
                directly support our heroes in need. Together, we can ensure
                they receive the timely help they deserve. If you have opted for
                80G certificate, it will be sent to you within 48 hours.
              </h2>
            </div>
          </div>
          <div className={styles.successTable}>
            <table className={styles.pageTable}>
              <tbody className={styles.tableBody}>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHead}>Transaction Status</th>
                  <td className={`${styles.tableColumn} ${styles.green}`}>
                    Success
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
