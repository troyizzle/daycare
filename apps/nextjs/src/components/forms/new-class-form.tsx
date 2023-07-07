import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { ClassCreateInput, classCreateSchema } from "@/schema/class";
import { toast } from "sonner";

export default function NewClassForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();

  const { mutate } = trpc.class.create.useMutation({
    onSuccess: async () => {
      await ctx.class.all.invalidate();
      setIsOpen(false)
      toast.success("Class created")
    },
    onError: (error) => {
      console.log(error)
      toast.error("Error creating class")
    }
  })

  function onSubmit(data: ClassCreateInput) {
    mutate(data)
  }

  const form = useForm<ClassCreateInput>({
    resolver: zodResolver(classCreateSchema)
  })

  return (
    <AdminModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Class"
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
