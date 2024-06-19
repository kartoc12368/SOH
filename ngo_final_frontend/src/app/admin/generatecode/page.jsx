"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Changed from "next/navigation" to "next/router"
import useAuth from "@/context/auth";
import axios from "axios"; // Added axios import
import Sidebar from "../../../component/sidebar";
import Cookies from "js-cookie";
import styles from "./generatecode.module.css";
import Link from "next/link";
import Loading from "@/app/loading";
import { showSwal } from "@/validation";
import { FundraiserContext } from "@/context/FundraiserContext";

const GeneratePage = () => {
  const router = useRouter();
  const { user } = useAuth(["ADMIN"]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobile_number, setMobileNumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data || "");
    setLoading(false);
  }, [Cookies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!email) {
      setEmailError("Email is required.");
    }
    if (!firstName) {
      setFirstNameError("Name is required.");
    }

    if (!mobile_number) {
      setMobileNumberError("Mobile number is required.");
    } else if (!/^\d{10}$/.test(mobile_number)) {
      setMobileNumberError("Mobile number must be 10 digits.");
    }

    if (email && firstName && mobile_number && /^\d{10}$/.test(mobile_number)) {
      try {
        showSwal(
          "info",
          "Generating Credentials",
          "Please wait...",
          null,
          false
        );
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_serverAPI}/admin/generate`,
          {
            email,
            firstName,
            mobile_number,
          },
          config
        );

        if (response.data.statusCode == 201) {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_serverAPI}/admin/createPage`,
              { email },
              config
            )
            .then(
              showSwal(
                "success",
                "Fundraiser Page Created",
                "Login Credentials sent to Fundraiser Email"
              )
            )
            .finally(reset());
          setLoading(false);
        }
      } catch (err) {
        if (
          err.response.data.statusCode !== 200 ||
          err.response.data.statusCode !== 201 ||
          err.response.data.statusCode == 404
        ) {
          showSwal(
            "error",
            err.response.data.message || "Fundraiser Already Exists"
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Handle blur events for input fields
  const handleBlur = (field, value) => {
    switch (field) {
      case "email":
        if (!value) {
          setEmailError("Email is required.");
        } else {
          setEmailError("");
        }
        break;
      case "firstName":
        if (!value) {
          setFirstNameError("Name is required.");
        } else {
          setFirstNameError("");
        }
        break;
      case "mobileNumber":
        if (!value) {
          setMobileNumberError("Mobile number is required.");
        } else if (!/^\d{10}$/.test(value)) {
          setMobileNumberError("Mobile number must be 10 digits.");
        } else {
          setMobileNumberError("");
        }
        break;
      default:
        break;
    }
  };

  const reset = () => {
    setEmail("");
    setEmailError("");
    setFirstNameError("");
    setMobileNumberError("");
    setFirstName("");
    setMobileNumber("");
  };

  return !user && loading ? (
    <Loading />
  ) : (
    <section className={styles.section}>
      <Sidebar />{" "}
      {user && !loading ? (
        <div className={styles.rightSection}>
          <div className={styles.rightsubSection}>
            <h1>Generate Credentials</h1>
            <div className={styles.rightsectionForm}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.userdetail}>
                  <span>
                    <span>E-mail </span>
                    <span className={styles.compulsory}>*</span>
                    <br />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email", email)}
                      placeholder="Enter Fundraiser's e-mail"
                    />
                    {emailError && (
                      <p style={{ color: "red" }} className={styles.error}>
                        {emailError}
                      </p>
                    )}
                  </span>
                  <span>
                    <span>Name </span>
                    <span className={styles.compulsory}>*</span>
                    <br />
                    <input
                      type="text"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\d/g, "");
                      }}
                      value={firstName}
                      name="fullName"
                      id="fullName"
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => handleBlur("firstName", firstName)}
                      placeholder="Enter Fundraiser's full name"
                    />
                    {firstNameError && (
                      <p style={{ color: "red" }} className={styles.error}>
                        {firstNameError}
                      </p>
                    )}
                  </span>
                  <span>
                    <span>Mobile Number </span>
                    <span className={styles.compulsory}>*</span>
                    <br />
                    <input
                      type="text"
                      name="mobileNumber"
                      id="mobileNumber"
                      value={mobile_number}
                      // onChange={(e) => setMobileNumber(e.target.value)}
                      onBlur={() => handleBlur("mobileNumber", mobile_number)}
                      placeholder="Enter Fundraiser's mobile no."
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        if (inputValue.length <= 10) {
                          setMobileNumber(inputValue);
                        }
                      }}
                      maxLength="10"
                    />
                    {mobileNumberError && (
                      <p style={{ color: "red" }} className={styles.error}>
                        {mobileNumberError}
                      </p>
                    )}
                  </span>
                </div>
                <div className={styles.rightsectionBtn}>
                  <button
                    type="reset"
                    onClick={reset}
                    className={`${styles.cancelBtn} ${styles.filled}`}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.cancelBtn}>
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default GeneratePage;
