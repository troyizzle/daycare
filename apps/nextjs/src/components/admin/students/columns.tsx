import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Student } from "@acme/db";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "profilePicture",
    header: "",
    cell: ({ cell }) => {
      return <Avatar>
        <AvatarImage src={cell.getValue()}/>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.horizontalThreeDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/admin/students/${student.id}/edit/picture`}>
              <DropdownMenuItem>
                Edit Picture
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
