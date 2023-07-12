import AdminTableLoader from "@/components/admin/table/table-loader";
import EditUserForm from "@/components/forms/edit-user-form";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function AdminUserEdit() {
  const router = useRouter()
  const userId = router.query.id as string

  const userQuery = trpc.user.byId.useQuery({
    id: userId
  })

  if (userQuery.error) {
    router.push("/admin/users?error=Unable to find user")
  }

  return (
    <AdminLayout
      title="Edit User"
    >
      {userQuery.isLoading && <AdminTableLoader />}
      {userQuery.data && <EditUserForm user={userQuery.data} />}
    </AdminLayout>
  )
}
