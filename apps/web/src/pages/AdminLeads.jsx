import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, updateLead, deleteLead, sendLeadEmail } from "../lib/api";

const STATUSES = ["Pending", "Contacted", "Interested", "Not Interested", "Admission Done", "Closed"];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const AdminLeads = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal State for Actioning Leads (Update Status & Remark)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editRemark, setEditRemark] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads", search, statusFilter, page, limit],
    queryFn: () => getLeads({ search: search || undefined, status: statusFilter || undefined, page, limit }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leads"]);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leads"]);
    },
  });

  const emailMutation = useMutation({
    mutationFn: (id) => sendLeadEmail(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-leads"]);
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

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    updateMutation.mutate({
      id: selectedLead._id,
      payload: { status: editStatus, remark: editRemark },
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete enquiry for "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleExportCSV = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    window.open(`${baseUrl}/api/leads/export/csv`, "_blank");
  };

  const leads = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
            ✉️ Smart Lead Management &amp; College Allocation
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Manage student enquiries, view auto-matched top 5 colleges, update status &amp; send email acknowledgements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {emailMsg && (
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-pulse">
              ✓ {emailMsg}
            </span>
          )}
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            📊 Export CSV Report
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span>Show</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span>Status Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237]"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Search Student / City / Course:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237] w-52"
              placeholder="Type to search..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4">Sr.No.</th>
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">Location &amp; Course</th>
                <th className="py-3.5 px-4">Assigned Top Colleges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Remarks</th>
                <th className="py-3.5 px-4">Enquiry Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    Loading Student Leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    No student enquiries found. Submit an enquiry from the website homepage to test!
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-[#08162d] text-sm">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{lead.email}</div>
                      <div className="text-[11px] text-amber-600 font-bold">📞 {lead.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-800">{lead.course || "General Enquiry"}</div>
                      <div className="text-[11px] text-slate-500">📍 {lead.city || "N/A"}{lead.state ? `, ${lead.state}` : ""}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      {lead.assignedColleges && lead.assignedColleges.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {lead.assignedColleges.slice(0, 3).map((col, idx) => (
                            <span key={col._id || idx} className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                              #{col.ranking || idx+1} {col.shortName || col.collegeName?.slice(0, 12)}
                            </span>
                          ))}
                          {lead.assignedColleges.length > 3 && (
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              +{lead.assignedColleges.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-extrabold text-[11px] px-2.5 py-1 rounded-full border ${
                        lead.status === "Admission Done" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                        lead.status === "Interested" ? "bg-amber-100 text-amber-800 border-amber-300" :
                        lead.status === "Contacted" ? "bg-blue-100 text-blue-800 border-blue-300" :
                        lead.status === "Not Interested" || lead.status === "Closed" ? "bg-rose-100 text-rose-800 border-rose-300" :
                        "bg-slate-100 text-slate-700 border-slate-300"
                      }`}>
                        {lead.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[160px]">
                      <p className="text-[11px] text-slate-600 truncate">{lead.remark || "No remarks added"}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-semibold">{fmtDate(lead.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(lead)}
                          title="Update Lead Status & Remarks"
                          className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => emailMutation.mutate(lead._id)}
                          disabled={emailMutation.isPending}
                          title="Send Acknowledgement Email to Student"
                          className="w-7 h-7 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                        >
                          📧
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id, lead.name)}
                          title="Delete Lead"
                          className="w-7 h-7 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>
            Showing {total > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              «
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded font-bold ${page === i + 1 ? "bg-[#c58237] text-white" : "border border-slate-300 hover:bg-slate-100 text-slate-700"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal (Update Status & Add Remarks) */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-[#08162d]">
              Manage Enquiry: {selectedLead.name}
            </h2>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Course &amp; City:</strong> {selectedLead.course || "N/A"} in {selectedLead.city || "N/A"}</p>
            </div>
            <form onSubmit={handleSaveLead} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Lead Follow-up Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#c58237]"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1">Counselor Remarks / Action Notes</label>
                <textarea
                  rows={3}
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-[#c58237]"
                  placeholder="e.g. Called student on 28th June. Student interested in B.Tech CSE at SAITM."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold shadow-md"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
