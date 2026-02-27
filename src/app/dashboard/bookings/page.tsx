"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLibrary } from "@/context/LibraryContext";

interface Seat {
  id: string;
  seat_number: string;
  is_active: boolean;
}

interface Member {
  id: string;
  name: string;
  active_bookings?: number;
}

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  seats: { seat_number: string };
  members: { name: string };
}

export default function BookingsPage() {
  const { library, isLoading: isLibLoading } = useLibrary();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState({
    seatId: "",
    memberId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!library) return;

    // Fetch Seats
    const { data: seatsData } = await supabase
      .from("seats")
      .select("id, seat_number, is_active")
      .eq("library_id", library.id)
      .eq("is_active", true);

    // Fetch Members with their active booking count
    const { data: membersData } = await supabase
      .from("members")
      .select("id, name")
      .eq("library_id", library.id);

    // Fetch Bookings with relations
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        status,
        seats (seat_number),
        members (name)
      `)
      .eq("library_id", library.id)
      .order("booking_date", { ascending: false });

    if (seatsData) setSeats(seatsData);
    if (membersData) setMembers(membersData);
    if (bookingData) setBookings(bookingData as any);
  };

  useEffect(() => {
    if (!isLibLoading && library) {
      fetchData();
    }
  }, [library, isLibLoading]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!library) return;
    setLoading(true);
    setErrorStatus(null);

    const { error: insertError } = await supabase.from("bookings").insert({
      seat_id: formData.seatId,
      member_id: formData.memberId,
      booking_date: formData.date,
      library_id: library.id,
    });

    if (insertError) {
      if (insertError.message.includes("Member already has 2 active bookings")) {
        const member = members.find(m => m.id === formData.memberId);
        setErrorStatus(`• A member cannot have more than 2 active bookings.\nMember Name: ${member?.name || 'Selected Member'}`);
        // Handled technical constraint error
      } else if (insertError.message.includes("idx_unique_seat_booking_date")) {
        const seat = seats.find(s => s.id === formData.seatId);
        setErrorStatus(`• This seat (${seat?.seat_number || 'selected'}) is already booked for the selected date.\nPlease choose another seat or different date.`);
      }
      else {
        setErrorStatus(insertError.message);
      }
    } else {
      setFormData({ ...formData, seatId: "", memberId: "" });
      setIsModalOpen(false);
      fetchData();
    }
    setLoading(false);
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: 'cancelled' })
      .eq("id", id);

    if (!error) fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading dark:text-white">Reservation Desk</h1>
          <p className="text-body dark:text-gray-400 text-sm mt-1">Schedule and manage seat assignments for your members.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand cursor-pointer hover:bg-brand-strong text-white px-5 py-2.5 rounded-base font-medium transition-all shadow-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>New Reservation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Status Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-base border border-default-medium dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-heading dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-brand/5 dark:bg-brand/10 rounded-base">
                <span className="text-sm font-medium text-brand">Today's Bookings</span>
                <span className="text-lg font-bold text-brand">
                  {bookings.filter(b => b.booking_date === new Date().toISOString().split('T')[0] && b.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-base">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Total Active</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  {bookings.filter(b => b.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-base border border-default-medium dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-default-medium dark:border-gray-800 bg-neutral-secondary-medium/50 dark:bg-gray-800/50">
              <h3 className="text-sm font-bold text-heading dark:text-gray-300">Recent Reservations</h3>
            </div>
            <div className="divide-y divide-default-medium dark:divide-gray-800">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-neutral-secondary-medium/20 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-base flex flex-col items-center justify-center ${booking.status === 'active' ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                      }`}>
                      <span className="text-[10px] font-bold uppercase leading-none">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-none">{new Date(booking.booking_date).getDate()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-heading dark:text-white">Seat {booking.seats?.seat_number}</p>
                      <p className="text-xs text-body dark:text-gray-400">{booking.members?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${booking.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {booking.status}
                    </span>
                    {booking.status === 'active' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs cursor-pointer font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-body dark:text-gray-500 text-sm">No reservations found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-base shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-default-medium dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-heading dark:text-white">Secure a Seat</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-8 space-y-6">
              {errorStatus && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-base flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 whitespace-pre-line">{errorStatus}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-heading dark:text-gray-300 block mb-2">Member</label>
                  <select
                    value={formData.memberId}
                    onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                    className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 dark:text-white"
                    required
                  >
                    <option value="">Choose member...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-heading dark:text-gray-300 block mb-2">Seat</label>
                    <select
                      value={formData.seatId}
                      onChange={e => setFormData({ ...formData, seatId: e.target.value })}
                      className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 dark:text-white"
                      required
                    >
                      <option value="">Select No...</option>
                      {seats.map(s => <option key={s.id} value={s.id}>{s.seat_number}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-heading dark:text-gray-300 block mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 dark:text-white"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-default-medium dark:border-gray-700 text-body dark:text-gray-300 font-bold rounded-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand text-white font-bold rounded-base px-4 py-3 hover:bg-brand-strong transition-all focus:ring-4 focus:ring-brand/20 shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
