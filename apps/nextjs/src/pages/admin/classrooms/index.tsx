import { columns } from "@/components/admin/classrooms/columns";
import DataTable from "@/components/admin/table/data-table";
import AdminTableLoader from "@/components/admin/table/table-loader";
import NewClassRoomForm from "@/components/forms/new-classroom-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const classroomQuery = trpc.classroom.all.useQuery()

  return <AdminLayout
    title="Classrooms"
    createForm={<NewClassRoomForm />}
  >
    {classroomQuery.isLoading && <AdminTableLoader />}
    {classroomQuery.data && <DataTable columns={columns} data={classroomQuery.data} />}
  </AdminLayout>
}
