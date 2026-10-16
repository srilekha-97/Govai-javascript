import localFont from "next/font/local";
import "./globals.css";
const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});
export const metadata = {
    title: "GovAI Studio | AI Model Governance & Responsible AI Lifecycle Platform",
    description: "End-to-end AI model lifecycle governance platform with version comparison, fairness auditing, compliance tracking, and auditability.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8F5F0] text-stone-900 min-h-screen`}>
        {children}
      </body>
    </html>);
}
