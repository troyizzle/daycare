import EditClassroomForm from "@/components/forms/edit-classroom-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function Page() {
  const classId = useRouter().query.id as string

  const classQuery = trpc.classroom.byId.useQuery({
    id: classId
  })

  return (
    <AdminLayout
      title="Editing classroom"
    >
    {classQuery.data &&
      <EditClassroomForm classroom={classQuery.data} />
    }
    </AdminLayout>
  )
}
