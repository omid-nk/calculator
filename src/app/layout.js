import { Michroma } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Calculator",
  description: "A futuristic calculator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${michroma.variable} h-full`}>
      <body className="bg-background font-michroma relative isolate min-h-dvh overflow-x-hidden text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="ambient-background absolute inset-0" />

          <div className="ambient-grid absolute inset-0 opacity-[0.045]" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(0_0_0/65%)_100%)]" />
        </div>

        <main className="grid min-h-dvh place-items-center px-4 py-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
