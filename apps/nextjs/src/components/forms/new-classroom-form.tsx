import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";
import { ClassroomCreateInput, classroomCreateSchema } from "@acme/db/schema/classroom";

export default function NewClassRoomForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();

  const { mutate } = trpc.classroom.create.useMutation({
    onSuccess: async () => {
      await ctx.classroom.all.invalidate();
      setIsOpen(false)
      toast.success("Class created")
    },
    onError: (error) => {
      console.log(error)
      toast.error("Error creating class")
    }
  })

  function onSubmit(data: ClassroomCreateInput) {
    mutate(data)
  }

  const form = useForm<ClassroomCreateInput>({
    resolver: zodResolver(classroomCreateSchema)
  })

  return (
    <AdminModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Classroom"
      open={open}
      setIsOpen={setIsOpen}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
    </AdminModalForm>
  )
}
