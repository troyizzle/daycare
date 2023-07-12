import { trpc } from "@/utils/trpc"
import { ClassByIdResponse } from "@acme/api/src/router/class"
import { ClassUpdateInput, classUpdateSchema } from "@acme/db/schema/class"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormEvent, ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

type EditClassFormProps = {
  classroom: ClassByIdResponse
}

export default function EditClassForm({ classroom }: EditClassFormProps) {
  if (!classroom) {
    return null
  }

  const ctx = trpc.useContext()
  const userQuery = trpc.user.all.useQuery()

  const teacherIds = classroom.teachers.map((teacher) => teacher.id)

  const { mutate } = trpc.class.update.useMutation({
    onSuccess: async () => {
      toast.success("Class updated")
      await ctx.class.all.invalidate()
    },
  })

  const form = useForm<ClassUpdateInput>({
    resolver: zodResolver(classUpdateSchema),
    defaultValues: {
      ...classroom,
    }
  })

  function onSubmit(data: ClassUpdateInput) {
    mutate(data)
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-3" onSubmit={(event) => {
        event.preventDefault()
        void handleFormSubmit(event)
      }}>
        <Input type="hidden" {...form.register("id")} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
          name="teachers"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Teachers</FormLabel>
                <FormDescription>Select the teachers in this classroom</FormDescription>
              </div>
              {userQuery.data?.map((user, index) => (
                <FormField
                  key={user.id}
                  control={form.control}
                  name={`teachers.${index}`}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={user.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={teacherIds.includes(user.id)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{user.firstName}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
