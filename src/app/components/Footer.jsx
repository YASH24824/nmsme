"use client";

import { motion } from "framer-motion";
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  // Newsletter skeleton
  const NewsletterForm = () => {
    if (!isMounted) {
      return (
        <div className="flex">
          <div className="bg-[var(--color-accent-800)] text-white px-4 py-3 rounded-l-lg flex-1 h-[48px] animate-pulse"></div>
          <div className="bg-gradient-to-r from-[var(--color-accent-900)] to-[var(--color-accent-700)] px-6 py-3 rounded-r-lg h-[48px] w-16 animate-pulse"></div>
        </div>
      );
    }

    return (
      <form onSubmit={handleNewsletterSubmit} className="flex">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            bg-[var(--color-accent-800)] text-white 
            px-4 py-3 rounded-l-lg 
            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] 
            flex-1 placeholder-[var(--color-accent-300)]
          "
          required
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            bg-gradient-to-r 
            from-[var(--color-accent-900)] 
            to-[var(--color-accent-700)] 
            px-6 py-3 rounded-r-lg 
            font-semibold 
            hover:shadow-lg 
            hover:shadow-[var(--color-accent-500)]/40 
            transition-all duration-200 
            whitespace-nowrap
          "
        >
          Join
        </motion.button>
      </form>
    );
  };

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="relative w-18 h-18 rounded-xl overflow-hidden group-hover:shadow-sm transition-all duration-300">
                <Image
                  src="/MsmeguruLogo-removebg-preview.png"
                  alt="MSME Guru Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-300)] bg-clip-text text-transparent">
                MSME Guru
              </span>
            </div>

            <p className="text-[var(--color-accent-200)] mb-6 leading-relaxed">
              Building the future of digital experiences with innovative
              solutions and modern design.
            </p>

            <div className="flex space-x-4">
              {[FiTwitter, FiFacebook, FiInstagram, FiLinkedin].map(
                (Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="
                    bg-[var(--color-accent-800)] p-3 rounded-lg 
                    hover:bg-[var(--color-accent-700)]
                    transition-colors duration-200
                  "
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Listings", href: "/listings" },
                { name: "My Leads", href: "/my-leads" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Profile", href: "/profile" },
                { name: "Seller Leads", href: "/seller/leads" },
                { name: "Upgrade Now", href: "/upgrade-now" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="
                      text-[var(--color-accent-200)] 
                      hover:text-white 
                      transition-colors duration-200 block py-1
                    "
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3">
              {[
                "Documentation",
                "Blog",
                "Help Center",
                "Community",
                "API Status",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                      text-[var(--color-accent-200)] 
                      hover:text-white 
                      transition-colors duration-200 block py-1
                    "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6">Stay Updated</h3>

            <p className="text-[var(--color-accent-200)] mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>

            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-[var(--color-accent-800)] mt-12 pt-8 text-center text-[var(--color-accent-200)]">
          <p>&copy; 2025 MSME Guru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
