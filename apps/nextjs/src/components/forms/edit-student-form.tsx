import { cn } from "@/lib/utils"
import { trpc } from "@/utils/trpc"
import { StudentAllResponse } from "@acme/api/src/router/student"
import { StudentUpdateInput } from "@acme/db/schema/student"
import { format } from "date-fns"
import { SetStateAction } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { DialogFooter } from "../ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type EditStudentForm = {
  student: NonNullable<StudentAllResponse[number]>
  setModalVisible: React.Dispatch<SetStateAction<boolean>>
}

export default function EditStudentForm({ student, setModalVisible }: EditStudentForm) {
  const contactInfoQuery = trpc.contactInformation.allByStudentId.useQuery({
    studentId: student.id
  })

  const form = useForm<StudentUpdateInput>({
    defaultValues: {
      ...student,
      dob: student.dob ?? new Date(),
      ContactInformation: contactInfoQuery.data ?? []
    }
  })

  const { fields: contactInfoFields, insert } = useFieldArray({
    control: form.control,
    name: "ContactInformation"
  })

  const context = trpc.useContext()

  const { mutate } = trpc.student.update.useMutation({
    onSuccess: async () => {
      await context.student.byId.invalidate()
      await context.student.all.invalidate()
      setModalVisible(false)
      toast.success("Student updated")
    },
    onError: (error) => {
      console.log(error)
    }
  })

  function onSubmit(data: StudentUpdateInput) {
    mutate(data)
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date)
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between">
            <h4>Emergency Contact Info</h4>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                insert(contactInfoFields.length + 1, {
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  studentId: student.id
                })
              }}
            >
              <span className="text-sm">Add</span>
            </Button>
          </div>
          {contactInfoFields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={form.control}
                name={`ContactInformation.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ContactInformation.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ContactInformation.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ContactInformation.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <input type="hidden" {...form.register(`ContactInformation.${index}.studentId`)} />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="default"
            type="submit"
          >Update</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
