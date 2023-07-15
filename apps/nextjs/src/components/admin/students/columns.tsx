import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Student } from "@acme/db";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditStudentForm from "@/components/forms/edit-student-form";

export function getColumnDefs(modalVisible: boolean, setModalVisible:
  React.Dispatch<SetStateAction<boolean>>
): ColumnDef<Student>[] {
  return [
    {
      accessorKey: "profilePicture",
      header: "",
      cell: ({ cell }) => {
        const profilePicture = cell.getValue()
        if (!profilePicture) return null;

        return <Avatar>
          <AvatarImage src={profilePicture} />
        </Avatar>
      }
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            First Name
            <Icons.chevronUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original

        return (
          <Dialog open={modalVisible} onOpenChange={setModalVisible}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Icons.horizontalThreeDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setModalVisible(true)}>
                  Edit
                </DropdownMenuItem>
                <Link href={`/admin/students/${student.id}/edit/picture`}>
                  <DropdownMenuItem>
                    Edit Picture
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {student.firstName} {student.lastName}</DialogTitle>
              </DialogHeader>
              <EditStudentForm student={student} setModalVisible={setModalVisible}>
                <DialogFooter>
                  <Button variant="default" type="submit">Update</Button>
                </DialogFooter>
              </EditStudentForm>
            </DialogContent>
          </Dialog>
        )
      }
    }
  ]
}
