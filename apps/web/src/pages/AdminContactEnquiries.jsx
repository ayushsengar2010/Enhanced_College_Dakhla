import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, updateLead, deleteLead, sendLeadEmail } from "../lib/api";

const STATUSES = ["Pending", "Contacted", "Interested", "Not Interested", "Admission Done", "Closed"];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const statusStyle = (s) => {
  if (s === "Admission Done") return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (s === "Interested")     return "bg-amber-100 text-amber-800 border-amber-300";
  if (s === "Contacted")      return "bg-blue-100 text-blue-800 border-blue-300";
  if (s === "Not Interested" || s === "Closed") return "bg-rose-100 text-rose-800 border-rose-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
};

const AdminContactEnquiries = () => {
  const queryClient = useQueryClient();
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]                 = useState(1);
  const [limit, setLimit]               = useState(10);
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editStatus, setEditStatus]     = useState("Pending");
  const [editRemark, setEditRemark]     = useState("");
  const [emailMsg, setEmailMsg]         = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["contact-enquiries", search, statusFilter, page, limit],
    queryFn: () =>
      getLeads({
        source: "contact_page",
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["contact-enquiries"]);
      queryClient.invalidateQueries(["dashboard"]);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["contact-enquiries"]);
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const emailMutation = useMutation({
    mutationFn: (id) => sendLeadEmail(id),
    onSuccess: (res) => {
      setEmailMsg(res.message || "Email sent!");
      setTimeout(() => setEmailMsg(""), 4000);
    },
  });

  const handleOpenModal = (lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status || "Pending");
    setEditRemark(lead.remark || "");
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    updateMutation.mutate({ id: selectedLead._id, payload: { status: editStatus, remark: editRemark } });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete enquiry for "${name}"?`)) deleteMutation.mutate(id);
  };

  const leads      = data?.items      || [];
  const total      = data?.total      || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
            📞 Contact Page Enquiries
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Messages submitted via the contact form on the Contact Us page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {emailMsg && (
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-pulse">
              ✓ {emailMsg}
            </span>
          )}
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-xs font-black text-rose-700">
            Total: {total} messages
          </div>
          <button
            onClick={() => window.open("http://localhost:5000/api/leads/export/csv?source=contact_page", "_blank")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none">
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Status:</span>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237]">
                <option value="">All</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Name / email / phone…"
              className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237] w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Remarks</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400 font-bold">Loading enquiries…</td></tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <span className="text-4xl">📞</span>
                      <p className="font-bold text-sm">No contact page enquiries yet.</p>
                      <p className="text-xs">When users fill the contact form, they'll appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-bold">{(page - 1) * limit + i + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-[#08162d] text-sm">{lead.name}</div>
                      <div className="text-[11px] text-slate-500">{lead.email}</div>
                      <div className="text-[11px] text-amber-600 font-bold">📞 {lead.phone}</div>
                      {lead.city && <div className="text-[11px] text-slate-400">📍 {lead.city}</div>}
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px]">
                      {lead.message ? (
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-line">
                          {lead.message}
                        </p>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No message</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-extrabold text-[11px] px-2.5 py-1 rounded-full border ${statusStyle(lead.status)}`}>
                        {lead.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[150px]">
                      <p className="text-[11px] text-slate-500 truncate">{lead.remark || "—"}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{fmtDate(lead.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleOpenModal(lead)} title="Update status"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">✏️</button>
                        <button onClick={() => emailMutation.mutate(lead._id)} title="Send email"
                          className="w-7 h-7 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors">📧</button>
                        <button onClick={() => handleDelete(lead._id, lead.name)} title="Delete"
                          className="w-7 h-7 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>Showing {total > 0 ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, total)} of {total}</div>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40">«</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded font-bold ${page === i + 1 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40">»</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            <h2 className="text-lg font-black text-[#08162d]">Manage Enquiry: {selectedLead.name}</h2>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              {selectedLead.city && <p><strong>City:</strong> {selectedLead.city}</p>}
              {selectedLead.message && (
                <div>
                  <strong>Message:</strong>
                  <p className="mt-1 text-slate-500 whitespace-pre-line leading-relaxed">{selectedLead.message}</p>
                </div>
              )}
              <p><strong>Source:</strong> <span className="text-rose-600 font-bold">Contact Page</span></p>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Follow-up Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1">Remarks</label>
                <textarea rows={3} value={editRemark} onChange={(e) => setEditRemark(e.target.value)}
                  placeholder="Add response notes here…"
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237] resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md disabled:opacity-60">
                  {updateMutation.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactEnquiries;
