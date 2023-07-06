import { Button } from "../../../../@/components/ui/button";
import { trpc } from "../../../utils/trpc"

export default function Page() {
  const babyQuery = trpc.baby.all.useQuery();

  return (
    <div>
      <Button variant="destructive">HELLO</Button>
    </div>
  )
}
