import "./globals.css";

export const metadata = {
  title: "AI Mock Interview Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        {children}
      </body>
    </html>
  );
}