"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function NavigationEvents({ params }) {
  const router = useRouter();
  useEffect(() => {
    // Function to trigger Swal.fire on component mount
    const showSwal = () => {
      Swal.fire({
        title: "Donated Successfully",
        text: "Thanks for your donation!",
        icon: "success",
        confirmButtonText: "Done",
        confirmButtonColor: "#000080",
      }).then((result) => {
        if (result.isConfirmed) {
          router.replace(`/fundraiser/${params.id}`);
        }
      });
    };

    showSwal();
  }, []);

  return null;
}
