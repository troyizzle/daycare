import { useUploadThing } from "@/utils/uploadthing";
import { useRef, useState } from "react"
import AvatarEditor from "react-avatar-editor";

export default function StudentAvatarForm() {
  const [image, setImage] = useState<File | undefined>(undefined);
  const editor = useRef<AvatarEditor>(null)

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      console.log(data);
    },
    onUploadError: (error) => {
      console.log(error);
    },
  });

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e?.target?.files?.[0] ?? undefined)} />

      {image && (
        <AvatarEditor
          ref={editor}
          image={image}
          width={250}
          height={250}
          border={50}
          borderRadius={150}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={1.6}
          rotate={0}
        />
      )}

      <button onClick={() => {
        if (editor.current) {
          const canvas = editor.current.getImageScaledToCanvas();
          canvas.toBlob((blob) => {
            if (blob) {
              startUpload([new File([blob], "test.jpg", {
                type: "image/jpeg",
              })]);
            }
          });
        }
      }}>Save</button>
    </div>
  )
}
