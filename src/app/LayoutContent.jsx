"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ReduxProviderWrapper from "./lib/redux/ReduxProviderWrapper";
import UserProvider from "./lib/UserProvider";
import AdminSidebar from "./components/admin/layout/AdminSidebar";
import { useState } from "react";
import AdminHeader from "./components/admin/layout/AdminHeader";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ReduxProviderWrapper>
      <UserProvider>
        {!isAdminRoute ? (
          // Main Layout (Buyer/Seller)
          <>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </>
        ) : (
          // Admin Layout
          <div className="flex h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <AdminSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Main Admin Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

              {/* Admin Page Content */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                {children}
              </main>
            </div>
          </div>
        )}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </UserProvider>
    </ReduxProviderWrapper>
  );
}
