"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./fundraisersAdmin.module.css";
import useAuth from "@/context/auth";
import Sidebar from "@/component/sidebar";
import { FaRegPenToSquare } from "react-icons/fa6";
import Loading from "@/app/loading";
import { showSwal } from "@/validation";

export default function FundraiserPage() {
  const { user } = useAuth("ADMIN");
  const [popupActive, setpopupActive] = useState(false);
  const [fundraisers, setFundraisers] = useState([]);
  const [displayedFundraisers, setDisplayedFundraisers] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [amountError, setAmountError] = useState("");

  const [loading, setLoading] = useState(false);
  const [header, setheader] = useState();
  const [formData, setFormData] = useState({
    name: selectedFundraiser?.firstName || "",
    email: selectedFundraiser?.email || "",
    resolution: "",
    story: "",
    money_raised_for: "",
    target_amount: selectedFundraiser?.fundraiser_page?.target_amount || "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(fundraisers.length / itemsPerPage);

  const handleSubmit = async (e) => {
    showSwal("info", "Updating", "Please wait...", null, false);
    e.preventDefault();

    if (formData.target_amount <= 0) {
      setAmountError("Amount must be greater than 0");
      return;
    } else {
      setAmountError("");
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_serverAPI}/admin/fundraiserPage/updatePage/${selectedFundraiser.fundraiser_page?.id}`,
        formData,
        { headers: header }
      );

      setLoading(false);
      showSwal("success", "Updated", "Fundraiser Page Updated Successfully");

      setShowPopup(false);
    } catch (error) {
      showSwal("error", "Oops", "Something went wrong");

      setLoading(false);

      console.error("Error Updating Fundraiser:", error);
    }
  };

  useEffect(() => {
    if (selectedFundraiser) {
      setFormData({
        name: selectedFundraiser?.firstName || "",
        target_amount: selectedFundraiser?.fundraiser_page?.target_amount || "",
        email: selectedFundraiser?.email || "",
        resolution: selectedFundraiser?.fundraiser_page?.resolution || "",
        story: selectedFundraiser?.fundraiser_page?.story || "",
        money_raised_for:
          selectedFundraiser?.fundraiser_page?.money_raised_for || "",
      });
    }
  }, [selectedFundraiser]);

  useEffect(() => {
    const token = Cookies.get("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setheader(headers);

    const fetchData = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_serverAPI}/admin/fundraiser`,
          config
        );
        setLoading(false);
        setFundraisers(response.data.data);
      } catch (error) {
        setLoading(false);
        showSwal("error", "oops", "Something went wrong");

        setError("Error fetching fundraisers. Please try again later.");
        console.error("Error fetching fundraisers:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedFundraisers(
      fundraisers.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [currentPage, fundraisers]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return !user && loading ? (
    <Loading />
  ) : (
    <>
      {showPopup && (
        <div className={`${styles.popup} ${styles.popupOpen}`}>
          <div className={styles.hero}>
            <h1 style={{ paddingBottom: "1em" }}>Edit Fundraiser Details</h1>
            <div className={styles.popupfundraiserDetail}>
              <span>
                <span>ID</span>
                <br />
                <input
                  type="text"
                  name="fundraiserId"
                  id="fundraiserId"
                  placeholder="Enter your fundraiser Id"
                  value={selectedFundraiser?.fundraiser_page?.id}
                  disabled
                />
              </span>

              <span>
                <span>Name</span>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </span>
              <span>
                <span>Email</span>
                <br />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={selectedFundraiser.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled
                />
              </span>

              <span>
                <span>Target Amount</span>
                <br />
                <input
                  type="number"
                  name="target_amount"
                  id="target_amount"
                  placeholder="Target Amount"
                  value={formData?.target_amount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setFormData({ ...formData, target_amount: value });
                    setAmountError(
                      value <= 0 ? "Amount must be greater than 0" : ""
                    );
                  }}
                />
                {amountError && (
                  <span style={{ color: "red" }} className={styles.error}>
                    {amountError}
                  </span>
                )}
              </span>
            </div>
            <div className={styles.popupthirdfundraiserDetail}>
              <span>
                <span>About My Resolution</span>
                <br />
                <textarea
                  className={styles.textarea}
                  name="resolution"
                  id="resolution"
                  cols="30"
                  spellCheck="false"
                  rows="10"
                  placeholder="Enter about my resolution.."
                  value={formData.resolution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resolution: e.target.value,
                    })
                  }
                ></textarea>
              </span>
              <br />
            </div>
            <span>
              <span>My Story</span>
              <br />
              <textarea
                className={styles.textarea}
                name="story"
                id="story"
                spellCheck="false"
                cols="30"
                rows="10"
                placeholder="Enter my story.."
                value={formData.story}
                onChange={(e) =>
                  setFormData({ ...formData, story: e.target.value })
                }
              ></textarea>
            </span>
            <div className={styles.popupfourthfundraiserDetail}>
              <span>
                <span>Money Raised For</span>
                <br />
                <textarea
                  className={styles.textarea}
                  name="money_raised_for"
                  id="money_raised_for"
                  cols="30"
                  spellCheck="false"
                  rows="10"
                  placeholder="Enter money raised for.."
                  value={formData.money_raised_for}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      money_raised_for: e.target.value,
                    })
                  }
                ></textarea>
              </span>
            </div>
            <div className={styles.popupformButton}>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setpopupActive(false);
                }}
                type="reset"
                className={`${styles.popupfundbutton} ${styles.popupdonorButton}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className={`${styles.popupfundbutton} ${styles.filled}`}
                disabled={loading}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <>
        <section
          className={`${
            showPopup == true ? styles.stopScroll : styles.section
          }`}
        >
          <Sidebar />{" "}
          {user && !loading ? (
            <div className={styles.rightSection}>
              <div className={styles.rightsubSection}>
                <h1>Fundraiser</h1>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHead}>Id</th>
                      <th className={styles.tableHead}>Name</th>
                      <th className={styles.tableHead}>Email</th>
                      <th className={styles.tableHead}>Phone Number</th>
                      <th className={styles.tableHead}>URL</th>
                      <th className={styles.tableHead}>Status</th>
                      <th className={styles.tableHead}>Edit</th>
                    </tr>
                  </thead>
                  {displayedFundraisers?.length >= 0 ? (
                    <tbody className={styles.tableBody}>
                      {displayedFundraisers?.map((fundraiser) => (
                        <tr
                          className={styles.tableRow}
                          key={fundraiser.fundraiser_id}
                        >
                          <td className={styles.td}>{fundraiser.f_id}</td>
                          <td className={styles.td}>{fundraiser.firstName}</td>
                          <td className={styles.td}>
                            {fundraiser.email.toLowerCase()}
                          </td>
                          <td className={styles.td}>
                            {fundraiser.mobile_number}
                          </td>
                          <td className={styles.td}>
                            <a
                              style={{ color: "rgb(0, 0, 238)" }}
                              href={`${process.env.NEXT_PUBLIC_frontEndAPI}/fundraiser/${fundraiser?.fundraiser_page?.id}`}
                              target="_blank"
                            >
                              /{fundraiser?.fundraiser_page?.id}
                            </a>
                          </td>
                          <td className={styles.td}>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={async () => {
                                  const updatedStatus = !fundraiser.status;
                                  setFundraisers((prevFundraisers) =>
                                    prevFundraisers.map((item) =>
                                      item.id === fundraiser.id
                                        ? { ...item, status: updatedStatus }
                                        : item
                                    )
                                  );
                                  showSwal(
                                    "info",
                                    "Updating",
                                    "Please wait...",
                                    null,
                                    false
                                  );

                                  const response = await axios({
                                    method: "put",
                                    url: `${process.env.NEXT_PUBLIC_serverAPI}/admin/fundraiser/status/${fundraiser.fundraiser_id}`,
                                    headers: header,
                                  });
                                  if (
                                    response?.status == 201 ||
                                    response?.status == 200
                                  ) {
                                    const statusMessage =
                                      response.data.data.status === 0
                                        ? "inactive"
                                        : "active";
                                    const title = `Changed to ${statusMessage}`;
                                    showSwal("success", title, "");
                                  }
                                }}
                                defaultChecked={fundraiser.status === "active"}
                              />
                              <span
                                className={`${styles.slider} ${styles.round}`}
                              ></span>
                            </label>
                          </td>

                          <td className={styles.td}>
                            <a
                              onClick={() => {
                                setShowPopup(true);
                                setpopupActive(true);
                                setSelectedFundraiser(fundraiser);
                              }}
                            >
                              <FaRegPenToSquare />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    "error fetching data , try again later"
                  )}
                </table>
              </div>
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${styles.paginationButton} ${styles.filled}`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </section>
      </>
    </>
  );
}
