"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import styles from "@/app/admin/donationHistory/donationHistory.module.css";
import Sidebar from "@/component/sidebar";
import useAuth from "@/context/auth";
import moment from "moment-timezone";
import { renderField, showSwal } from "@/validation";
import Unauthorized from "@/app/(pages)/unauthorized/page";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel, MdTimer } from "react-icons/md";
import * as XLSX from "xlsx";
import { GrPowerReset } from "react-icons/gr";

export default function Page() {
  const user = useAuth(["ADMIN"]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [filters, setFilters] = useState({
    to_date: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data);
  }, []);

  useEffect(() => {
    token && fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_serverAPI}/admin/donations/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { to_date: filters.to_date },
        }
      );
      setData(response?.data?.data);
      setLoading(false);
      Swal.close();
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    showSwal("info", "Searching...", "Please wait...");
    fetchData().then(() => Swal.close());
  };

  const handleDownload = () => {
    if (data.length === 0) {
      Swal.fire("No data", "There is no data to download.", "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to download the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, download it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          showSwal("info", "Downloading...", "Please wait...", null, false);

          const ws = XLSX.utils.json_to_sheet(
            data.map((item) => ({
              "Donation Id": item.donation_id_frontend,
              "Donation Date":
                formatDate(item.donation_date) +
                convertUTCToIST(item.created_at),

              "Donor Name":
                item.donor_first_name + " " + (item.donor_last_name || ""),
              "Donor Email": item.donor_email,
              "Donor Phone": item.donor_phone,
              "Fundraiser Name": item.fundraiser
                ? item.fundraiser.firstName
                : "--",
              "Fundraiser Email": item.fundraiser?.email,
              Amount: item.amount,
              "Payment Type": item.payment_type,
              "Payment Status": item.payment_status || "--",
              "Payment Method": item.payment_method || "--",
              "Donor PAN": item.pan,
              "Donor Address": item.donor_address,
              "Donor City": item.donor_city,
              "Donor State": item.donor_state,
              "Donor Country": item.donor_country,
              "Donor Pincode": item.donor_pincode,
            }))
          );

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Donations");

          const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

          const blob = new Blob([wbout], { type: "application/octet-stream" });
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = "DonationData.xlsx";
          a.click();
          URL.revokeObjectURL(downloadUrl);

          Swal.fire({
            title: "Confirm Deletion",
            text: "Did the file download successfully? Do you want to delete the data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
          }).then((confirmResult) => {
            if (confirmResult.isConfirmed) {
              // Collect all donation IDs
              const ids = data.map((item) => item.donation_id);

              // Assuming you have an API endpoint to delete data
              axios
                .delete(`${process.env.NEXT_PUBLIC_serverAPI}/admin/delete`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: { ids },
                })
                .then(() => {
                  Swal.fire(
                    "Deleted!",
                    "Your data has been downloaded and deleted.",
                    "success"
                  );
                  fetchData();
                })
                .catch((error) => {
                  console.error("Error deleting data:", error);
                  showSwal("error", "Oops", "Something went wrong!!");
                });
            } else {
              Swal.fire(
                "Cancelled",
                "Your data is safe and not deleted.",
                "info"
              );
            }
          });
        } catch (error) {
          console.error("Error creating file:", error);
          showSwal("error", "Oops", "Something went wrong!!");
        }
      }
    });
  };

  const reset = () => {
    window.location.reload();
  };

  const convertUTCToIST = (utcDateString) => {
    return moment.utc(utcDateString).tz("Asia/Kolkata").format(" HH:mm:ss");
  };

  return user ? (
    <>
      <section className={styles.section}>
        <Sidebar />
        <div className={styles.rightsection}>
          <h1>Donation Report</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.upperForm}>
              <span className={styles.toDate}>
                <span>To Date</span>
                <br />
                <input
                  type="date"
                  name="to_date"
                  id="to_date"
                  max={new Date().toISOString().split("T")[0]}
                  value={filters.to_date}
                  onChange={handleInputChange}
                />
              </span>
            </div>
            <div className={styles.lowerForm}>
              <div className={styles.reportButton}>
                <button
                  type="reset"
                  onClick={reset}
                  className={styles.formsearchButtonReset}
                >
                  <GrPowerReset /> Reset
                </button>
                <button type="submit" className={styles.formsearchButton}>
                  <i className={`fa-solid fa-magnifying-glass`}></i>
                  Search
                </button>
              </div>
            </div>
          </form>
          <button
            type="button"
            onClick={handleDownload}
            className={styles.downloadExcel}
            // disabled={currentRows.length > 0}
          >
            <i className={`fa-solid fa-file-excel`}></i> Download Excel
          </button>
          <div className={styles.tableMain}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Donation Id</th>
                    <th>Donation Date</th>
                    <th>Donor Details</th>
                    <th>Fundraiser Details</th>
                    <th>Amount</th>
                    <th>Payment info</th>
                    <th>Donation project</th>
                    <th>Payment Type</th>
                    <th>Payment Status</th>
                    <th>Donor PAN</th>
                    <th>Donor Address</th>
                    <th>Donor City</th>
                    <th>Donor State</th>
                    <th>Donor Country</th>
                    <th>Donor Pincode</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((item) => (
                    <tr key={item.donation_id_frontend}>
                      <td>{item.donation_id_frontend}</td>
                      <td>
                        {formatDate(item.donation_date) +
                          convertUTCToIST(item.created_at)}
                      </td>
                      <td>
                        {item.donor_first_name}&nbsp;{item.donor_last_name}
                        <br />
                        {item.donor_email}
                        <br />
                        {item.donor_phone}
                      </td>
                      <td>
                        {item.fundraiser ? item.fundraiser.firstName : "--"}
                        <br />
                        {item.fundraiser?.email}
                      </td>
                      <td>{item.amount}</td>
                      <td>{item.payment_info}</td>
                      <td>
                        {item.donation_activity?.schoolFees
                          ? `school
                          ${item.donation_activity?.schoolFees}`
                          : ""}
                        <br />

                        {item.donation_activity?.medicalCare
                          ? `medicalCare:
                          ${item.donation_activity?.medicalCare}`
                          : ""}
                        <br />
                        {item.donation_activity?.ration
                          ? `ration:
                          ${item.donation_activity?.ration}`
                          : ""}
                        {!item.donation_activity?.schoolFees &&
                          !item.donation_activity?.medicalCare &&
                          !item.donation_activity?.ration &&
                          "--"}
                      </td>
                      <td>{item.payment_type}</td>
                      <td>
                        {item.payment_status ? (
                          item.payment_status === "success" ? (
                            <FaCircleCheck color="#0FA900" />
                          ) : item.payment_status === "failed" ? (
                            <MdCancel color="red" />
                          ) : (
                            <MdTimer />
                          )
                        ) : (
                          "--"
                        )}
                      </td>
                      <td>{renderField(item.pan)}</td>
                      <td>{renderField(item.donor_address)}</td>
                      <td>{renderField(item.donor_city)}</td>
                      <td>{renderField(item.donor_state)}</td>
                      <td>{renderField(item.donor_country)}</td>
                      <td>{renderField(item.donor_pincode)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages !== 0 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${styles.filled}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  ) : (
    <Unauthorized />
  );
}
