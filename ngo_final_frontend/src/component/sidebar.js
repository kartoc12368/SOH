"use client";
import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";

import { BsPersonRaisedHand } from "react-icons/bs";
import { TbPasswordFingerprint } from "react-icons/tb";
import {
  MdAddCircleOutline,
  MdDashboard,
  MdOutlineWorkHistory,
} from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.leftSection}>
      <Link href="/admin">
        <p
          className={`${styles.link} ${
            pathname === "/admin" ? `${styles.active}` : ""
          }`}
        >
          <MdDashboard className={styles.icon} />
          Dashboard
        </p>
      </Link>
      <Link href="/admin/generatecode">
        <p
          className={`${styles.link} ${
            pathname === "/admin/generatecode" ? `${styles.active}` : ""
          }`}
        >
          <TbPasswordFingerprint className={styles.icon} />
          Generate Fundraiser
        </p>
      </Link>
      <Link href="/admin/fundraisers">
        <p
          className={`${styles.link} ${
            pathname === "/admin/fundraisers" ? `${styles.active}` : ""
          }`}
        >
          <BsPersonRaisedHand className={styles.icon} />
          All Fundraiser
        </p>
      </Link>
      <Link href="/admin/adddonation">
        <p
          className={`${styles.link} ${
            pathname === "/admin/adddonation" ? `${styles.active}` : ""
          }`}
        >
          <MdAddCircleOutline className={styles.icon} />
          Offline Donation
        </p>
      </Link>
      <Link href="/admin/donationHistory">
        <p
          className={`${styles.link} ${
            pathname === "/admin/donationHistory" ? `${styles.active}` : ""
          }`}
        >
          <MdOutlineWorkHistory className={styles.icon} />
          Donation History
        </p>
      </Link>
    </div>
  );
}
