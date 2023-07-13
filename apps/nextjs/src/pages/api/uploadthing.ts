import { createNextPageApiHandler } from "uploadthing/next-legacy";
import { ourFileRouter} from "../../../../../packages/api/src/uploadthing";

const handler = createNextPageApiHandler({
  router: ourFileRouter,
});

export default handler;
