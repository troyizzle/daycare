import { prisma } from "..";

async function main() {
  ['teacher', 'parent', 'admin'].forEach(async (role) => {
    await prisma.role.create({
      data: {
        name: role
      }
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
