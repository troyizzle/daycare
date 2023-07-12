import DataTable from "@/components/admin/table/data-table";
import AdminTableLoader from "@/components/admin/table/table-loader";
import { columns } from "@/components/admin/users/columns";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const userQuery = trpc.user.all.useQuery();

  return <AdminLayout
    title="Users"
  >
    {userQuery.isLoading && <AdminTableLoader />}
    {userQuery.data && <DataTable data={userQuery.data} columns={columns} />}
  </AdminLayout>;
}
