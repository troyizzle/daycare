import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import Navbar from "../navbar"
import { buttonVariants } from "../ui/button"

function SidebarNavMenu() {
  const pathname = useRouter().pathname

  const sidebarNavItems = [
    {
      href: '/admin/actions',
      label: 'Actions',
    },
    {
      href: '/admin/students',
      label: 'Students',
    },
    {
      href: '/admin/classrooms',
      label: 'Classrooms',
    },
    {
      href: '/admin/roles',
      label: 'Roles',
    },
    {
      href: '/admin/users',
      label: 'Users',
    }
  ]

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
      )}
    >
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

type AdminLayoutProps = {
  title: string
  children: React.ReactNode
  createForm?: React.ReactNode
}

export default function AdminLayout({ title, children, createForm }: AdminLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="space-y-6 p-10 pb-16">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SidebarNavMenu />
          </aside>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{title}</h1>
              {createForm && createForm}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
