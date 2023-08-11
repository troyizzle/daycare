import { columns } from "@/components/admin/students/columns";
import DataTable from "@/components/admin/table/data-table";
import AdminTableLoader from "@/components/admin/table/table-loader";
import NewStudentForm from "@/components/forms/new-baby-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const studentQuery = trpc.student.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });
  return (
    <AdminLayout
      title="Students"
      createForm={<NewStudentForm />}
    >

      {studentQuery.isLoading && <AdminTableLoader />}
      {studentQuery.data && <DataTable data={studentQuery.data} columns={columns} />}
    </AdminLayout>
  )
}
