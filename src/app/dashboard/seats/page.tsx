"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLibrary } from "@/context/LibraryContext";

interface Seat {
  id: string;
  seat_number: string;
  is_active: boolean;
  library_id: string;
}

export default function SeatsPage() {
  const { library, user, isLoading: isLibLoading } = useLibrary();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSeats = async () => {
    if (!library) return;

    const { data, error } = await supabase
      .from("seats")
      .select("*")
      .eq("library_id", library.id)
      .order("seat_number", { ascending: true });

    if (!error && data) {
      setSeats(data);
    }
  };

  useEffect(() => {
    if (!isLibLoading && library) {
      fetchSeats();
    }
  }, [library, isLibLoading]);

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!library) return;
    setLoading(true);

    const { error } = await supabase.from("seats").insert([
      {
        seat_number: seatNumber,
        library_id: library.id,
      },
    ]);

    if (!error) {
      setSeatNumber("");
      setIsModalOpen(false);
      fetchSeats();
    } else {
      alert("Error adding seat: " + error.message);
    }
    setLoading(false);
  };

  const toggleSeatStatus = async (seat: Seat) => {
    const { error } = await supabase
      .from("seats")
      .update({ is_active: !seat.is_active })
      .eq("id", seat.id);

    if (!error) {
      setSeats(seats.map(s => s.id === seat.id ? { ...s, is_active: !s.is_active } : s));
    }
  };

  const filteredSeats = seats.filter(seat =>
    seat.seat_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading dark:text-white">Seats Inventory</h1>
          <p className="text-body dark:text-gray-400 text-sm mt-1">Manage all available study units in your library.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-brand-strong text-white px-5 py-2.5 rounded-base font-medium transition-all shadow-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Seat</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-base border border-default-medium dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-default-medium dark:border-gray-800 flex items-center justify-between bg-neutral-secondary-medium/50 dark:bg-gray-800/50">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search seat number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-default-medium dark:border-gray-700 rounded-base pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand dark:text-white"
            />
          </div>
          <div className="text-xs text-body dark:text-gray-400 font-medium">
            Total Seats: {seats.length}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredSeats.map((seat) => (
              <div
                key={seat.id}
                className={`group relative p-4 rounded-base border transition-all duration-300 ${seat.is_active
                  ? "bg-white dark:bg-gray-900 border-default-medium dark:border-gray-800 hover:border-brand hover:shadow-md"
                  : "bg-gray-50 dark:bg-gray-800/30 border-dashed border-gray-300 dark:border-gray-700 opacity-75"
                  }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${seat.is_active ? "bg-brand/10 text-brand" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="font-bold text-heading dark:text-white">{seat.seat_number}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${seat.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500"
                    }`}>
                    {seat.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleSeatStatus(seat)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-brand"
                    title={seat.is_active ? "Deactivate" : "Activate"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSeats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
              </div>
              <h3 className="font-semibold text-heading dark:text-white">No seats found</h3>
              <p className="text-body dark:text-gray-400 text-sm max-w-xs mx-auto mt-2">
                Either you haven't added any seats yet or your search criteria didn't match anything.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Seat Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-base shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-default-medium dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-heading dark:text-white">Add New Study Unit</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddSeat} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading dark:text-gray-300 mb-2">
                  Seat Number / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. S-101, Desk-A"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand dark:text-white"
                  required
                  autoFocus
                />
                <p className="text-xs text-body dark:text-gray-500 mt-2">
                  Assign a unique identifier for this seat within your library.
                </p>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-default-medium dark:border-gray-700 text-body dark:text-gray-300 font-medium rounded-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand text-white font-medium rounded-base px-4 py-2.5 hover:bg-brand-strong transition-all focus:ring-4 focus:ring-brand/20 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Confirm Addition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
