"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLibrary } from "@/context/LibraryContext";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  library_id: string;
  membership_type: string;
  join_date: string;
}

export default function MembersPage() {
  const { library, isLoading: isLibLoading } = useLibrary();
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membership_type: "basic"
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembers = async () => {
    if (!library) return;

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("library_id", library.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMembers(data);
    }
  };

  useEffect(() => {
    if (!isLibLoading && library) {
      fetchMembers();
    }
  }, [library, isLibLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!library) return;
    setLoading(true);

    if (editingId) {
      await supabase
        .from("members")
        .update(formData)
        .eq("id", editingId);
    } else {
      await supabase.from("members").insert([{
        ...formData,
        library_id: library.id
      }]);
    }

    setFormData({ name: "", email: "", phone: "", membership_type: "basic" });
    setEditingId(null);
    setIsModalOpen(false);
    fetchMembers();
    setLoading(false);
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      membership_type: member.membership_type || "basic"
    });
    setIsModalOpen(true);
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading dark:text-white">Member Directory</h1>
          <p className="text-body dark:text-gray-400 text-sm mt-1">Manage and track your library's registered members.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", email: "", phone: "", membership_type: "basic" });
            setIsModalOpen(true);
          }}
          className="cursor-pointer bg-brand hover:bg-brand-strong text-white px-5 py-2.5 rounded-base font-medium transition-all shadow-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Add New Member</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-base border border-default-medium dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-default-medium dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-secondary-medium/50 dark:bg-gray-800/50">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-default-medium dark:border-gray-700 rounded-base pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-secondary-medium dark:bg-gray-800/70">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-medium dark:divide-gray-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-secondary-medium/20 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand/5 dark:bg-brand/10 flex items-center justify-center text-brand font-bold uppercase transition-transform hover:scale-110">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-heading dark:text-white">{member.name}</p>
                        <p className="text-xs text-body dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body dark:text-gray-300 font-mono">
                    {member.phone || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${member.membership_type === 'premium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : member.membership_type === 'corporate'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                      {member.membership_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body dark:text-gray-400">
                    {new Date(member.join_date || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-brand hover:text-brand-strong cursor-pointer font-medium transition-colors"
                    >
                      Edit Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-heading dark:text-white">No members yet</h3>
              <p className="text-body dark:text-gray-400 text-sm max-w-sm mx-auto mt-2">
                Start by adding your library members to manage their bookings and access.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-base shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 bounce-in duration-300">
            <div className="p-6 border-b border-default-medium dark:border-gray-800 flex items-center justify-between bg-neutral-secondary-medium/30 dark:bg-gray-800/30">
              <h3 className="text-xl font-bold text-heading dark:text-white">
                {editingId ? "Modify Member Records" : "Register New Member"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading dark:text-gray-300">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="91-XXXXXXXXXX"
                    className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading dark:text-gray-300">Membership Type</label>
                  <select
                    value={formData.membership_type}
                    onChange={e => setFormData({ ...formData, membership_type: e.target.value })}
                    className="w-full bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 dark:text-white"
                  >
                    <option value="basic">Basic (Standard Access)</option>
                    <option value="premium">Premium (All Benefits)</option>
                    <option value="corporate">Corporate (Group Access)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-default-medium dark:border-gray-700 text-body dark:text-gray-300 font-bold rounded-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand text-white font-bold rounded-base px-4 py-3 hover:bg-brand-strong transition-all focus:ring-4 focus:ring-brand/20 disabled:opacity-50 shadow-lg shadow-brand/20"
                >
                  {loading ? "Saving..." : (editingId ? "Update Profile" : "Create Record")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
