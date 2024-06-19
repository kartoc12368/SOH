"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiDonateHeart } from "react-icons/bi";
import { PiHandHeartDuotone } from "react-icons/pi";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import styles from "./fundraiser.module.css";

import Loading from "@/app/loading";
import Notfundraiser from "@/component/nofundraiser";
import Link from "next/link";
import { CiShare2 } from "react-icons/ci";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Modal } from "@nextui-org/react";
import Swal from "sweetalert2";

export default function page({ params }) {
  const [fundraiser, setFundraiser] = useState([]);
  const fundraiserID = params.id;
  const [activeTab, setActiveTab] = useState("myStory");
  const progressBarRef = useRef(null);
  const [startValue, setStartValue] = useState(0);
  const [gallery, setGallery] = useState(0);

  const [Isfundraiser, setIsfundraiser] = useState();
  const [loading, setloading] = useState(true);
  const [percentage, setPercentage] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(6);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [shareURL, setShareURL] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = (url) => {
    const message = ` ${fundraiser?.fundraiserPage?.resolution} ${url}`;
    setShareURL(message);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_serverAPI}/fundraiser-page/${fundraiserID}`,
          config
        );
        if (response.status === 200) {
          setFundraiser(response.data.data);
          setGallery(response.data.data.gallery);
          setIsfundraiser(true);
          setloading(false);
        }
      } catch (error) {
        console.error("Error fetching fundraisers:", error);
        setloading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const raisedAmount = fundraiser?.raised_amount;
    const targetAmount = fundraiser?.fundraiserPage?.target_amount;

    if (raisedAmount > 0 && targetAmount > 0) {
      const calculatedPercentage = Math.round(
        (raisedAmount / targetAmount) * 100
      );
      setPercentage(Math.min(calculatedPercentage, 100));
    } else {
      setPercentage(0);
    }
  }, [fundraiser]);

  useEffect(() => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const speed = 50;
    const endValue = percentage;
    let newValue = 0;

    const progressInterval = setInterval(() => {
      newValue++;
      setStartValue((prevValue) => {
        const newValue = Math.min(prevValue + 1, endValue);
        if (newValue === endValue) {
          clearInterval(progressInterval);
        }
        return newValue;
      });

      const progressValueElement = progressBar.querySelector(".percentage");
      if (progressValueElement) {
        progressValueElement.textContent = `(${endValue}%)`;
      }

      const innerCircleElement = progressBar.querySelector(".inner-circle");
      if (innerCircleElement) {
        innerCircleElement.style.backgroundColor = "white";
      }

      progressBar.style.background = `conic-gradient(#0FA900 ${
        newValue * 3.6
      }deg, #D2F2CF 0deg)`;
    }, speed);

    return () => clearInterval(progressInterval);
  }, [percentage]);

  // Pagination logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages =
    fundraiser?.gallery?.slice(indexOfFirstImage, indexOfLastImage) || [];

  const totalPages = Math.ceil(
    (fundraiser?.gallery?.length || 0) / imagesPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return loading ? (
    <Loading />
  ) : Isfundraiser ? (
    <>
      <main className={styles.mainClass}>
        <div className={styles.imgArea}>
          <img
            src="/images/HeroImage.png"
            alt="Our Soldier"
            height="400px"
            width="100%"
          />
        </div>
        <div className={styles.contributers}>
          <div>
            <div ref={progressBarRef} className={styles["circular-progress"]}>
              <div className={styles.subGoal}>
                <div className={styles["inner-circle"]}></div>
                <p className={styles.percentage}>({startValue}%)</p>
                <h2 className={styles.currentGoal}>
                  &#8377; {fundraiser?.raised_amount}
                </h2>
                <p className={styles.percentage}>
                  of{" "}
                  <span className={styles.totalGoal}>
                    &#8377; {fundraiser?.fundraiserPage?.target_amount}
                  </span>{" "}
                  Goal
                </p>
              </div>
              <div
                className={styles["progress-circle"]}
                style={{
                  background: `conic-gradient(#0FA900 ${
                    startValue * 3.6
                  }deg, #D2F2CF 0deg)`,
                }}
              />
            </div>
            <div className={styles.resolution} style={{}}>
              <div className={styles.resolutionBtn}>
                {showPopup && (
                  <div
                    className={styles.sharePopupOverlay}
                    onClick={closePopup}
                  >
                    <div
                      className={styles.sharePopup}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "-30px",
                          fontSize: "32px",
                        }}
                      >
                        Share this fundraiser
                      </h3>
                      <div className={styles.shareToggle}>
                        <FacebookShareButton url={shareURL}>
                          <FaFacebook
                            color="#1877F2"
                            className={styles.shareIcon}
                          />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareURL}>
                          <FaXTwitter className={styles.shareIcon} />
                        </TwitterShareButton>
                        <LinkedinShareButton url={shareURL}>
                          <FaLinkedin
                            color="#0a66c2"
                            className={styles.shareIcon}
                          />
                        </LinkedinShareButton>
                        <WhatsappShareButton url={shareURL}>
                          <FaWhatsapp
                            color="#25D366"
                            className={styles.shareIcon}
                          />
                        </WhatsappShareButton>
                      </div>
                      <button
                        className={styles.copy}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!copied) {
                            handleCopy();
                          }
                        }}
                      >
                        <span
                          data-text-end="Copied!"
                          data-text-initial="Copy to clipboard"
                          className={styles.tooltip}
                        ></span>
                        <span>
                          <svg
                            style={{ enablebackground: "new 0 0 512 512" }}
                            viewBox="0 0 6.35 6.35"
                            y="0"
                            x="0"
                            height="20"
                            width="20"
                            version="1.1"
                            className={styles.clipboard}
                          >
                            <g>
                              <path
                                fill="currentColor"
                                d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                              ></path>
                            </g>
                          </svg>
                          <svg
                            style={{ enablebackground: "new 0 0 512 512" }}
                            viewBox="0 0 24 24"
                            y="0"
                            x="0"
                            height="18"
                            width="18"
                            version="1.1"
                            className={styles.checkmark}
                          >
                            <g>
                              <path
                                data-original="#000000"
                                fill="currentColor"
                                d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                <a className={styles.resolutionLink}>
                  <button
                    type="button"
                    className={styles.mainbtn}
                    onClick={() => handleShare(window.location.href)}
                    style={{ marginBottom: "20px" }}
                  >
                    <CiShare2 />
                    Share
                  </button>
                </a>
                <Link
                  onClick={() => {
                    setloading(true);
                  }}
                  href={`/fundraiser/${params.id}/donate`}
                  className={styles.resolutionLink}
                >
                  <button
                    type="submit"
                    className={`${styles.mainbtn} ${styles.filled}`}
                  >
                    <BiDonateHeart />
                    Contribute
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.fundraiserResolution}>
            <div className={styles.fundraiserImg}>
              <Image
                src={`${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/profile-image/${fundraiser?.profileImage}`}
                alt=""
                width="200"
                height="200"
                className={styles.userImg}
              />
              <p className={styles.fundraiserName}>{fundraiser?.firstName} </p>
            </div>
            <div className={styles.fundraiserDetail}>
              <h1>About My Resolution</h1>
              <p>{fundraiser?.fundraiserPage?.resolution}</p>
            </div>
          </div>
        </div>
      </main>
      <article className={styles.article}>
        <button
          type="button"
          className={`${styles.userStory} ${
            activeTab === "myStory" ? `${styles.active}` : ""
          }`}
          onClick={() => handleTabChange("myStory")}
        >
          My Story
        </button>
        <button
          type="button"
          className={`${styles.userStory} ${
            activeTab === "gallery" ? `${styles.active}` : ""
          }`}
          onClick={() => handleTabChange("gallery")}
        >
          Gallery
        </button>
      </article>
      <aside className={styles.mainAside}>
        {activeTab === "myStory" ? (
          <div className={styles.leftAside}>
            <p className={styles.aboutMe}>
              {fundraiser?.fundraiserPage?.story || "No content to show"}
            </p>
            <h3 className={styles.reason}>Money Raised For</h3>
            <p className={styles.aboutMe}>
              {fundraiser?.fundraiserPage?.money_raised_for}
            </p>
          </div>
        ) : (
          <div className={styles.leftAside}>
            <div
              className={styles.galleryGrid}
              style={{
                display: "grid",
                gridGap: "22px",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              }}
            >
              {currentImages.map((image, index) => (
                <div key={index} className={styles.galleryImage}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/fundraiser-page/${image.image_url}`}
                    alt={`Image ${image}`}
                    className={styles.galleryImg}
                    height="200"
                    width="200"
                    onClick={() => {
                      Swal.fire({
                        imageUrl:
                          `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/fundraiser-page/${image.image_url}` ? (
                            `${process.env.NEXT_PUBLIC_serverAPI}/fundRaiser/fundraiser-page/${image.image_url}`
                          ) : (
                            <Loading />
                          ),
                        imageHeight: 500,
                        imageAlt: "A tall image",
                        showCloseButton: true,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`${styles.pageItem} ${
                    currentPage === index + 1 ? styles.activePage : ""
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.rightAside}>
          <div className={styles.container}>
            <h3 className={styles.supporters}>Our Supporters</h3>
            <div className={styles.allSupporters}>
              {fundraiser?.supporters && fundraiser?.supporters.length > 0 ? (
                fundraiser?.supporters.map((supporter, index) => (
                  <p key={index} className={styles.ourSupporters}>
                    <PiHandHeartDuotone fill="#000080" />
                    {supporter}
                  </p>
                ))
              ) : (
                <p>No supporters found.</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  ) : (
    <Notfundraiser />
  );
}
