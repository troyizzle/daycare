import { actionCreateSchema, ActionCreateSchema } from "@/schema/action";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewActionForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();

  const { mutate } = trpc.action.create.useMutation({
    onSuccess: async () => {
      await ctx.action.all.invalidate();
      setIsOpen(false)
    },
    onError: (error) => {
      console.error(error);
    }
  })

  function onSubmit(data: ActionCreateSchema) {
    mutate(data)
  }

  const form = useForm<ActionCreateSchema>({
    resolver: zodResolver(actionCreateSchema)
  })

  return (
    <AdminModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Action"
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
          </FormItem>
        )}
      />
    </AdminModalForm>
  )
}
