import { Course } from "@prisma/client"

export interface IExtendedCourse extends Course {
  countStudents: number
  availableSlots: number
}
