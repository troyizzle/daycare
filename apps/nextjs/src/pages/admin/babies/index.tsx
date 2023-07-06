import { columns } from "@/components/admin/babies/columns";
import DataTable from "@/components/admin/table/data-table";
import NewBabyForm from "@/components/forms/new-baby-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const babyQuery = trpc.baby.all.useQuery();

  return (
    <AdminLayout
    title="Babies"
    createForm={<NewBabyForm />}
    >
      <DataTable data={babyQuery.data ?? []} columns={columns} />
    </AdminLayout>
  )
}
