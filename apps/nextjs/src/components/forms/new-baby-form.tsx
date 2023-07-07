import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { babyCreateSchema, BabyCreateSchema } from "@/schema/baby";
import { toast } from "sonner";

export default function NewBabyForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();

  const { mutate } = trpc.baby.create.useMutation({
    onSuccess: async () => {
      await ctx.baby.all.invalidate();
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  function onSubmit(data: BabyCreateSchema) {
    mutate(data)
  }

  const form = useForm<BabyCreateSchema>({
    resolver: zodResolver(babyCreateSchema)
  })

  return (
    <AdminModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Baby"
      open={open}
      setIsOpen={setIsOpen}
    >
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

    </AdminModalForm>
  )
}
