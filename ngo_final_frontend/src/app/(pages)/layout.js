import Header from "@/component/header";
import "../globals.css";
import Footer from "@/component/footer";
import { Inter } from "next/font/google";
import Loading from "../loading";
import notFound from "../not-found";
import Notfundraiser from "@/component/nofundraiser";

export const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <>
      <html>
        <head>
          <link rel="icon" href="/images/favicon.ico" />
        </head>
        <body className={inter.className}>
          <Header />
          <div style={{ minHeight: "70vh" }}>
            {!children && !notFound && !Notfundraiser ? <Loading /> : children}
          </div>
          <Footer />
        </body>
      </html>
    </>
  );
}
