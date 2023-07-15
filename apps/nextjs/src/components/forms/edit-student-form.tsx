import { cn } from "@/lib/utils"
import { trpc } from "@/utils/trpc"
import { StudentAllResponse } from "@acme/api/src/router/student"
import { StudentUpdateInput } from "@acme/db/schema/student"
import { format } from "date-fns"
import { SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type EditStudentForm = {
  student: NonNullable<StudentAllResponse[number]>
  setModalVisible: React.Dispatch<SetStateAction<boolean>>
  children: React.ReactNode
}

export default function EditStudentForm({ student, setModalVisible, children }: EditStudentForm) {
  const form = useForm<StudentUpdateInput>({
    defaultValues: {
      ...student,
      dob: student.dob ?? new Date()
    }
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

        {children}
      </form>
    </Form>
  )
}
