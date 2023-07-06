import AdminLayout from "@/components/layouts/admin";
import { Button } from "@/components/ui/button";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const babyQuery = trpc.baby.all.useQuery();

  return (
    <AdminLayout title="Actions">
      <Button variant="destructive">HELLO</Button>
    </AdminLayout>
  )
}
