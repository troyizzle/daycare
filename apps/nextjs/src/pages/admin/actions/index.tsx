import { trpc } from "../../../utils/trpc"

export default function Page() {
  const babyQuery = trpc.baby.all.useQuery();
  return <div>Hello</div>
}
