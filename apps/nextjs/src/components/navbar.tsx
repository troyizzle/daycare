import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "./icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types"

type UserDropdownMenuProps = {
  user: UserResource
}

function UserDropdownMenu({ user }: UserDropdownMenuProps) {
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImageUrl ?? "some gravatar picture"} alt={user.username ?? ""} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>

        <DropdownMenuItem asChild className="w-full">
          <Button className="" variant="ghost" onClick={() => void signOut()}>
            <Icons.logout
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Navbar() {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="hidden gap-6 md:flex">
          <Link href="/">
            Day Care
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user && (
              <UserDropdownMenu user={user} />
            )}
          </nav>
        </div>
      </div>
    </header >
  )
}
