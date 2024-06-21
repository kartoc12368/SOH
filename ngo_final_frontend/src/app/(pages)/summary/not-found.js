"use client";
import Header from "@/component/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(10); // Initial countdown value

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          router.replace("/");
        }
        return prevCount - 1;
      });
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(countdownInterval);
  }, [router]);

  return (
    <>
      <Header />
      <div className="mainNotfound">
        <h1>This page doesn't seem to exist.</h1>
        <p>It looks like the link pointing here was faulty.</p>
        <div className="notFoundRedirect">
          Redirecting to home page in {count} seconds...
        </div>
        <div className="notFoundRedirect">
          Go back to Home??
          {
            <a style={{ textDecoration: "none" }} href="/">
              &nbsp; Home
            </a>
          }
        </div>
      </div>
    </>
  );
}
