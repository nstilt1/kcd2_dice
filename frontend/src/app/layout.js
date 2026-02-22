import localFont from "next/font/local";
import "./globals.css";
import GamblerBanner from "../components/GamblerBanner";
import { DiceWasmProvider } from "@/wasm/DiceWasmProvider";

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
  title: "KCD2 Dice Simulator",
  description: "KCD2 Dice Simulator, presented by Altered Brain Chemistry.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DiceWasmProvider>
          {children}
        </DiceWasmProvider>
      <GamblerBanner />
      </body>
    </html>
  );
}
