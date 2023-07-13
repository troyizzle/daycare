import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter} from "../../../../packages/api/src/uploadthing";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
