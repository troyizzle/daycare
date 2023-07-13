import { trpc } from "@/utils/trpc"
import { ClassroomByIdResponse } from "@acme/api/src/router/classroom"
import { ClassroomUpdateInput, classroomUpdateSchema } from "@acme/db/schema/classroom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { FormEvent } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

type EditClassroomFormProps = {
  classroom: ClassroomByIdResponse
}

export default function EditClassroomForm({ classroom }: EditClassroomFormProps) {
  const router = useRouter()

  if (!classroom) {
    return null
  }

  const form = useForm<ClassroomUpdateInput>({
    resolver: zodResolver(classroomUpdateSchema),
    defaultValues: {
      ...classroom,
      teachers: classroom.teachers.map((teacher) => teacher.teacherId)
    }
  })

  const ctx = trpc.useContext()
  const userQuery = trpc.user.all.useQuery()

  const { mutate } = trpc.classroom.update.useMutation({
    onSuccess: async () => {
      router.push("/admin/classrooms")
      toast.success("Classroom updated")
      await ctx.classroom.all.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
      console.error(error)
    }
  })

  function onSubmit(data: ClassroomUpdateInput) {
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
                <FormLabel className="text-base">Teachers</FormLabel>
                <FormDescription>
                  Select the teachers in this classroom, this will give them permission to view the students in this classroom.
                </FormDescription>
              </div>
              {userQuery.data?.map((teacher) => (
                <FormField
                  key={teacher.id}
                  control={form.control}
                  name="teachers"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={teacher.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(teacher.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, teacher.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== teacher.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {teacher.firstName} {teacher.lastName}
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

        <Button variant="default" type="submit">Submit</Button>
      </form>
    </Form>
  )
}
