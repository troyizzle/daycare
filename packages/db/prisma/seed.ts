import { prisma } from ".."

async function main() {
  // Create Actions
  const actions = ['Diaper Change', 'Feed', 'Nap', 'Medication', 'Incident']
  actions.forEach(async (action) => {
    await prisma.action.upsert({
      where: {
        name: action
      },
      update: {},
      create: {
        name: action
      }
    })
  })

  // Create some default roles
  const roles = ['Teacher', 'Parent', 'Admin']

  roles.forEach(async (role) => {
    await prisma.role.upsert({
      where: {
        name: role
      },
      update: {},
      create: {
        name: role
      }
    })
  })

  // Create some classrooms
  const classrooms = ['Preschool', 'Pre-K']
  const infantClassroom = await prisma.classroom.upsert({
    where: {
      name: 'Infant'
    },
    update: {},
    create: {
      name: 'Infant'
    }
  })

  const toddlerClassroom = await prisma.classroom.upsert({
    where: {
      name: 'Toddler'
    },
    update: {},
    create: {
      name: 'Toddler'
    }
  })

  classrooms.forEach(async (classroom) => {
    await prisma.classroom.upsert({
      where: {
        name: classroom
      },
      update: {},
      create: {
        name: classroom
      }
    })
  })

  // Create some default students
  const students = [
    { firstName: 'John', lastName: 'Doe', classroom: infantClassroom.id },
    { firstName: 'Jane', lastName: 'Doe', classroom: infantClassroom.id },
    { firstName: 'Jack', lastName: 'Doe', classroom: infantClassroom.id },
    { firstName: 'Jill', lastName: 'Doe', classroom: toddlerClassroom.id },
    { firstName: 'James', lastName: 'Doe', classroom: toddlerClassroom.id },
    { firstName: 'Jenny', lastName: 'Doe', classroom: toddlerClassroom.id },
  ]

  students.map(async (student) => {
    await prisma.student.create({
      data: {
        firstName: student.firstName,
        lastName: student.lastName,
        dob: new Date(),
        classrooms: {
          create: {
            classroomId: student.classroom
          }
        },
        ContactInformation: {
          create: {
            firstName: `mom - ${student.firstName}`,
            lastName: `mom - ${student.lastName}`,
            email: `${student.firstName}@email`,
            phone: '1234567890',
          }
        }
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
