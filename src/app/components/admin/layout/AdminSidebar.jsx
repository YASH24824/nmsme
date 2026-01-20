// components/admin/layout/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 6h18a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z"
          />
        </svg>
      ),
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    // {
    //   name: "Analytics",
    //   href: "/admin/analytics",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   name: "Settings",
    //   href: "/admin/settings",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    //       />
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <>
      {/* Mobile overlay - 100% visible when toggled */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-screen
        overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400
        scrollbar-thumb-rounded-full
      `}
      >
        {/* Logo section */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-800">AdminPanel</span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                  }
                  mb-1 last:mb-0
                `}
                onClick={() => {
                  // Close sidebar on mobile when a link is clicked
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <div
                  className={`
                  flex-shrink-0 p-2 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }
                `}
                >
                  {item.icon}
                </div>
                <span className="font-medium flex-1">{item.name}</span>

                {isActive && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        /* Modern thin scrollbar for Webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-rounded-full::-webkit-scrollbar-thumb {
          border-radius: 20px;
        }

        /* Modern scrollbar for Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }

        .scrollbar-thin:hover {
          scrollbar-color: #9ca3af transparent;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
