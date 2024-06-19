"use client";
import Sidebar from "@/component/sidebar";
import styles from "./adddonation.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "@/app/loading";
import useAuth from "@/context/auth";
import { addminAddDonationError, showSwal } from "@/validation";
import { Country, State, City } from "country-state-city";
import BankNames from "@/bank";

export default function page() {
  const user = useAuth(["ADMIN"]);
  const [token, settoken] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialFormState = {
    amount: "",
    donor_first_name: "",
    donor_last_name: "",
    donor_email: "",
    donor_phone: "",
    payment_method: "",
    donation_date: "",
    donor_address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    pan: "",
    refrence_payment: "",
    donor_bank_name: "",
    donor_bank_branch: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);

  const reset = () => {
    setFormData(initialFormState);
    setErrors({});
  };
  useEffect(() => {
    const data = Cookies.get("token");
    settoken(data);
    setLoading(false);
  }, [Cookies]);

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await Country.getAllCountries();
      setCountries(countriesData);
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.isoCode === countryCode
    );
    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(countryStates);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((state) => state.isoCode === stateCode);
    const stateCities = City.getCitiesOfState(
      selectedState.countryCode,
      stateCode
    );
    setCities(stateCities);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lastName") {
      setFormData((prevData) => ({
        ...prevData,
        donor_name: `${prevData.donor_name} ${value}`,
        [name]: value,
      }));
    } else if (name === "amount") {
      const parsedValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? "" : parsedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const props = {
      amount: formData.amount,
      donation_date: formData.donation_date,
      payment_method: formData.payment_method,
      donor_first_name: formData.donor_first_name,
      donor_email: formData.donor_email,
      donor_phone: formData.donor_phone,
      email: formData.email,
    };

    const validationErrors = addminAddDonationError(props);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      showSwal("info", "Adding Donation", "Please wait...", null, false);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_serverAPI}/admin/addOfflineDonation`,
        headers: config.headers,
        data: formData,
      });
      if (response.status == 201) {
        setLoading(false);
        showSwal("success", "Donation added Successfully", "");
        reset();
        setLoading(false);
      }
      setLoading(false);
      setErrors({});
    } catch (error) {
      showSwal("error", "Fundraiser is Inactive", "");
      console.error("API error:", error);
      setLoading(false);
    }
  };

  return !user && loading ? (
    <Loading />
  ) : (
    <>
      <section className={styles.mainFundraiser}>
        <Sidebar />
        {!loading && user ? (
          <div className={styles.rightSection}>
            <div className={styles.rightpart}>
              <h1 className={styles.bigText}>Fundraiser Information</h1>
              <form className={styles.mainForm}>
                <div className={styles.fundraiserDetail}>
                  <span>
                    <span>Fundraiser E-mail</span>
                    <br />
                    <input
                      list="fundraiserPageList"
                      type="text"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter fundraiser e-mail"
                    />
                    {errors.email && (
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {errors.email}
                      </p>
                    )}
                    <datalist id="fundraiserPageList">
                      {/* {fundraiserPages.map((page, index) => (
                      <option key={index} value={page} />
                    ))}{" "} */}
                    </datalist>
                  </span>
                  <span>
                    <span>
                      Amount <span className={styles.compulsory}>*</span>
                    </span>
                    <br />
                    <input
                      type="text"
                      name="amount"
                      min={1}
                      value={formData.amount}
                      onChange={handleChange}
                      id="amount"
                      placeholder="Enter donor amount"
                      required
                    />

                    {errors.amount && (
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {errors.amount}
                      </p>
                    )}
                  </span>
                </div>
                <h2>Personal Information</h2>
                <div className={styles.personalDetail}>
                  <div className={styles.firstpersonalDetail}>
                    <span>
                      <span>
                        First Name <span className={styles.compulsory}>*</span>
                      </span>
                      <br />
                      <input
                        type="text"
                        value={formData.donor_first_name}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\d/g, "");
                        }}
                        name="donor_first_name"
                        id="donor_name"
                        placeholder="Enter donor first name"
                        required
                      />
                      {errors.donor_first_name && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {errors.donor_first_name}
                        </p>
                      )}
                    </span>
                    <span>
                      <span>Last Name</span>
                      <br />
                      <input
                        type="text"
                        name="donor_last_name"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\d/g, "");
                        }}
                        value={formData.donor_last_name}
                        onChange={handleChange}
                        id="lastName"
                        placeholder="Enter donor last name"
                      />
                    </span>
                    <span>
                      <span>
                        Email <span className={styles.compulsory}>*</span>
                      </span>
                      <br />
                      <input
                        type="email"
                        value={formData.donor_email}
                        onChange={handleChange}
                        name="donor_email"
                        id="donor_email"
                        placeholder="Enter donor e-mail"
                        required
                      />
                      {errors.donor_email && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {errors.donor_email}
                        </p>
                      )}
                    </span>
                  </div>
                  <div className={styles.secondpersonalDetail}>
                    <span>
                      <span>Address</span>
                      <br />
                      <input
                        type="text"
                        value={formData.donor_address}
                        onChange={handleChange}
                        name="donor_address"
                        id="donor_address"
                        placeholder="Enter donor address"
                      />
                    </span>
                    <span>
                      <span>Country</span>
                      <br />
                      <select  className={styles.selectNation} onChange={handleCountryChange}>
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <span>State</span>
                      <br />
                      <select
                        onChange={handleStateChange}
                        className={styles.selectNation}
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
                        className={styles.selectNation}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.isoCode} value={city.name}>
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
                        value={formData.pincode}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 6);
                        }}
                        name="pincode"
                        id="pincode"
                        placeholder="Enter donor pincode"
                      />
                    </span>
                    <span>
                      <span>
                        Mobile Number{" "}
                        <span className={styles.compulsory}>*</span>
                      </span>
                      <br />
                      <input
                        type="text"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 10);
                        }}
                        min={0}
                        name="donor_phone"
                        value={formData.donor_phone}
                        onChange={handleChange}
                        autoComplete="off"
                        id="donor_phone"
                        placeholder="Enter donor mobile no."
                        maxLength="10"
                        required
                      />
                      {errors.donor_phone && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {errors.donor_phone}
                        </p>
                      )}
                    </span>
                  </div>
                </div>
                <h2>Donation Information</h2>
                <div className={styles.donationDetail}>
                  <div className={styles.firstdonationDetail}>
                    <span>
                      <span>PAN Number</span>
                      <br />
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        maxLength={11}
                        id="pan"
                        placeholder="Enter donor PAN number"
                      />
                    </span>
                    <span>
                      <span>
                        Offline Payment Method
                        <span className={styles.compulsory}>*</span>
                      </span>
                      <br />
                      <select
                        id="payment_method"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Direct Bank Transfer">
                          Direct Bank Transfer
                        </option>
                        <option value="Cheque/DD">Cheque/DD</option>
                      </select>

                      {errors.payment_method && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {errors.payment_method}
                        </p>
                      )}
                    </span>
                    <span>
                      Reference number
                      <input
                        type="text"
                        name="refrence_payment"
                        value={formData.refrence_payment}
                        onChange={handleChange}
                        id="refrence_payment"
                        placeholder="Enter donor Reference Number"
                      />
                    </span>
                  </div>
                  <div className={styles.seconddonationDetail}>
                    <span className={styles.offlinePaymentDate}>
                      <span>
                        Donation (Date)
                        <span className={styles.compulsory}>*</span>
                      </span>
                      <br />
                      <input
                        type="date"
                        name="donation_date"
                        id="donation_date"
                        value={formData.donation_date}
                        onChange={handleChange}
                        className={styles.donation_date}
                        required
                        style={{
                          width: "365px",
                          color: "#667085",
                        }}
                        max={new Date().toISOString().split("T")[0]}
                      />

                      {errors.donation_date && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {errors.donation_date}
                        </p>
                      )}
                    </span>
                    <span>
                      <span>Bank Name</span>
                      <br />
                      {/* <input
                        type="text"
                        name="donor_bank_name"
                        id="bankName"
                        value={formData.donor_bank_name}
                        onChange={handleChange}
                        placeholder="Enter donor bank name"
                      /> */}
                      <select
                        type="text"
                        name="donor_bank_name"
                        id="bankName"
                        value={formData.donor_bank_name}
                        onChange={handleChange}
                      >
                        <option value="">Select Bank</option>
                        {BankNames.map((bank, index) => (
                          <option key={index} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <span>Bank Branch Name</span>
                      <br />
                      <input
                        type="text"
                        name="donor_bank_branch"
                        id="branchName"
                        value={formData.donor_bank_branch}
                        onChange={handleChange}
                        placeholder="Enter donor branch name"
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.formButton}>
                  <button
                    type="reset"
                    className={`${styles.fundButton} ${styles.donorButton}`}
                    onClick={reset}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.fundButton}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
