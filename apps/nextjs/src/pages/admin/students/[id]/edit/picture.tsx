import AdminTableLoader from "@/components/admin/table/table-loader";
import AdminLayout from "@/components/layouts/admin";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { StudentProfilePictureInput, studentProfilePictureSchema } from "@acme/db/schema/student"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormEvent, useRef, useState } from "react";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AvatarEditor from "react-avatar-editor";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

type AvatarFormProps = {
  studentId: string
  profilePicture: string | undefined
}

function AvatarForm({ studentId, profilePicture }: AvatarFormProps) {
  const [image, setImage] = useState<File | undefined>(undefined)
  const editor = useRef<AvatarEditor>(null)

  const router = useRouter()

  const form = useForm<StudentProfilePictureInput>({
    resolver: zodResolver(studentProfilePictureSchema),
    defaultValues: {
      id: studentId,
      profilePicture
    }
  })

  const ctx = trpc.useContext()

  const { mutate } = trpc.student.updateProfilePicture.useMutation({
    onSuccess: async () => {
      router.push("/admin/students")
      toast.success("Profile picture updated")
      await ctx.student.all.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
      console.error(error)
    }
  })

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      if (!data) return;

      if (!data[0]?.fileUrl) {
        toast.error("Error uploading image")
        return;
      }

      mutate({
        id: studentId,
        profilePicture: data[0]?.fileUrl
      })
    },
    onUploadError: () => {
      toast.error("Error uploading image")
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_data: StudentProfilePictureInput) {
    if (editor.current) {
      const canvas = editor.current.getImageScaledToCanvas();

      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          await startUpload([new File([blob], image?.name as string, {
            type: "image/jpeg",
          })]);

          resolve();
        });
      });
    }
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event)
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={(event) => {
        event.preventDefault()
        void handleFormSubmit(event)
      }}>
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

        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                setImage(file)
              }
            }}
          />
        </FormItem>

        <Button
          disabled={isUploading}
          type="submit" variant="default">
          {isUploading ? <span className="flex items-center">
            <Icons.spinner
              className="text-blue-500 animate-spin" /> Uploading...
          </span> : "Save"}
        </Button>
      </form>
    </Form>
  )
}

export default function Page() {
  const router = useRouter()
  const studentId = router.query.id as string
  const studentQuery = trpc.student.byId.useQuery({
    id: studentId
  }, {
    enabled: !!studentId
  })

  return <AdminLayout
    title="Edit Picture"
  >
    {studentQuery.isLoading && <AdminTableLoader />}
    {studentQuery.data && <AvatarForm studentId={studentQuery.data.id as string} profilePicture={''} />}
  </AdminLayout>
}
