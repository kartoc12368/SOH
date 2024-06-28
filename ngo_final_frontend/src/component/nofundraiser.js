"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CountdownRedirect({ initialCount, redirectUrl, message }) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      clearInterval(countdownInterval);
      router.replace(redirectUrl);
    }

    return () => clearInterval(countdownInterval);
  }, [count, router, redirectUrl]);

  return (
    <div
      style={{
        fontSize: "2rem",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        No Fundraiser found!
      </div>
      <div style={{ fontSize: "2rem" }}>
        {message} in {count} seconds...
      </div>
    </div>
  );
}

export default function Notfundraiser() {
  return (
    <CountdownRedirect
      initialCount={10}
      redirectUrl="/"
      message="Redirecting to home page"
    />
  );
}

export function NotfundraiserDonate() {
  return (
    <CountdownRedirect
      initialCount={5}
      redirectUrl="https://supportourheroes.in/donate-now"
      message="Redirecting to donation page"
    />
  );
}
