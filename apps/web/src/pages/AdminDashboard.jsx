import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboard } from "../lib/api";
import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";

const AdminDashboard = () => {
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });

  const totals = data?.totals || {};
  const monthlyLeads = (data?.monthlyLeads || []).map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    enquiries: item.total
  }));

  // Fallback data if API returns empty array for chart
  const barChartData = monthlyLeads.length > 0 ? monthlyLeads : [
    { name: "Jan", enquiries: 4 },
    { name: "Feb", enquiries: 6 },
    { name: "Mar", enquiries: 12 },
    { name: "Apr", enquiries: 8 },
    { name: "May", enquiries: 20 },
    { name: "Jun", enquiries: 15 }
  ];

  // Pie chart data from real API fields
  const pieData = [
    { name: "Contact Enquiries", value: totals.contactLeads ?? 0 },
    { name: "Home Enquiries",    value: totals.homeLeads    ?? 0 },
    { name: "College Enquiries", value: totals.collegeLeads ?? 0 },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ["#c07e3e", "#d6ab7b", "#e6cbab"];

  return (
    <div className="space-y-8">
      {/* 8-Card Stat Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Colleges"          value={totals.totalColleges   ?? "—"} icon="🏛️" to="/admin/colleges" />
        <StatCard label="Total Courses"           value={totals.totalCourses    ?? "—"} icon="📖" to="/admin/courses" />
        <StatCard label="Total Blogs"             value={totals.totalBlogs      ?? "—"} icon="📶" to="/admin/blogs" />
        <StatCard label="Total Testimonials"      value={totals.totalTestimonials ?? "—"} icon="💬" to="/admin/testimonials" />

        <StatCard label="Total Enquiries"         value={totals.totalLeads      ?? "—"} icon="🎯" to="/admin/leads" />
        <StatCard label="Contact Enquiries"       value={totals.contactLeads    ?? "—"} icon="📞" to="/admin/leads/contact" />
        <StatCard label="Home Page Enquiries"     value={totals.homeLeads       ?? "—"} icon="💼" to="/admin/leads/home" />
        <StatCard label="College Page Enquiries"  value={totals.collegeLeads    ?? "—"} icon="🔔" to="/admin/leads/college" />
      </div>

      {/* Side-by-Side Charts Layout */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column: Month-wise Enquiries Bar Chart */}
        <div className="lg:col-span-3">
          <ChartCard title="📊 Month-wise Enquiries">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  labelStyle={{ fontWeight: "bold", color: "#334155" }}
                />
                <Bar dataKey="enquiries" fill="#c07e3e" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Column: Total Enquiries Breakdown Pie Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="📊 Total Enquiries Breakdown">
            <div className="flex flex-col items-center justify-center h-full">
              {pieData.length > 0 ? (
                <>
                  <div className="w-full h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Pie Legends */}
                  <div className="flex gap-4 text-xs font-semibold text-slate-500 mt-2 flex-wrap justify-center">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                        <span>{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-sm">No enquiry data yet.</p>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
