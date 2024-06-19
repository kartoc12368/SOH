import Script from "next/script";
import Loading from "./loading";
export default function Page() {
  return (
    <>
      <div>
        <Script src="/location.js" />
        <h1>Hellllll</h1>
      </div>
    </>
  );
}
