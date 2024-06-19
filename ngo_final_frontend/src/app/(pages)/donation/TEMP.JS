"use client";
import MySwiper, { MySwiperTeamMember, OneSwiper } from "@/component/MySwiper";
import styles from "./donation.module.css";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const images = [
    "/images/ChiefMinisterOfAssam.jpeg",
    "/images/GovernorOfAndhraPradesh.jpeg",
    "/images/EasternNavalCommand.jpeg",
    "/images/EasternAirCommand.jpeg",
    "/images/ArmyEducationalCorps.jpeg",
    "/images/SainikWelfareAndhraPradesh.jpeg",
  ];

  const teamData = [
    {
      src: "/images/vinod-neb.png",
      name: "Late Wg. Cdr. Vinod Nebb (Retd)",
      award: " Vir Chakra & Bar (VrC)",
      patron: "patron",
    },
    {
      src: "/images/RDSharma.png",
      name: "Lt. Col. R.D. Sharma (Retd.)",
      award: "",
      patron: "patron",
    },
    {
      src: "/images/JSDhillon.png",
      name: "Lt. Gen. J.S. Dhillon (Retd), Vishisht Seva Medal (VSM)",
      award: " ",
      patron: "patron",
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
      award: "Head of PR &",
      patron: "Communications",
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    panNumber: "",
    address: "",
    amount: 0,
  });

  const [errors, setErrors] = useState({});
  const [donationType, setDonationType] = useState("anyAmount"); // "anyAmount" or "project"
  const [projectAmounts, setProjectAmounts] = useState({
    schoolFees: 0,
    medicalCare: 0,
    ration: 0,
  });
  const [want80GCertificate, setWant80GCertificate] = useState("no");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleRadioChange = (e) => {
    setDonationType(e.target.value);
    if (e.target.value === "project") {
      setFormData({ ...formData, amount: calculateTotalProjectAmount() });
    }
  };

  const handleCheckboxChange = (e, project) => {
    const value = projectAmounts[project] > 0 ? 0 : 1;
    setProjectAmounts({
      ...projectAmounts,
      [project]: value,
    });
    setFormData({ ...formData, amount: calculateTotalProjectAmount() });
  };

  const handleProjectAmountChange = (project, increment) => {
    const newAmount = projectAmounts[project] + increment;
    if (newAmount >= 0) {
      setProjectAmounts({
        ...projectAmounts,
        [project]: newAmount,
      });
      setFormData({ ...formData, amount: calculateTotalProjectAmount() });
    }
  };

  const calculateTotalProjectAmount = () => {
    return (
      projectAmounts.schoolFees * 2500 +
      projectAmounts.medicalCare * 2000 +
      projectAmounts.ration * 1250
    );
  };

  const handle80GChange = (e) => {
    setWant80GCertificate(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (want80GCertificate === "yes") {
      if (!formData.panNumber.trim())
        newErrors.panNumber = "PAN number is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }

    if (formData.amount <= 0)
      newErrors.amount = "Amount must be greater than zero";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("api/donate", formData);
      console.log(response.data);
     } catch (error) {
      console.error("Error:", error);
     }
  };

  return (
    <>
      <main className={styles.mainPage}>
        <div className="container">
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
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  disabled={donationType === "project"}
                />
                {errors.amount && (
                  <p className={styles.error}>{errors.amount}</p>
                )}
              </div>
              <div className={styles.amountOptions}>
                <div className={styles.operation}>
                  <input
                    type="radio"
                    id="anyAmount"
                    name="donationType"
                    value="anyAmount"
                    checked={donationType === "anyAmount"}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="anyAmount">Donate any amount</label>
                </div>
                <div className={styles.operation}>
                  <input
                    type="radio"
                    id="project"
                    name="donationType"
                    value="project"
                    checked={donationType === "project"}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="project">Donate to a specific project</label>
                </div>
              </div>
              {donationType === "project" && (
                <div className={styles.projectOptions}>
                  <div className={styles.project}>
                    <input
                      type="checkbox"
                      id="schoolFees"
                      name="schoolFees"
                      checked={projectAmounts.schoolFees > 0}
                      onChange={(e) => handleCheckboxChange(e, "schoolFees")}
                    />
                    <label htmlFor="schoolFees">
                      Sponsor a child's school fees (₹2500)
                    </label>
                    <div className={styles.projectAmount}>
                      <button
                        type="button"
                        onClick={() =>
                          handleProjectAmountChange("schoolFees", -1)
                        }
                        disabled={projectAmounts.schoolFees <= 0}
                      >
                        -
                      </button>
                      <span>{projectAmounts.schoolFees}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleProjectAmountChange("schoolFees", 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.project}>
                    <input
                      type="checkbox"
                      id="medicalCare"
                      name="medicalCare"
                      checked={projectAmounts.medicalCare > 0}
                      onChange={(e) => handleCheckboxChange(e, "medicalCare")}
                    />
                    <label htmlFor="medicalCare">
                      Provide medical care (₹2000)
                    </label>
                    <div className={styles.projectAmount}>
                      <button
                        type="button"
                        onClick={() =>
                          handleProjectAmountChange("medicalCare", -1)
                        }
                        disabled={projectAmounts.medicalCare <= 0}
                      >
                        -
                      </button>
                      <span>{projectAmounts.medicalCare}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleProjectAmountChange("medicalCare", 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.project}>
                    <input
                      type="checkbox"
                      id="ration"
                      name="ration"
                      checked={projectAmounts.ration > 0}
                      onChange={(e) => handleCheckboxChange(e, "ration")}
                    />
                    <label htmlFor="ration">Provide ration (₹1250)</label>
                    <div className={styles.projectAmount}>
                      <button
                        type="button"
                        onClick={() => handleProjectAmountChange("ration", -1)}
                        disabled={projectAmounts.ration <= 0}
                      >
                        -
                      </button>
                      <span>{projectAmounts.ration}</span>
                      <button
                        type="button"
                        onClick={() => handleProjectAmountChange("ration", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.inputField}>
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className={styles.error}>{errors.firstName}</p>
                )}
              </div>
              <div className={styles.inputField}>
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className={styles.error}>{errors.lastName}</p>
                )}
              </div>
              <div className={styles.inputField}>
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
              <div className={styles.inputField}>
                <label htmlFor="phoneNumber">Phone Number*</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <p className={styles.error}>{errors.phoneNumber}</p>
                )}
              </div>
              <div className={styles.inputField}>
                <label>Do you want 80G Certificate?</label>
                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="80GYes"
                    name="80GCertificate"
                    value="yes"
                    checked={want80GCertificate === "yes"}
                    onChange={handle80GChange}
                  />
                  <label htmlFor="80GYes">Yes</label>
                  <input
                    type="radio"
                    id="80GNo"
                    name="80GCertificate"
                    value="no"
                    checked={want80GCertificate === "no"}
                    onChange={handle80GChange}
                  />
                  <label htmlFor="80GNo">No</label>
                </div>
              </div>
              {want80GCertificate === "yes" && (
                <>
                  <div className={styles.inputField}>
                    <label htmlFor="panNumber">PAN Number*</label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                    />
                    {errors.panNumber && (
                      <p className={styles.error}>{errors.panNumber}</p>
                    )}
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="address">Address*</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <p className={styles.error}>{errors.address}</p>
                    )}
                  </div>
                </>
              )}
              <button type="submit">Donate Now</button>
            </form>
          </div>
          <div className={styles.rightSection}>
            <MySwiper images={images} />
          </div>
        </section>
        <section className={styles.teamSection}>
          <h2 className={styles.teamHeading}>Meet the Team</h2>
          <div className={styles.teamMembers}>
            <MySwiperTeamMember styles={styles} teamData={teamData} />
          </div>
        </section>
        <OneSwiper OneImage={images} />
      </main>
    </>
  );
}

<>{selectedOption === "project" && (
                <div className={styles.checkboxSection}>
                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id="schoolFees"
                      name="schoolFees"
                      checked={projectAmounts.schoolFees > 0}
                      onChange={(e) =>
                        handleProjectAmountChange(
                          "schoolFees",
                          e.target.checked ? 10000 : -10000
                        )
                      }
                    />
                    <label htmlFor="schoolFees">
                      Provide school fees to children of martyrs Rs. 10,000/-
                    </label>
                    {projectAmounts.schoolFees > 0 && (
                      <input
                        type="number"
                        min="1"
                        value={projectAmounts.schoolFees / 10000}
                        onChange={(e) =>
                          handleProjectAmountChange(
                            "schoolFees",
                            (e.target.valueAsNumber || 0) * 10000 -
                              projectAmounts.schoolFees
                          )
                        }
                      />
                    )}
                  </div>
                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id="medicalCare"
                      name="medicalCare"
                      checked={projectAmounts.medicalCare > 0}
                      onChange={(e) =>
                        handleProjectAmountChange(
                          "medicalCare",
                          e.target.checked ? 5000 : -5000
                        )
                      }
                    />
                    <label htmlFor="medicalCare">
                      Provide medical care to ailing ex-soldiers Rs. 5,000/-
                    </label>
                    {projectAmounts.medicalCare > 0 && (
                      <input
                        type="number"
                        min="1"
                        value={projectAmounts.medicalCare / 5000}
                        onChange={(e) =>
                          handleProjectAmountChange(
                            "medicalCare",
                            (e.target.valueAsNumber || 0) * 5000 -
                              projectAmounts.medicalCare
                          )
                        }
                      />
                    )}
                  </div>
                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id="provideRation"
                      name="provideRation"
                      checked={projectAmounts.provideRation > 0}
                      onChange={(e) =>
                        handleProjectAmountChange(
                          "provideRation",
                          e.target.checked ? 2000 : -2000
                        )
                      }
                    />
                    <label htmlFor="provideRation">
                      Provide ration to widows of martyrs Rs. 2,000/-
                    </label>
                    {projectAmounts.provideRation > 0 && (
                      <input
                        type="number"
                        min="1"
                        value={projectAmounts.provideRation / 2000}
                        onChange={(e) =>
                          handleProjectAmountChange(
                            "provideRation",
                            (e.target.valueAsNumber || 0) * 2000 -
                              projectAmounts.provideRation
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              )}
              <div className={styles.personalInfo}>
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phoneNumber">Phone Number*</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="panNumber">PAN Number*</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="address">Address*</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className={styles.rightSection}>
            <h2>Our Supporters</h2>
            <div className={styles.swiper}>
              <OneSwiper OneImage={images} />
            </div>
            <h2>Meet Our Team</h2>
            <div className={styles.team}>
              <MySwiperTeamMember styles={styles} teamData={teamData} />
            </div>
          </div></>
