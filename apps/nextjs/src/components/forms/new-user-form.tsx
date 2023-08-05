import { trpc } from "@/utils/trpc";
import { UserCreateInput, userCreateSchema } from "@acme/db/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function NewUserForm() {
  const [open, setIsOpen] = useState(false)

  const { mutate } = trpc.user.create.useMutation({
    onSuccess: () => {
      setIsOpen(false)
      toast.success("User created")
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  function onSubmit(data: UserCreateInput) {
    mutate(data)
  }

  const form = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
  })

  return (
    <AdminModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="Create User"
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
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <Input {...field} type="tel" />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input {...field} type="email" />
            <FormMessage />
          </FormItem>
        )}
      />
    </AdminModalForm>
  )
}
