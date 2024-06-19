import Header from "@/component/header";
import FundraiserContextData from "@/context/FundraiserContext";

export const metadata = {
  title: "Fundraiser@Support Our Heroes",
  description: "Welcome Fundraiser",
};

export default function RootLayout({ children }) {
  return (
    <>
      <FundraiserContextData>{children}</FundraiserContextData>
    </>
  );
}
