"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { LibraryProvider, useLibrary } from "@/context/LibraryContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { library, user, isLoading, refreshLibrary } = useLibrary();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const handleCreateLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);

    if (user) {
      const { error } = await supabase.from("libraries").insert({
        owner_id: user.id,
        name: newLibraryName || `${user.user_metadata?.first_name || 'My'}'s Library`
      });

      if (!error) {
        await refreshLibrary();
        window.location.reload();
      } else {
        alert("Failed to create library: " + error.message);
      }
    }
    setIsProvisioning(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-secondary-medium dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mb-4"></div>
          <p className="text-sm text-body dark:text-gray-400 animate-pulse">Synchronizing workspace...</p>
        </div>
      </div>
    );
  }

  if (!user && !isLoading) {
    router.push("/login");
    return null;
  }

  // Library Provisioning Screen
  if (!library) {
    return (
      <div className="min-h-screen bg-neutral-secondary-medium dark:bg-gray-950 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-base shadow-2xl p-10 border border-default-medium dark:border-gray-800 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-heading dark:text-white mb-2">Workspace Setup</h2>
          <p className="text-body dark:text-gray-400 mb-8">
            Create your digital library workspace to start managing seats and members.
          </p>

          <form onSubmit={handleCreateLibrary} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold text-heading dark:text-gray-300 uppercase tracking-wider mb-2 block text-center">
                Library Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 dark:text-white text-center"
                placeholder="e.g. City Central Library"
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
              />
            </div>
            <button
              disabled={isProvisioning}
              className="w-full bg-brand hover:bg-brand-strong text-white font-bold py-3 rounded-base transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
            >
              {isProvisioning ? "Creating..." : "Initialize Library"}
            </button>
          </form>

          <button onClick={handleLogout} className="mt-8 text-sm text-body dark:text-gray-500 hover:text-red-500 transition-colors">
            Logout and switch account
          </button>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Seats", href: "/dashboard/seats", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Members", href: "/dashboard/members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Bookings", href: "/dashboard/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  return (
    <div className="flex h-screen bg-neutral-secondary-medium dark:bg-gray-950 font-sans relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-default-medium dark:border-gray-800 
        flex-col flex transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10 relative">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center transition-transform hover:rotate-12">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-heading dark:text-white tracking-tight">
              LibFlow
            </h1>
            <button
              className="absolute right-0 top-0 p-2 md:hidden text-gray-400 hover:text-brand transition-colors"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-base transition-all group ${isActive
                    ? "bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-soft shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-neutral-secondary-medium dark:hover:bg-gray-800"
                    }`}
                >
                  <svg
                    className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-brand" : "text-gray-400 group-hover:text-body dark:group-hover:text-gray-300"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-default-medium dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand font-bold uppercase ring-2 ring-brand/10 shadow-sm">
              {user?.email?.[0] ?? "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-heading dark:text-gray-200 truncate">
                Admin Owner
              </p>
              <p className="text-[10px] text-body dark:text-gray-500 truncate leading-none mt-1">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-base transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-default-medium dark:border-gray-800 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:text-brand md:hidden transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-heading dark:text-white capitalize tracking-tight flex items-center">
              <span className="w-1.5 h-6 bg-brand rounded-full mr-2 hidden sm:block"></span>
              {pathname.split("/").pop() || "Overview"}
            </h2>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="relative md:block hidden">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                className="bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 text-xs rounded-base focus:ring-brand focus:border-brand block w-48 lg:w-64 pl-10 p-2 dark:text-white focus:outline-none transition-all focus:w-56 lg:focus:w-80"
                placeholder="Global search..."
              />
            </div>
            <button
              className="text-gray-600 dark:text-gray-400 hover:text-brand transition-colors relative"
              aria-label="View notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand rounded-full ring-2 ring-white dark:ring-gray-900 italic"></span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-neutral-secondary-medium/30 dark:bg-gray-950/30 p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LibraryProvider>
      <DashboardContent>{children}</DashboardContent>
    </LibraryProvider >
  );
}
