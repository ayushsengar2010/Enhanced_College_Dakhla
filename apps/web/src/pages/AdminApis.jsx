import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApi, deleteApi, getApis, getColleges } from "../lib/api";
import ApiForm from "../components/forms/ApiForm";
import Table from "../components/ui/Table";

const AdminApis = () => {
  const queryClient = useQueryClient();

  const { data: apiData } = useQuery({ queryKey: ["apis"], queryFn: () => getApis({ limit: 100 }) });
  const { data: collegeData } = useQuery({ queryKey: ["colleges"], queryFn: () => getColleges({ limit: 200 }) });

  const createMutation = useMutation({
    mutationFn: createApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["apis"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["apis"] })
  });

  const columns = useMemo(
    () => [
      { header: "College", accessorFn: (row) => row.collegeId?.collegeName || "-" },
      { header: "Status", accessorKey: "status" },
      { header: "Method", accessorKey: "method" },
      { header: "API URL", accessorKey: "apiUrl" },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button className="text-sm text-red-600" onClick={() => deleteMutation.mutate(row.original._id)}>
            Delete
          </button>
        )
      }
    ],
    [deleteMutation]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">College API Mapping</h2>
        <p className="text-sm text-slate-500">Configure lead routing endpoints for each college.</p>
      </div>
      <ApiForm
        colleges={collegeData?.items || []}
        onSubmit={(payload) => createMutation.mutate(payload)}
        loading={createMutation.isPending}
      />
      <div className="card p-6">
        <Table data={apiData?.items || []} columns={columns} />
      </div>
    </div>
  );
};

export default AdminApis;
