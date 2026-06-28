import { useState } from "react";

const CourseForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ courseName: "", stream: "", duration: "" });

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
    setForm({ courseName: "", stream: "", duration: "" });
  };

  return (
    <form onSubmit={submit} className="card p-6 grid gap-3 md:grid-cols-3">
      <input className="rounded-2xl border px-4 py-2" placeholder="Course Name" value={form.courseName} onChange={updateField("courseName")} required />
      <input className="rounded-2xl border px-4 py-2" placeholder="Stream" value={form.stream} onChange={updateField("stream")} />
      <input className="rounded-2xl border px-4 py-2" placeholder="Duration" value={form.duration} onChange={updateField("duration")} />
      <button disabled={loading} className="rounded-full bg-ink text-white px-4 py-2 md:col-span-3">
        {loading ? "Saving..." : "Add Course"}
      </button>
    </form>
  );
};

export default CourseForm;
