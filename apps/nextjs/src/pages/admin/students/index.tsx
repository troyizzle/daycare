import { getColumnDefs } from "@/components/admin/students/columns";
import DataTable from "@/components/admin/table/data-table";
import AdminTableLoader from "@/components/admin/table/table-loader";
import NewBabyForm from "@/components/forms/new-baby-form";
import AdminLayout from "@/components/layouts/admin";
import { useState } from "react";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const [modalVisible, setModalVisible] = useState(false);
  const studentQuery = trpc.student.all.useQuery();
  const columns = getColumnDefs(modalVisible, setModalVisible);

  return (
    <AdminLayout
      title="Students"
      createForm={<NewBabyForm />}
    >

      {studentQuery.isLoading && <AdminTableLoader />}
      {studentQuery.data && <DataTable data={studentQuery.data} columns={columns} />}
    </AdminLayout>
  )
}
