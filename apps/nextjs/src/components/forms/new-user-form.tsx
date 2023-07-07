import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminModalForm from "../admin-modal-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewUserForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();

  const form = useForm<any>()

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
