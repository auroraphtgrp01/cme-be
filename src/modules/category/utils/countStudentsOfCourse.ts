import { DatabaseService } from "@/core/database/database.service"

export const countStudentOfCourse = async ({
  courseId,
  seminarId,
  databaseService
}: {
  courseId?: string
  seminarId?: string
  databaseService: DatabaseService
}) => {
  return await databaseService.client.registration.count({
    where: {
      courseId: courseId,
      seminarId: seminarId
    }
  })
}
