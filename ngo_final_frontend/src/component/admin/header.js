"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import styles from "../header.module.css"; // Assuming this imports your custom styles

import { useEffect, useState } from "react";
import defaultProfileImage from "../../../public/images/profile.jpeg";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Swal from "sweetalert2";
import { showSwal } from "@/validation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isopen, setisopen] = useState(false);
  const toggle = () => {
    setisopen(!isopen);
  };
  useEffect(() => {
    if (Cookies.get("token")) {
      const decodedToken = jwtDecode(Cookies.get("token"));
      setUser(decodedToken);
    } else {
      setUser(null);
    }
  }, [Cookies.get("token")]);

  const handleLogout = (e) => {
    showSwal("info", "Logging Out", "Please wait...", null, false);

    setTimeout(() => {
      try {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        router.replace("/login");
      } catch (error) {}
    }, 2000);
  };
  return (
    <header className={styles.head}>
      <div className={styles.logo}>
        <Image
          priority
          src="/images/ProjectLogo.png"
          alt="Webpage Logo"
          className={styles.logoImg}
          height="100"
          width="100"
        />
      </div>
      <div className={styles.TagLine}>Support Our Heroes</div>
      <div className={styles.headerBtn}>
        <div className={styles.profileimg}>
          <button
            type="button"
            onClick={toggle}
            className={styles.profilebutton}
          >
            <Image
              // src={!user.profileImage?(/images/profile) : (user.profileImage)}
              src={defaultProfileImage}
              alt="profile"
              width="40"
              height="40"
            />
            {!isopen ? (
              <div className={styles["custom-dropdown"]}>
                <div className={styles["selcted-option"]}></div>
              </div>
            ) : (
              <>
                <div className={styles["custom-dropdown"]}>
                  <div className={styles["selcted-option"]}>
                    <i className={`fa-solid fa-angle-up fa-rotate-180`}></i>
                  </div>
                </div>
                <ul className={styles["dropdown-options"]}>
                  <li data-value="option3" style={{ color: "red" }}>
                    <a
                      onClick={(e) => handleLogout()}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Log out
                    </a>
                  </li>
                </ul>
              </>
            )}
          </button>
        </div>
        <i className={`fa-solid fa-bars ${styles.headerIcon}`}></i>
      </div>
    </header>
  );
}
