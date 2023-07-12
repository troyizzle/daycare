import EditClassForm from "@/components/forms/edit-class-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function Page() {
  const classId = useRouter().query.id as string

  const classQuery = trpc.class.byId.useQuery({
    id: classId
  })

  return (
    <AdminLayout
      title="Editing class"
    >
    {classQuery.data &&
      <EditClassForm classroom={classQuery.data} />
    }
    </AdminLayout>
  )
}
