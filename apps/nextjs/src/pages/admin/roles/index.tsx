import { getColumnDefs } from "@/components/admin/roles/columns";
import DataTable from "@/components/admin/table/data-table";
import AdminTableLoader from "@/components/admin/table/table-loader";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function Page() {
  const roleQuery = trpc.role.all.useQuery();
  const utils = trpc.useContext()

  const { mutate: deleteMutation } = trpc.role.delete.useMutation({
    onSuccess: () => {
      utils.role.all.invalidate();
      toast.success("Role deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const columns = getColumnDefs(deleteMutation)

  return <AdminLayout
    title="Roles"
  >
    {roleQuery.isLoading && <AdminTableLoader />}
    {roleQuery.data && <DataTable data={roleQuery.data} columns={columns} />}
  </AdminLayout>;
}
