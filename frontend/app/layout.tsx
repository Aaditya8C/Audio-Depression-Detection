import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindWave — Audio Depression Analysis",
  description:
    "Upload a video to analyze emotional patterns in speech using deep learning and receive a depression risk assessment based on audio emotion recognition.",
  keywords: ["depression detection", "emotion recognition", "audio analysis", "mental health AI"],
  authors: [{ name: "MindWave Research" }],
  openGraph: {
    title: "MindWave — Audio Depression Analysis",
    description: "AI-powered depression risk screening via speech emotion recognition.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
