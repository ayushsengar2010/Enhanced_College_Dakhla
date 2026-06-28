import { useState } from "react";

const ApiForm = ({ colleges, onSubmit, loading }) => {
  const [form, setForm] = useState({
    collegeId: "",
    apiUrl: "",
    method: "POST",
    apiKey: "",
    apiToken: "",
    leadEndpoint: "",
    status: "Inactive"
  });

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card p-6 grid gap-4 md:grid-cols-3">
      <select className="rounded-2xl border px-4 py-2" value={form.collegeId} onChange={updateField("collegeId")} required>
        <option value="">Select College</option>
        {colleges.map((college) => (
          <option key={college._id} value={college._id}>
            {college.collegeName}
          </option>
        ))}
      </select>
      <input className="rounded-2xl border px-4 py-2" placeholder="API URL" value={form.apiUrl} onChange={updateField("apiUrl")} required />
      <select className="rounded-2xl border px-4 py-2" value={form.method} onChange={updateField("method")}>
        <option>POST</option>
        <option>GET</option>
        <option>PUT</option>
        <option>PATCH</option>
      </select>
      <input className="rounded-2xl border px-4 py-2" placeholder="API Key" value={form.apiKey} onChange={updateField("apiKey")} />
      <input className="rounded-2xl border px-4 py-2" placeholder="API Token" value={form.apiToken} onChange={updateField("apiToken")} />
      <input className="rounded-2xl border px-4 py-2" placeholder="Lead Endpoint" value={form.leadEndpoint} onChange={updateField("leadEndpoint")} />
      <select className="rounded-2xl border px-4 py-2" value={form.status} onChange={updateField("status")}>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      <button disabled={loading} className="rounded-full bg-ink text-white px-4 py-2 md:col-span-3">
        {loading ? "Saving..." : "Add API"}
      </button>
    </form>
  );
};

export default ApiForm;
