import { trpc } from "@/utils/trpc"
import { UserByIdResponse } from "@acme/api/src/router/user"
import { useRouter } from "next/router"
import { FormEvent } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { UserUpdateInput } from "../../../../../packages/db/schema/user"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

type EditUserForm = {
  user: NonNullable<UserByIdResponse>
}

export default function EditUserForm({ user }: EditUserForm) {
  const router = useRouter()
  const roleQuery = trpc.role.all.useQuery()
  const studentQuery = trpc.student.all.useQuery()

  const form = useForm<UserUpdateInput>({
    defaultValues: {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      roles: user.roles.map((role) => role.roleId),
      children: user.children.map((child) => child.studentId)
    }
  })

  const { mutate } = trpc.user.update.useMutation({
    onSuccess: () => {
      router.push("/admin/users")
      toast.success("User updated")
    },
    onError: (error) => {
      console.log(error)
    }
  })

  function onSubmit(data: UserUpdateInput) {
    mutate(data)
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
        <Input type="hidden" {...form.register("id")} />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>

                <Input
                  {...field}
                />
              </FormControl>
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
              <FormControl>

                <Input
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Roles</FormLabel>
                <FormDescription>
                  Select the roles to assign to this user.
                </FormDescription>
              </div>
              {roleQuery.data?.map((role) => (
                <FormField
                  key={role.id}
                  control={form.control}
                  name="roles"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={role.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, role.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== role.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {role.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="children"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Children</FormLabel>
                <FormDescription>
                  Select the children that belong to this user.
                </FormDescription>
              </div>
              {studentQuery.data?.map((student) => (
                <FormField
                  key={student.id}
                  control={form.control}
                  name="children"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={student.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(student.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, student.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== student.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {student.firstName} {student.lastName}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit">Update</Button>
      </form>
    </Form>
  )
}
