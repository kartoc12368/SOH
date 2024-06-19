import Header from "@/component/admin/header";

export const metadata = {
  title: "Admin@Support Our Heroes",
  description: "Welcome Admin",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html>
        <head>
          <link rel="icon" href="/images/favicon.ico" />
        </head>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </>
  );
}
