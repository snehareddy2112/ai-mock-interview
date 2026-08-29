import "./globals.css";

export const metadata = {
  title: "AI Mock Interview Assistant | Ace Your Next Technical & Behavioral Interview",
  description:
    "Practice realistic mock interviews powered by AI. Get instant score evaluations, actionable feedback, and dynamic follow-up questions tailored to your dream role.",
  keywords: "mock interview, ai interview, tech interview prep, system design, behavioral interview, leetcode, coding interview",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#090D16] text-slate-100 antialiased font-sans selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}