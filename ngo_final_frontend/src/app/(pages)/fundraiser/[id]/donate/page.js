"use client";
// import styles from "./donation.module.css";
import styles from "@/app/(pages)/summary/donation.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Right from "@/app/(pages)/summary/right";
import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Swal from "sweetalert2";
import { NotfundraiserDonate } from "@/component/nofundraiser";

export default function Page({ params }) {
  const images = [
    "/images/ChiefMinisterOfAssam.jpeg",
    "/images/GovernorOfAndhraPradesh.jpeg",
    "/images/EasternNavalCommand.jpeg",
    "/images/EasternAirCommand.jpeg",
    "/images/ArmyEducationalCorps.jpeg",
    "/images/SainikWelfareAndhraPradesh.jpeg",
  ];
  const shareURL = `Hey,

  Check out this organisation doing such yeoman service to our brave soldiers.

  ${process.env.NEXT_PUBLIC_frontEndAPI}/summary`;

  const teamData = [
    {
      src: "/images/vinod-neb.png",
      name: "Late Wg. Cdr. Vinod Nebb (Retd)",
      award: " Vir Chakra & Bar (VrC)",
      patron: "Patron",
    },
    {
      src: "/images/RDSharma.png",
      name: "Lt. Col. R.D. Sharma (Retd.)",
      award: "",
      patron: "Patron",
    },
    {
      src: "/images/JSDhillon.png",
      name: "Lt. Gen. J.S. Dhillon (Retd), Vishisht Seva Medal (VSM)",
      award: " ",
      patron: "Patron",
    },
    {
      src: "/images/RanjeetShukla.png",
      name: "Mr. Ranjeet Shukla",
      award: " ",
      patron: "Co-founder",
    },
    {
      src: "/images/GauravShukla.png",
      name: "Mr. Gaurav Shukla",
      award: " ",
      patron: "Co-founder",
    },
    {
      src: "/images/GavirKumar.png",
      name: "Cdr. (IN) Gavi Kumar (Retd)",
      award: "Head of PR & Communications",
      patron: "",
    },
  ];

  const [formData, setFormData] = useState({
    donor_first_name: "",
    donor_last_name: "",
    donor_email: "",
    donor_phone: "",
    pan: "",
    donor_address: "",
    amount: 0,
  });

  const [donationOption, setDonationOption] = useState("donateAnyAmount");
  const [certificate, setcertificate] = useState(false);
  const [checkboxCounts, setCheckboxCounts] = useState({
    schoolFees: 0,
    medicalCare: 0,
    ration: 0,
  });
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFundraiserActive, setIsFundraiserActive] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_serverAPI}/fundraiser-page/${params.id}`,
          config
        );
        if (response.status === 200) {
          setIsFundraiserActive(true);
        }
      } catch (error) {
        console.error("Error fetching fundraisers:", error);
      }
    };
    fetchData();
  }, [params.id]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount.";
    }
    // if (formData.amount >= 300000) {
    //   newErrors.amount = "Onetime donation amount is upto 300,000.";
    // }
    if (!formData.donor_first_name.trim()) {
      newErrors.donor_first_name = "Please enter First name.";
    }
    if (!formData.donor_phone.trim() || !/^\d{10}/.test(formData.donor_phone)) {
      newErrors.donor_phone = "Mobile Number must be of 10 digits.";
    }
    if (certificate) {
      if (!formData.pan.trim()) {
        newErrors.pan = "PAN number is required for 80G certificate.";
      } else {
        const pan = formData.pan.trim();
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const specialCharRegex = /[^a-zA-Z0-9]/;

        if (pan.length !== 10) {
          newErrors.pan = "PAN number must be exactly 10 characters long.";
        } else if (specialCharRegex.test(pan)) {
          newErrors.pan = "PAN number must not contain special characters.";
        } else if (!panRegex.test(pan)) {
          newErrors.pan =
            "Invalid PAN number. It should be in the format AAAAA9999A.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePanChange = (e) => {
    const { value } = e.target;

    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    setFormData({ ...formData, pan: sanitizedValue });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleDonationOptionChange = (e) => {
    setDonationOption(e.target.value);
    setFormData({
      ...formData,
      amount: 0,
    });
    setSelectedCheckboxes([]);
    setCheckboxCounts({
      schoolFees: 0,
      medicalCare: 0,
      ration: 0,
    });
  };

  const handle80GCertificateChange = (e) => {
    setcertificate(e.target.value === "yes");
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    const amountMap = {
      schoolFees: 2500,
      medicalCare: 2000,
      ration: 1250,
    };

    if (checked) {
      setDonationOption("donateProjects");
    }

    setSelectedCheckboxes((prevSelected) => {
      const updatedSelected = checked
        ? [...prevSelected, id]
        : prevSelected.filter((item) => item !== id);
      return updatedSelected;
    });

    setFormData((prevData) => {
      const newAmount = checked
        ? prevData.amount + amountMap[id]
        : prevData.amount - amountMap[id] * checkboxCounts[id];
      return { ...prevData, amount: newAmount };
    });

    setCheckboxCounts((prevCounts) => ({
      ...prevCounts,
      [id]: checked ? 1 : 0,
    }));
  };

  const incrementCount = (id) => {
    const amountMap = {
      schoolFees: 2500,
      medicalCare: 2000,
      ration: 1250,
    };

    setCheckboxCounts((prevCounts) => {
      const newCount = prevCounts[id] + 1;
      setFormData((prevData) => ({
        ...prevData,
        amount: prevData.amount + amountMap[id],
      }));
      return { ...prevCounts, [id]: newCount };
    });
  };

  const decrementCount = (id) => {
    const amountMap = {
      schoolFees: 2500,
      medicalCare: 2000,
      ration: 1250,
    };

    setCheckboxCounts((prevCounts) => {
      const newCount = Math.max(0, prevCounts[id] - 1);
      setFormData((prevData) => ({
        ...prevData,
        amount: prevData.amount - (prevCounts[id] > 0 ? amountMap[id] : 0),
      }));
      return { ...prevCounts, [id]: newCount };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const donation_activity = {};
    selectedCheckboxes.forEach((id) => {
      donation_activity[id] = checkboxCounts[id];
    });
    const dataToSend = Object.fromEntries(
      Object.entries({
        ...formData,
        amount: Number(formData.amount),
        certificate: certificate,
        donation_activity,
      }).filter(([_, value]) => value !== "")
    );
    if (!certificate) {
      delete dataToSend.pan;
    }

    try {
      Swal.fire({
        title: "Please wait...",
        icon: "info",
        text: "Redirecting to Payment gateway",
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_serverAPI}/donate/fundraiser-page/${params.id}`,
        dataToSend
      );
      Swal.Close();
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_serverAPI}/easypay/donation`,
        dataToSend
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      {isFundraiserActive ? (
        <main className={styles.mainPage}>
          <div className={"container"}>
            <div className={styles.upperPortion}>
              <div className={styles.pageTagline}>
                <p className={styles.tagline}>
                  “In our nation, there's always a soldier sacrificing his own
                  comfort for our peace. Now, it's our turn to shower them with
                  love and showing them they're not alone.”
                </p>
              </div>
              <div className={styles.upperRight}>
                <div className={styles.ytVideo}>
                  <iframe
                    width="693"
                    height="330"
                    src="https://www.youtube.com/embed/FjjSQ52j93k?si=RS5z3l9AvawzolmT"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className={styles.benefits}>
                  <ul className={styles.unorderList}>
                    <li className={styles.benefitOptions}>100% Transparency</li>
                    <li className={`${styles.benefitOptions} ${styles.green}`}>
                      Assured
                    </li>
                    <li className={`${styles.benefitOptions} ${styles.orange}`}>
                      Ex-soldiers
                    </li>
                    <li className={`${styles.benefitOptions} ${styles.red}`}>
                      Tax-benefit
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <section className={styles.mainClass}>
            <div className={styles.leftSection}>
              <div className={styles.leftSectionInnerBox}>
                <h2>Registration Details</h2>
                <div className={styles.registerDetails}>
                  <p className={styles.companyDetails}>
                    SOH Registration Number:{" "}
                    <span className={styles.companyData}>246/2017</span>
                  </p>
                  <p className={styles.companyDetails}>
                    PAN Number:{" "}
                    <span className={styles.companyData}>AASTS5940F</span>
                  </p>
                  <p className={styles.companyDetails}>
                    80G Number:{" "}
                    <span className={styles.companyData}>AASTS5940FF20216</span>
                  </p>
                  <p className={styles.companyDetails}>
                    12A Number:{" "}
                    <span className={styles.companyData}>AASTS5940FE20218</span>
                  </p>
                </div>
                <form className={styles.formSection} onSubmit={handleSubmit}>
                  <div className={styles.amountSection}>
                    <label htmlFor="amount">Amount*</label>
                    <input
                      type="text"
                      className={styles.amount}
                      name="amount"
                      maxLength={6}
                      value={formData.amount > 0 ? formData.amount : ""}
                      onChange={handleChange}
                      placeholder={
                        donationOption == "donateAnyAmount"
                          ? "Enter Amount"
                          : "Choose project"
                      }
                      disabled={donationOption !== "donateAnyAmount"}
                    />
                    {errors.amount && (
                      <span className={styles.error} style={{ color: "red" }}>
                        {errors.amount}
                      </span>
                    )}
                  </div>
                  <div className={styles.amountOptions}>
                    <div className={styles.operation}>
                      <input
                        type="radio"
                        id="donateAnyAmount"
                        className={styles.inputRadio}
                        name="donationOption"
                        value="donateAnyAmount"
                        checked={donationOption === "donateAnyAmount"}
                        onChange={handleDonationOptionChange}
                      />
                      <label htmlFor="donateAnyAmount">Donate any amount</label>
                    </div>
                    <div className={styles.operation}>
                      <input
                        type="radio"
                        id="donateProjects"
                        className={styles.inputRadio}
                        name="donationOption"
                        value="donateProjects"
                        onChange={handleDonationOptionChange}
                      />
                      <label htmlFor="donateProjects">
                        Donate for projects of SOH{" "}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.8 5.6H7.2V4H8.8M8.8 12H7.2V7.2H8.8M8 0C6.94943 0 5.90914 0.206926 4.93853 0.608964C3.96793 1.011 3.08601 1.60028 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.08601 14.3997 3.96793 14.989 4.93853 15.391C5.90914 15.7931 6.94943 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 6.94943 15.7931 5.90914 15.391 4.93853C14.989 3.96793 14.3997 3.08601 13.6569 2.34315C12.914 1.60028 12.0321 1.011 11.0615 0.608964C10.0909 0.206926 9.05058 0 8 0Z"
                            fill="#A4A4A4"
                          />
                        </svg>
                      </label>
                    </div>
                    {donationOption === "donateProjects" && (
                      <>
                        <div
                          className={`${styles.operation} ${styles.checkbox}`}
                        >
                          <input
                            type="checkbox"
                            id="schoolFees"
                            className={styles.inputCheck}
                            name="schoolFees"
                            checked={checkboxCounts.schoolFees > 0}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor="schoolFees">
                            ₹2,500 for school fees
                            <div
                              className={`${styles.amountSelect} ${styles.filled}`}
                            >
                              <button
                                type="button"
                                // className={styles.minusButton}
                                className={
                                  !checkboxCounts.schoolFees > 0
                                    ? styles.minusButton
                                    : `${styles.plusButton} ${styles.minusButton}`
                                }
                                onClick={() => decrementCount("schoolFees")}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.0007 8.66536H4.00065C3.82384 8.66536 3.65427 8.59513 3.52925 8.4701C3.40422 8.34508 3.33398 8.17551 3.33398 7.9987C3.33398 7.82189 3.40422 7.65232 3.52925 7.52729C3.65427 7.40227 3.82384 7.33203 4.00065 7.33203H12.0007C12.1775 7.33203 12.347 7.40227 12.4721 7.52729C12.5971 7.65232 12.6673 7.82189 12.6673 7.9987C12.6673 8.17551 12.5971 8.34508 12.4721 8.4701C12.347 8.59513 12.1775 8.66536 12.0007 8.66536Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                className={styles.numberButton}
                                value={checkboxCounts.schoolFees}
                                readOnly
                              />
                              <button
                                type="button"
                                className={`${styles.minusButton} ${styles.plusButton}`}
                                onClick={() => incrementCount("schoolFees")}
                              >
                                +
                              </button>
                            </div>
                          </label>
                        </div>
                        <div
                          className={`${styles.operation} ${styles.checkbox}`}
                        >
                          <input
                            type="checkbox"
                            id="medicalCare"
                            className={styles.inputCheck}
                            name="medicalCare"
                            checked={checkboxCounts.medicalCare > 0}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor="medicalCare">
                            ₹2,000 for medical care
                            <div className={styles.amountSelect}>
                              <button
                                type="button"
                                className={
                                  !checkboxCounts.medicalCare > 0
                                    ? styles.minusButton
                                    : `${styles.plusButton} ${styles.minusButton}`
                                }
                                onClick={() => decrementCount("medicalCare")}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.0007 8.66536H4.00065C3.82384 8.66536 3.65427 8.59513 3.52925 8.4701C3.40422 8.34508 3.33398 8.17551 3.33398 7.9987C3.33398 7.82189 3.40422 7.65232 3.52925 7.52729C3.65427 7.40227 3.82384 7.33203 4.00065 7.33203H12.0007C12.1775 7.33203 12.347 7.40227 12.4721 7.52729C12.5971 7.65232 12.6673 7.82189 12.6673 7.9987C12.6673 8.17551 12.5971 8.34508 12.4721 8.4701C12.347 8.59513 12.1775 8.66536 12.0007 8.66536Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                className={styles.numberButton}
                                value={checkboxCounts.medicalCare}
                                readOnly
                              />
                              <button
                                type="button"
                                className={`${styles.minusButton} ${styles.plusButton}`}
                                onClick={() => incrementCount("medicalCare")}
                              >
                                +
                              </button>
                            </div>
                          </label>
                        </div>
                        <div
                          className={`${styles.operation} ${styles.checkbox}`}
                        >
                          <input
                            type="checkbox"
                            id="ration"
                            className={styles.inputCheck}
                            name="ration"
                            checked={checkboxCounts.ration > 0}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor="ration">
                            ₹1,250 to provide ration
                            <div className={styles.amountSelect}>
                              <button
                                type="button"
                                className={
                                  !checkboxCounts.ration > 0
                                    ? styles.minusButton
                                    : `${styles.plusButton} ${styles.minusButton}`
                                }
                                onClick={() => decrementCount("ration")}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.0007 8.66536H4.00065C3.82384 8.66536 3.65427 8.59513 3.52925 8.4701C3.40422 8.34508 3.33398 8.17551 3.33398 7.9987C3.33398 7.82189 3.40422 7.65232 3.52925 7.52729C3.65427 7.40227 3.82384 7.33203 4.00065 7.33203H12.0007C12.1775 7.33203 12.347 7.40227 12.4721 7.52729C12.5971 7.65232 12.6673 7.82189 12.6673 7.9987C12.6673 8.17551 12.5971 8.34508 12.4721 8.4701C12.347 8.59513 12.1775 8.66536 12.0007 8.66536Z"
                                    fill="white"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                className={styles.numberButton}
                                value={checkboxCounts.ration}
                                readOnly
                              />
                              <button
                                type="button"
                                className={`${styles.minusButton} ${styles.plusButton}`}
                                onClick={() => incrementCount("ration")}
                              >
                                +
                              </button>
                            </div>
                          </label>
                        </div>
                      </>
                    )}
                    <p className={styles.optionNotice}>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.8 6.1H7.2V4.5H8.8M8.8 12.5H7.2V7.7H8.8M8 0.5C6.94942 0.5 5.90914 0.706926 4.93853 1.10896C3.96793 1.511 3.08601 2.10028 2.34315 2.84315C0.842855 4.34344 0 6.37827 0 8.5C0 10.6217 0.842855 12.6566 2.34315 14.1569C3.08601 14.8997 3.96793 15.489 4.93853 15.891C5.90914 16.2931 6.94942 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 7.44942 15.7931 6.40914 15.391 5.43853C14.989 4.46793 14.3997 3.58601 13.6569 2.84315C12.914 2.10028 12.0321 1.511 11.0615 1.10896C10.0909 0.706926 9.05058 0.5 8 0.5Z"
                          fill="#A4A4A4"
                        />
                      </svg>
                      These amounts are for the monthly donation per
                      beneficiary.
                    </p>
                  </div>
                  <h2>Personal Info</h2>
                  <div className={styles.userName}>
                    <div className={styles.name}>
                      <label htmlFor="firstName">First Name*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="donor_first_name"
                        value={formData.donor_first_name}
                        placeholder="Enter first name"
                        onChange={handleChange}
                      />
                      {errors.donor_first_name && (
                        <span className={styles.error} style={{ color: "red" }}>
                          {errors.donor_first_name}
                        </span>
                      )}
                    </div>
                    <div className={styles.name}>
                      <label htmlFor="donor_last_name">Last Name</label>
                      <input
                        type="text"
                        id="donor_last_name"
                        name="donor_last_name"
                        placeholder="Enter last name"
                        value={formData.donor_last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles.email}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="donor_email"
                      placeholder="Enter your email"
                      value={formData.donor_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.pNumber}>
                    <label htmlFor="phoneNumber">Phone Number*</label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      id="phoneNumber"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .substring(0, 10);
                      }}
                      name="donor_phone"
                      value={formData.donor_phone}
                      onChange={handleChange}
                    />
                    {errors.donor_phone && (
                      <span className={styles.error} style={{ color: "red" }}>
                        {errors.donor_phone}
                      </span>
                    )}
                  </div>
                  <div className={styles.donor_address}>
                    <label htmlFor="donor_address">Address</label>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      id="donor_address"
                      name="donor_address"
                      value={formData.donor_address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.gCerti}>
                    <p>Do you want 80G Certificate?</p>
                    <div className={styles.chooseOption}>
                      <div className={styles.formRadio}>
                        <input
                          type="radio"
                          style={{ cursor: "pointer" }}
                          id="no"
                          name="certificate"
                          value="no"
                          checked={!certificate}
                          onChange={handle80GCertificateChange}
                        />
                        <label htmlFor="no">No</label>
                      </div>
                      <div className={styles.formRadio}>
                        <input
                          type="radio"
                          id="yes"
                          style={{ cursor: "pointer" }}
                          name="certificate"
                          value="yes"
                          checked={certificate}
                          onChange={handle80GCertificateChange}
                        />
                        <label htmlFor="yes">Yes</label>
                      </div>
                    </div>
                  </div>
                  {certificate && (
                    <>
                      <div className={styles.panNo}>
                        <label htmlFor="pan">PAN No.*</label>
                        <input
                          type="text"
                          placeholder="Enter your PAN"
                          id="pan"
                          name="pan"
                          maxLength={10}
                          value={formData.pan}
                          onChange={handlePanChange}
                        />
                        {errors.pan && (
                          <span
                            className={styles.error}
                            style={{ color: "red" }}
                          >
                            {errors.pan}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  <div className={styles.donationBtn}>
                    <button type="submit" className={styles.donateBtn}>
                      Donate &nbsp; ₹ {formatNumberWithCommas(formData.amount)}
                    </button>
                  </div>
                </form>
                <div className={styles.paymentIcons}>
                  <div className={styles.icons}>
                    <img
                      src="/images/phonepay.png"
                      alt="phonepay"
                      width="40"
                      height="40"
                    />

                    <img
                      src="/images/gpay.png"
                      alt="gpay"
                      width="40"
                      height="40"
                    />

                    <img
                      src="/images/bheem.png"
                      alt="bheem"
                      width="40"
                      height="40"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Right images={images} teamData={teamData} styles={styles} />
          </section>
          <section className={styles.mainSection}>
            <h2>
              “Join us in empowering our heroes and their families—your donation
              can make a world of difference.”
            </h2>
            <p>
              “Spread the word! Each share is a whisper of gratitude for our
              heroes.”
            </p>
            <div className={styles.socialMedia}>
              <a
                target="_blank"
                title="share on facebook"
                href="https://www.facebook.com/sharer/sharer.php?u=https://donation.supportourheroes.in/summary"
                url={process.env.NEXT_PUBLIC_frontEndAPI}
              >
                <FaFacebook color="#1877F2" className={styles.shareIcon} />
              </a>
              <TwitterShareButton url={shareURL}>
                <FaXTwitter
                  title="share on twitter(X)"
                  className={styles.shareIcon}
                />
              </TwitterShareButton>
              <EmailShareButton url={shareURL}>
                <i className={styles.shareIcon}>
                  <img
                    title="share on gmail"
                    height={44}
                    width={44}
                    src="/images/gmail.svg"
                    className={styles.shareIcon}
                  />{" "}
                </i>
              </EmailShareButton>
              <WhatsappShareButton url={shareURL}>
                <FaWhatsapp
                  title="share on whatsapp"
                  color="#25D366"
                  className={styles.shareIcon}
                />
              </WhatsappShareButton>
            </div>
          </section>
        </main>
      ) : (
        <NotfundraiserDonate />
      )}
    </>
  );
}
