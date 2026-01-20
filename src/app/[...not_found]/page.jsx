// File: app/[...not_found]/page.jsx
// This catches all unmatched routes and shows the 404 page
import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
  notFound();
}

export async function generateMetadata() {
  return {
    title: "Page Not Found - 404 | MSME Guru",
    description: "The page you are looking for does not exist.",
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: "var(--color-accent-300)",
      }, // Updated
      {
        media: "(prefers-color-scheme: dark)",
        color: "var(--color-accent-900)",
      }, // Updated
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "404 - Page Not Found",
      description:
        "The page you're seeking doesn't exist. Explore MSME Guru for verified business resources.",
      type: "website",
      siteName: "MSME Guru",
      url: "/404",
      images: [
        {
          url: "/og-404.png",
          width: 1200,
          height: 630,
          alt: "404 Not Found",
        },
      ],
    },
  };
}
