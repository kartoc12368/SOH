"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { BiSolidReport } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import styles from "./fundraiserSidebar.module.css";
import { showSwal } from "@/validation";
import { LuClipboardCopy } from "react-icons/lu";

export default function AsideBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className={styles.leftAside}>
        <div className={styles.container}>
          <Link
            onClick={() => {
              setLoading(true);
            }}
            href="/fundraiserAdmin"
          >
            <p
              className={`tabButton ${
                pathname === "/fundraiserAdmin" ? styles.active : ""
              }`}
            >
              <MdDashboard /> Dashboard
            </p>
          </Link>
          <Link
            onClick={() => {
              setLoading(true);
            }}
            href="/fundraiserAdmin/update"
          >
            <p
              className={`tabButton ${
                pathname === "/fundraiserAdmin/update" ? styles.active : ""
              }`}
            >
              <AiFillInfoCircle />
              Fundraiser
            </p>
          </Link>
          <Link
            onClick={() => {
              setLoading(true);
            }}
            href="/fundraiserAdmin/photo"
          >
            <p
              className={`tabButton ${
                pathname === "/fundraiserAdmin/photo" ? styles.active : ""
              }`}
            >
              <i className={`fas fa-image `}></i>
              Photos
            </p>
          </Link>
          <Link
            onClick={() => {
              setLoading(true);
            }}
            href="/fundraiserAdmin/report"
          >
            <p
              className={`tabButton ${
                pathname === "/fundraiserAdmin/report" ? styles.active : ""
              }`}
            >
              <BiSolidReport />
              Donations Report
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
export const TopHeader = ({ link }) => {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.main}>
          <div className={styles.leftSection}>
            <div className={styles.content}>
              <h1>Heroes Who Shielded Us, Let's Shield Their Future.</h1>
              <p>
                Creating a society where every family of our defence
                <br /> martyrs & veterans is self-dependent and can live a<br />
                healthy life like us.
              </p>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.ImageArea}>
              <img
                style={{ width: "100%", height: "507px"}}
                src="/images/FrontImage.png"
                alt="Soldiers"
                className={styles.soldierImg}
              />
            </div>
          </div>
        </div>
        <div className={styles.lowerPart}>
          <p>
            Fundraising Page Link:
            <a
              className={styles.tooltip}
              href={`${process.env.NEXT_PUBLIC_frontEndAPI}/fundraiser/${link}`}
              target="_blank"
            >
              {link == "undefined" ? "------------------------" : link}
            </a>
          </p>
          <p>
            <a
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${process.env.NEXT_PUBLIC_frontEndAPI}/fundraiser/${link}`
                  )
                  .then(
                    showSwal(
                      "success",
                      "Fundraiser Page Link",
                      "Copied to ClipBoard"
                    )
                  );
              }}
            >
              <LuClipboardCopy />
            </a>
          </p>
        </div>
      </section>
    </>
  );
};
