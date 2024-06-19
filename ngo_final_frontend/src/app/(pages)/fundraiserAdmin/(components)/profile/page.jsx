"use client";
import Loading from "@/app/loading";
import { TopHeader } from "@/component/fundraiser/fundraiserSidebar";
import useAuth from "@/context/auth";
import { FundraiserContext } from "@/context/FundraiserContext";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
import styles from "./profile.module.css";
import { showSwal } from "@/validation";

export default function Page() {
  const { user } = useAuth("FUNDRAISER");
  const fundraiserCtx = useContext(FundraiserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState(null);
  const [token, setToken] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState();
  const [dob, setDOB] = useState("");
  const [pan, setPan] = useState("");
  const [showAccountDetails, setShowAccountDetails] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [profileImage, setProfileImage] = useState();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data || "");
  }, []);

  useEffect(() => {
    const fundraiser = fundraiserCtx?.fundraiser?.fundraiser;
    if (fundraiser) {
      setFirstName(fundraiser?.firstName || "");
      setLastName(fundraiser?.lastName || "");
      setEmail(fundraiser?.email || "");
      setAddress(fundraiser?.address || "");
      setState(fundraiser?.state || "");
      setCity(fundraiser.fundraiser?.city || "");
      setCountry(fundraiser?.country || "");
      setPincode(fundraiser?.pincode || "");
      setNumber(fundraiser?.mobile_number || "");
      setDOB(fundraiser?.dob || "");
      setPan(fundraiser?.pan || "");
      setProfileImage(fundraiser?.profileImage || "/images/profile.jpeg");
    }
  }, [fundraiserCtx.fundraiser]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    } else {
      setStates([]);
    }
  }, [country]);
  useEffect(() => {
    if (state) {
      setCities(City.getCitiesOfState(country, state));
    } else {
      setCities([]);
    }
  }, [state, country]);
  const handleUpdate = async (e) => {
    showSwal("info", "Updating", "Please wait...", null, false);
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = {
        firstName,
        lastName,
        email,
        address,
        state,
        city,
        country,
        pincode,
        number,
        dob,
        pan,
      };
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v)
      );

      const response = await axios
        .put(
          `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/update`,
          filteredFormData,
          config
        )
        .then(showSwal("success", "Updated", "Updated  Successfully!!"));
    } catch (err) {
      showSwal("error", "Error", `${err.response.data.message}`);
    }

    Swal.close();
  };

  const handleImageUpload = async (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      setImage(formData);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitImageUpload = async () => {
    if (image) {
      try {
        showSwal("info", "Uploading", "Please wait...", null, false);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/upload`,
          image,
          config
        );

        Swal.fire({
          title: "Updated",
          text: "Updated  Successfully!!",
          icon: "success",
          confirmButtonColor: "#000080",
          confirmButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            fundraiserCtx.fetchData();
            window.location.reload();
          }
        });
      } catch (err) {
        showSwal("error", "Oops!", `${err.response.data.message}`);
      }
    }
  };

  const reset = () => {
    setFirstName(fundraiserCtx.fundraiser?.fundraiser?.firstName || "");
    setLastName(fundraiserCtx.fundraiser?.fundraiser?.lastName || "");
    setEmail(fundraiserCtx.fundraiser?.fundraiser?.email || "");
    setAddress(fundraiserCtx.fundraiser?.fundraiser?.address || "");
    setState(fundraiserCtx.fundraiser?.fundraiser?.state || "");
    setCity(fundraiserCtx.fundraiser?.fundraiser?.city || "");
    setCountry(fundraiserCtx.fundraiser?.fundraiser?.country || "");
    setPincode(fundraiserCtx.fundraiser?.fundraiser?.pincode || "");
    setNumber(fundraiserCtx.fundraiser?.fundraiser?.mobile_number || "");
    setDOB(fundraiserCtx.fundraiser?.fundraiser?.dob || "");
    setPan(fundraiserCtx.fundraiser?.fundraiser?.pan || "");
  };

  useEffect(() => {
    const imgInp = document.getElementById("imgInp");
    const blah = document.getElementById("blah");

    if (imgInp && blah) {
      imgInp.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            blah.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    return () => {
      if (imgInp) {
        imgInp.removeEventListener("change");
      }
    };
  }, []);

  return user ? (
    <>
      <TopHeader
        link={`${fundraiserCtx.fundraiser?.fundraiser?.fundraiser_page?.id}`}
      />
      <section className={styles.mainSection}>
        <div className={styles.leftSection}>
          <a
            href="#"
            className={styles.sidebarLink}
            onClick={() => setShowAccountDetails(true)}
          >
            <p
              className={`${styles.sideBar} ${
                showAccountDetails ? `${styles.active}` : ""
              }`}
            >
              <i className={`fa-solid fa-user`}></i> Account Details
            </p>
          </a>
          <a
            className={styles.sidebarLink}
            onClick={() => setShowAccountDetails(false)}
          >
            <p
              className={`${styles.sideBar} ${
                !showAccountDetails ? `${styles.active}` : ""
              }`}
            >
              <i className={`fa-regular fa-image`}></i> Upload Profile Photo
            </p>
          </a>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.accountDetails}>
            <h1>
              {showAccountDetails ? "Account Details" : "Upload Profile Photo"}
            </h1>
            {showAccountDetails ? (
              <>
                <form className={styles.form}>
                  <div className={styles.firstpersonalDetail}>
                    <span>
                      <span>First Name</span>
                      <br />
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </span>
                    <span>
                      <span>Last Name</span>
                      <br />
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </span>
                    <span>
                      <span>Email</span>
                      <br />
                      <input type="email" name="email" value={email} disabled />
                    </span>
                  </div>
                  <div className={styles.secondpersonalDetail}>
                    <span>
                      <span>Address</span>
                      <br />
                      <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        id="address"
                        placeholder="Enter your address"
                      />
                    </span>
                    <span>
                      <span>Country</span>
                      <br />
                      <select
                        name="country"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={styles.selectNation}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </span>{" "}
                    <span>
                      <span>State</span>
                      <br />
                      <select
                        name="state"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={styles.selectNation}
                        disabled={!country}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div className={styles.thirdpersonalDetail}>
                    <span>
                      <span>City</span>
                      <br />
                      <select
                        name="city"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={styles.selectNation}
                        disabled={!state}
                      >
                        <option value="">Select City</option>

                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <span>Pincode</span>
                      <br />
                      <input
                        type="text"
                        name="pincode"
                        id="pincode"
                        value={pincode}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 6);
                        }}
                        onChange={(e) => setPincode(Number(e.target.value))}
                        // onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter your pincode"
                      />
                    </span>
                    <span>
                      <span>Mobile Number</span>
                      <br />
                      <input
                        type="text"
                        name="mobileNumber"
                        id="mobileNumber"
                        value={number}
                        placeholder="Enter your mobile no."
                        maxLength="10"
                        onChange={(e) => setNumber(e.target.value)}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 10);
                        }}
                        required
                      />
                    </span>
                  </div>
                  <div className={styles.fourthpersonalDetail}>
                    <span>
                      <span>DOB</span>
                      <br />
                      <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        name="dob"
                        id="DOB"
                        value={dob}
                        className={styles.DOB}
                        onChange={(e) => setDOB(e.target.value)}
                        placeholder="Enter your DOB"
                      />
                    </span>
                    <span>
                      <span>PAN Number</span>
                      <br />
                      <input
                        type="text"
                        name="PANnumber"
                        id="PANnumber"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                        maxLength={11}
                        placeholder="Enter your PAN number"
                      />
                    </span>
                  </div>
                  <div className={styles.formButton}>
                    <Link href="#">
                      <button
                        type="reset"
                        onClick={reset}
                        className={`${styles.fundButton} ${styles.donorButton}`}
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      onClick={handleUpdate}
                      className={styles.fundButton}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <Image
                  id="blah"
                  src={
                    imagePreview
                      ? imagePreview
                      : `${process.env.NEXT_PUBLIC_serverAPI}/fundraiser/profile-image/${profileImage}`
                  }
                  alt="your image"
                  width={225}
                  height={225}
                  unoptimized
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "1em",
                  }}
                />

                <br />
                <input
                  accept="image/*"
                  type="file"
                  id="imgInp"
                  onChange={(e) => handleImageUpload(e)}
                />

                <button
                  type="submit"
                  onClick={handleSubmitImageUpload}
                  className={styles.fundButton}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  ) : (
    <Loading />
  );
}
