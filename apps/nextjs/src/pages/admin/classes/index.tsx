import { columns } from "@/components/admin/classes/columns";
import DataTable from "@/components/admin/table/data-table";
import NewClassForm from "@/components/forms/new-class-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const classQuery = trpc.class.all.useQuery()

  return <AdminLayout
    title="Classes"
    createForm={<NewClassForm />}
  >
  <DataTable columns={columns} data={classQuery.data ?? []} />
  </AdminLayout>
}
