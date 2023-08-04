import { FormEvent } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Form } from "./ui/form"

type AdminModalFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  modalTitle: string
  modalDescription?: string
  open: boolean
  setIsOpen: (open: boolean) => void
}

export default function AdminModalForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  modalTitle,
  modalDescription,
  open,
  setIsOpen,
}: AdminModalFormProps<T>) {
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event);
  };

  function handleClose() {
    setIsOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default">
        Create
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          {modalDescription && (
            <DialogDescription>{modalDescription}</DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col space-y-3" onSubmit={(event) => {
            event.preventDefault();
            void handleFormSubmit(event);
          }}>
            {children}
            <DialogFooter>
              <Button
              type="button"
                onClick={handleClose}
                variant="secondary">Cancel</Button>
              <Button
                type="submit"
                variant="default"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
