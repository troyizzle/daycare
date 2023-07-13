import { generateReactHelpers } from "@uploadthing/react/hooks"
import type { OurFileRouter} from "../../../../packages/api/src/uploadthing";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
