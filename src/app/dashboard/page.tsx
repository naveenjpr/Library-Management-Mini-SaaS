"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useLibrary } from "@/context/LibraryContext";

export default function DashboardPage() {
  const router = useRouter();
  const { library, isLoading: isLibLoading } = useLibrary();
  const [stats, setStats] = useState({
    seats: 0,
    members: 0,
    activeBookings: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!library) return;

      try {
        // Parallel fetch for stats
        const [seatsCount, membersCount, bookingsCount] = await Promise.all([
          supabase.from("seats").select("*", { count: 'exact', head: true }).eq("library_id", library.id),
          supabase.from("members").select("*", { count: 'exact', head: true }).eq("library_id", library.id),
          supabase.from("bookings").select("*", { count: 'exact', head: true }).eq("library_id", library.id).eq("status", "active"),
        ]);

        setStats({
          seats: seatsCount.count || 0,
          members: membersCount.count || 0,
          activeBookings: bookingsCount.count || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (!isLibLoading && library) {
      fetchStats();
    }
  }, [library, isLibLoading]);

  if (isLibLoading || isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  const libraryName = library?.name || "your library";

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-heading dark:text-white tracking-tight">
          Welcome back to {libraryName || "your library"}
        </h1>
        <p className="text-body dark:text-gray-400 max-w-2xl">
          Everything is running smoothly. Here's what's happening in your library today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        {[
          { label: "Total Capacity", value: stats.seats, color: "brand", href: "/dashboard/seats", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
          { label: "Registered Members", value: stats.members, color: "green", href: "/dashboard/members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
          { label: "Active Reservations", value: stats.activeBookings, color: "amber", href: "/dashboard/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        ].map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group p-6 bg-white dark:bg-gray-900 rounded-base border border-default-medium dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${card.color}-500/10 dark:bg-${card.color}-500/20 flex items-center justify-center text-${card.color}-600 dark:text-${card.color}-400 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <p className="text-sm font-medium text-body dark:text-gray-400">{card.label}</p>
            <h2 className="text-3xl font-bold text-heading dark:text-white mt-1">{card.value}</h2>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-base border border-default-medium dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-heading dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => router.push('/dashboard/seats')} className="p-4 bg-neutral-secondary-medium dark:bg-gray-800/50 rounded-base border border-dashed border-default-medium dark:border-gray-700 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
              Add Seats
            </button>
            <button onClick={() => router.push('/dashboard/members')} className="p-4 bg-neutral-secondary-medium dark:bg-gray-800/50 rounded-base border border-dashed border-default-medium dark:border-gray-700 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
              Add Members
            </button>
            <button onClick={() => router.push('/dashboard/bookings')} className="p-4 bg-neutral-secondary-medium dark:bg-gray-800/50 rounded-base border border-dashed border-default-medium dark:border-gray-700 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
              Quick Booking
            </button>
            <button className="p-4 bg-neutral-secondary-medium dark:bg-gray-800/50 rounded-base border border-dashed border-default-medium dark:border-gray-700 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
              Reports
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}
