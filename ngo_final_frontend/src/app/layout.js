import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import "./globals.css";
import RefreshContext from "@/context/refreshContext";

export const metadata = {
  title: "Support Our Heroes - Serving those who fought for us",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <>
      <ErrorBoundary fallback={<Error />}>
        <RefreshContext>
          <html>{children}</html>
        </RefreshContext>
      </ErrorBoundary>
    </>
  );
}
