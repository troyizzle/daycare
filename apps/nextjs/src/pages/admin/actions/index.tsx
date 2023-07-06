import { columns } from "@/components/admin/actions/columns";
import DataTable from "@/components/admin/table/data-table";
import NewActionForm from "@/components/forms/new-action-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const actionQuery = trpc.action.all.useQuery();

  return (
    <AdminLayout
    title="Actions"
    createForm={<NewActionForm />}
    >
      <DataTable data={actionQuery.data ?? []} columns={columns} />
    </AdminLayout>
  )
}
