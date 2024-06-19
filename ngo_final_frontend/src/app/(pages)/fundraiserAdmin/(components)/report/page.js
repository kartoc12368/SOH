"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./report.module.css";
import AsideBar, { TopHeader } from "@/component/fundraiser/fundraiserSidebar";
import Cookies from "js-cookie";
import { FundraiserContext } from "@/context/FundraiserContext";
import { renderField, showSwal } from "@/validation";
import Swal from "sweetalert2";
import { GrPowerReset } from "react-icons/gr";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel, MdTimer } from "react-icons/md";
import * as XLSX from "xlsx";
import Unauthorized from "@/app/(pages)/unauthorized/page";
import useAuth from "@/context/auth";

export default function Page() {
  const [data, setData] = useState([]);
  const user = useAuth("FUNDRAISER");
  const [token, setToken] = useState();
  const [filters, setFilters] = useState({
    from_date: null,
    to_date: null,
    donation_id: null,
    payment_option: null,
    payment_status: null,
  });
  const reset = () => {
    setFilters({
      from_date: null,
      to_date: null,
      donation_id: null,
      payment_option: null,
      payment_status: null,
    });
    fetchData();
    // setData(response?.data?.data);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fundraiserCtx = useContext(FundraiserContext);

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data);
  }, []);

  useEffect(() => {
    token && fetchData();
  }, [token]);

  const fetchData = async () => {
    showSwal("info", "Fetching Data", "Please wait...");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/donations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters,
        }
      );
      setData(response?.data?.data);
    } catch (error) {
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
    showSwal("info", "Searching", "Please wait...", null, false);

    fetchData().then(() => {
      Swal.close();
    });
  };

  const handleDownload = () => {
    showSwal("info", "Downloading", "Please wait...", null, false);

    try {
      const ws = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          "Donation Id": item.donation_id_frontend,
          "Donation Date": formatDate(item.donation_date),
          "Donor Name": item.donor_first_name,
          "Donor Email": item.donor_email,
          "Donor Phone": item.donor_phone,
          Amount: item.amount,
          "Donor PAN": item.pan,
          "Donor Address": item.donor_address,
          "Payment Type": item.payment_type || "--",
          "Payment Status": item.payment_status || "--",
          "Donor City": item.donor_city,
          "Donor State": item.donor_state,
          "Donor Country": item.donor_country,
          "Donor Pincode": item.donor_pincode,
          "Donor Bank": item.donor_bank_name,
          "Donor Bank-branch": item.donor_bank_branch,
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

      Swal.close();
    } catch (error) {
      console.error("Error creating file:", error);
      showSwal("error", "Oops!", "Something went wrong!!");
    }
  };

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

  return (
    <>
      {user ? (
        <>
          <TopHeader
            link={`${fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page?.id}`}
          />
          <aside className={styles.aside}>
            <AsideBar />
            <div className={styles.rightAside}>
              <h1>Donation Report</h1>
              <form className={styles.form}>
                <div className={styles.upperForm}>
                  <span className={styles.fromDate}>
                    <span>From Date</span>
                    <br />
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      name="from_date"
                      id="from_date"
                      value={filters.from_date}
                      onChange={handleInputChange}
                    />
                  </span>
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
                  <span>
                    <span>Donation Id</span>
                    <br />
                    <input
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                      type="text"
                      name="donation_id"
                      id="donation_id"
                      value={filters.donation_id}
                      onChange={handleInputChange}
                    />
                  </span>
                  <span>
                    <label htmlFor="payment_option">Payment Option</label>
                    <br />
                    <select
                      id="payment_option"
                      name="payment_option"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Method</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </span>
                </div>
                <div className={styles.lowerForm}>
                  <p>
                    <label htmlFor="payment_status">Payment Status</label>
                    <br />
                    <select
                      id="payment_status"
                      name="payment_status"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </p>
                  <div className={styles.reportButton}>
                    <button
                      type="reset"
                      onClick={reset}
                      className={styles.formsearchButtonReset}
                    >
                      <GrPowerReset /> Reset
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className={styles.formsearchButton}
                    >
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
              >
                <i className={`fa-solid fa-file-excel`}></i> Download Excel
              </button>
              {data && Swal.close()}
              <div className={styles.tableMain}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Donation Id</th>
                      <th>Donation Date</th>
                      <th>Donor Details</th>
                      <th>Amount</th>
                      <th>Donor PAN</th>
                      <th>Donor Address</th>
                      <th>Payment Type</th>
                      <th>Payment Status</th>
                      <th>Donor City</th>
                      <th>Donor State</th>
                      <th>Donor Country</th>
                      <th>Donor Pincode</th>
                      <th>Donor Bank</th>
                      <th>Donor Bank-branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows?.map((item) => (
                      <tr key={item.donation_id_frontend}>
                        <td>{item.donation_id_frontend}</td>
                        <td>{formatDate(item.donation_date)} </td>
                        <td>
                          {item.donor_first_name}
                          <br />
                          {item.donor_email}
                          <br />
                          {item.donor_phone}
                        </td>
                        <td>{renderField(item.amount)}</td>
                        <td>{renderField(item.pan)}</td>
                        <td>{renderField(item.donor_address)}</td>
                        <td>{item.payment_type ? item.payment_type : "--"}</td>
                        <td>
                          {item.payment_status ? (
                            item.payment_status == "success" ? (
                              <FaCircleCheck color="#0FA900" />
                            ) : item.payment_status == "failed" ? (
                              <MdCancel color="red" />
                            ) : (
                              <MdTimer />
                            )
                          ) : (
                            "--"
                          )}
                        </td>
                        <td>{renderField(item.donor_city)}</td>
                        <td>{renderField(item.donor_state)}</td>
                        <td>{renderField(item.donor_country)}</td>
                        <td>{renderField(item.donor_pincode)}</td>
                        <td>{renderField(item.donor_bank_name)}</td>
                        <td>{renderField(item.donor_bank_branch)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length > 0 ? (
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
              ) : (
                ""
              )}
            </div>
          </aside>
        </>
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
