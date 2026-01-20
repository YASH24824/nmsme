"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  Users,
  Building,
} from "lucide-react";
import { fetchUserProfile } from "../lib/redux/slices/profileSlice";
import Image from "next/image";

export default function Navbar() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.profile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const navTabs = [
    { name: "Home", route: "/" },
    { name: "Marketplace", route: "/listings" },
    { name: "Upgrade Now", route: "/upgrade-now" },
    ...(userData?.role === "seller"
      ? [{ name: "Lead Hub", route: "/seller/leads" }]
      : []),
    { name: "Privacy Policy", route: "/privacy-policy" },
    // seller-only tab (restored)
  ];

  useEffect(() => {
    // initializeAuth extracted for reuse
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const hasToken = !!token;
      setIsLoggedIn(hasToken);

      if (hasToken) {
        dispatch(fetchUserProfile())
          .unwrap()
          .catch((error) => {
            // Restore previous behavior: log error, clear token and login state
            console.error("Failed to fetch user profile:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // restored
            setIsLoggedIn(false);
          })
          .finally(() => {
            setIsInitializing(false);
          });
      } else {
        setIsInitializing(false);
      }
    };

    // initial run
    initializeAuth();

    // handle storage changes (other tabs)
    const handleStorageChange = (e) => {
      // only re-init when token changed
      if (!e || e.key === "token") initializeAuth();
    };

    // custom auth-change event (restored)
    const handleAuthChange = () => {
      initializeAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange); // restored

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // restore full old logout behavior
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // restored
    // notify other tabs and custom listeners
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // redirect
    window.location.href = "/";
  };

  // Loading skeleton (keeps new UI)
  if (isInitializing || loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-700)] rounded-xl animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-20 h-6 bg-gray-300 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden group-hover:shadow-sm transition-all duration-300">
                <Image
                  src="/MsmeguruLogo-removebg-preview.png"
                  alt="MSME Guru Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MSME Guru
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navTabs.map((tab, idx) => (
                <Link
                  key={idx}
                  href={tab.route}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-[var(--color-accent-700)] transition-all duration-200 rounded-xl font-medium group relative"
                >
                  <span>{tab.name}</span>
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-700)] transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Auth */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                  >
                    {userData?.avatar_url ? (
                      <img
                        src={`${baseUrl}${userData.avatar_url}`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-accent-700)] shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-700)] flex items-center justify-center shadow-sm">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 max-w-24 truncate">
                        {userData?.fullname || userData?.username || "User"}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {userData?.role || "user"}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-accent-100)] border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userData?.fullname || userData?.username || "User"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 capitalize">
                            {userData?.role || "user"}
                          </p>
                          {userData?.has_complete_profile && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-150"
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        {userData?.role === "buyer" && (
                          <>
                            <Link
                              href="/my-leads"
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-150"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Building size={18} />
                              <span>My Inquiries</span>
                            </Link>
                          </>
                        )}
                        {/* Seller-specific links (restored) */}
                        {userData?.role === "seller" && (
                          <>
                            <Link
                              href="/list-products"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg"
                            >
                              <Briefcase size={18} />
                              <span>List Products</span>
                            </Link>

                            <Link
                              href="/seller/leads"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg"
                            >
                              <Users size={18} />
                              <span>Lead Management</span>
                            </Link>
                          </>
                        )}

                        {/* Buyer link intentionally NOT restored per your choice */}

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                        >
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-800)]"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200"
        >
          <div className="px-6 py-4 space-y-1">
            {navTabs.map((tab, idx) => (
              <Link
                key={idx}
                href={tab.route}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xl transition-all duration-200 font-medium text-lg"
              >
                <span>{tab.name}</span>
              </Link>
            ))}

            {isLoggedIn && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xl font-medium"
                >
                  <User size={20} />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
