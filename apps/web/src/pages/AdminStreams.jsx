import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStreams, createStream, updateStream, deleteStream } from "../lib/api";

const AdminStreams = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [streamName, setStreamName] = useState("");
  const [status, setStatus] = useState("Active");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-streams-table", search, page, limit],
    queryFn: () => getStreams({ search: search || undefined, page, limit }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editingItem ? updateStream(editingItem._id, payload) : createStream(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-streams-table"]);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteStream(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-streams-table"]);
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setStreamName("");
    setStatus("Active");
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setStreamName(item.streamName);
    setStatus(item.status || "Active");
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!streamName) return;
    saveMutation.mutate({ streamName, status });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete stream "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const streams = data?.items || [];
  const total = data?.total || 10;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-black text-[#08162d] flex items-center gap-2">
          ≡ Stream
        </h1>
        <button
          onClick={handleOpenCreate}
          className="bg-[#c58237] hover:bg-[#b0712a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          + Add Stream
        </button>
      </div>

      {/* Table Container matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none">
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>entries per page</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:border-[#c58237]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-6">Sr.No. ↕</th>
                <th className="py-3.5 px-6">Stream Name ↕</th>
                <th className="py-3.5 px-6">Status ↕</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400 font-bold">Loading Streams...</td></tr>
              ) : streams.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400 font-bold">No streams found.</td></tr>
              ) : (
                streams.map((st, index) => (
                  <tr key={st._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 text-slate-500 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3.5 px-6 font-black text-[#08162d]">{st.streamName}</td>
                    <td className="py-3.5 px-6">
                      <span className={`font-black text-xs ${st.status === "Inactive" ? "text-rose-500" : "text-emerald-600"}`}>
                        {st.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(st)} title="Edit Stream" className="w-7 h-7 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center">✏️</button>
                        <button onClick={() => handleDelete(st._id, st.streamName)} title="Delete Stream" className="w-7 h-7 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-semibold">
          <div>Showing 1 to {streams.length} of {total} entries</div>
          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 border border-slate-300 rounded opacity-40">«</button>
            <button className="px-3 py-1 rounded font-bold bg-[#c58237] text-white">1</button>
            <button disabled className="px-2.5 py-1 border border-slate-300 rounded opacity-40">»</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden space-y-6">
            <div className="bg-[#c58237] text-white p-4 font-black text-center text-sm uppercase">{editingItem ? "EDIT STREAM" : "ADD STREAM"}</div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Stream Name</label>
                <input type="text" value={streamName} onChange={(e) => setStreamName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold" required />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-slate-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#c58237] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStreams;
