import { DatabaseService } from '@/core/database/database.service';

import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUserFromToken } from '@/modules/users/user.i';
import { CreateCategoryDto, ECategoryType, GetCategoryByType, UpdateCategoryDto } from '@/modules/category/dto/category.dto';
import { countStudentOfCourse } from '@/modules/category/utils/countStudentsOfCourse';
@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(CategoryService.name);

  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.databaseService.client.$transaction(async (prisma) => {
      const category = await prisma.category.create({
        data: {
          name: createCategoryDto.name,
          normalizedName: createCategoryDto.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase(),
          description: createCategoryDto.description,
          normalizedDescription: createCategoryDto.description
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase(),
          types: createCategoryDto.type,
          parent: createCategoryDto.parentId
            ? {
              connect: {
                id: createCategoryDto.parentId
              }
            }
            : undefined,
          createdAt: new Date()
        }
      })

      return category
    })

    return result
  }

  async findAll(getCategoryByType: GetCategoryByType) {
    const isIncludeCourseAndSeminar =
      getCategoryByType.isIncludeCourseAndSeminar
    const types = getCategoryByType?.type
    const result = await this.databaseService.client.category.findMany({
      where: {
        types: getCategoryByType?.type,
        parentId: null,
        status: true,
        deletedAt: null
      },
      include: {
        children: true,
        Seminar:
          isIncludeCourseAndSeminar === true && types === ECategoryType.SEMINAR
            ? {
              include: {
                createdByUser: {
                  select: {
                    email: true,
                    full_name: true,
                    avatar: true,
                    gender: true,
                    id: true,
                    profession: true,
                    workplace: true,
                    phone_number: true,
                    roles: true
                  }
                },
                medias: true
              }
            }
            : false,
        Course:
          isIncludeCourseAndSeminar === true && types === ECategoryType.COURSE
            ? {
              include: {
                createdByUser: {
                  select: {
                    email: true,
                    full_name: true,
                    avatar: true,
                    gender: true,
                    id: true,
                    profession: true,
                    workplace: true,
                    phone_number: true,
                    roles: true
                  }
                },
                medias: true
              }
            }
            : false
      }
    })

    for (const category of result) {
      if (isIncludeCourseAndSeminar && category.Course) {
        for (const course of category.Course as any[]) {
          const countStudents = await countStudentOfCourse({
            courseId: course.id,
            databaseService: this.databaseService
          })
          const medias = course.medias.map((media) => ({
            mimeType: media.mediaType,
            mediaUrl: `https://apiv2.hoclientuc.vn/media/stream/${media.mediaType}?path=${media.mediaUrl}`,
            types: media.types,
            id: media.id
          }))
          course.countStudents = countStudents
          course.medias = medias
          course.availableSlots = Number(course.totalStudents) - countStudents
        }
      }
      if (isIncludeCourseAndSeminar && category.Seminar) {
        for (const seminar of category.Seminar as any[]) {
          const medias = seminar.medias.map((media) => ({
            mimeType: media.mediaType,
            mediaUrl: `https://apiv2.hoclientuc.vn/media/stream/${media.mediaType}?path=${media.mediaUrl}`,
            types: media.types,
            id: media.id
          }))
          seminar.medias = medias
        }
      }

      category.children = await this.fetchAllChildren(category.id, isIncludeCourseAndSeminar, types)
    }

    return result
  }

  async fetchAllChildren(parentId: string, isIncludeCourseAndSeminar: boolean, types: ECategoryType): Promise<any[]> {
    const categories = await this.databaseService.client.category.findMany({
      where: {
        parentId: parentId
      },
      include: {
        children: true,
        Seminar:
          isIncludeCourseAndSeminar === true && types === ECategoryType.SEMINAR
            ? {
              include: {
                createdByUser: true,
                medias: true
              }
            }
            : false,
        Course:
          isIncludeCourseAndSeminar === true
            ? {
              include: {
                createdByUser: true,
                medias: true
              }
            }
            : false
      }
    })

    for (const category of categories) {
      if (isIncludeCourseAndSeminar && category.Course) {
        for (const course of category.Course as any[]) {
          const countStudents = await countStudentOfCourse({
            courseId: course.id,
            databaseService: this.databaseService
          })
          const medias = course.medias.map((media) => ({
            mimeType: media.mediaType,
            mediaUrl: `https://apiv2.hoclientuc.vn/media/stream/${media.mediaType}?path=${media.mediaUrl}`,
            types: media.types,
            id: media.id
          }))
          course.medias = medias
          course.countStudents = countStudents
          course.availableSlots = Number(course.totalStudents) - countStudents
        }
      }
      if (isIncludeCourseAndSeminar && category.Seminar) {
        for (const seminar of category.Seminar as any[]) {
          const medias = seminar.medias.map((media) => ({
            mimeType: media.mediaType,
            mediaUrl: `https://apiv2.hoclientuc.vn/media/stream/${media.mediaType}?path=${media.mediaUrl}`,
            types: media.types,
            id: media.id
          }))
          seminar.medias = medias
        }
      }
      category.children = await this.fetchAllChildren(category.id, isIncludeCourseAndSeminar, types)
    }

    return categories
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const isExistCategory = await this.databaseService.client.category.findFirst({
      where: { id: updateCategoryDto.id }
    })
    if (!isExistCategory) {
      throw new NotFoundException('Không tìm thấy danh mục')
    }
    const result = await this.databaseService.client.category.update({
      where: {
        id: updateCategoryDto.id
      },
      data: {
        name: updateCategoryDto.name,
        updatedAt: new Date(),
        status: Boolean(updateCategoryDto.status),
        normalizedName: updateCategoryDto.name
          ? updateCategoryDto.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
          : undefined,
        description: updateCategoryDto.description,
        normalizedDescription: updateCategoryDto.description
          ? updateCategoryDto.description
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
          : undefined,
      }
    })
    return result
  }

  async remove(id: string, queryParams: any, user: IUserFromToken) {
    const isExistCategory = await this.databaseService.client.category.findFirst({
      where: { id: id }
    })
    if (!isExistCategory) {
      throw new NotFoundException('Không tìm thấy danh mục')
    }
    if (Boolean(queryParams.cascade) === true) {
      await this.softDeleteCategoryAndChildren(
        id,
        user?.userId,
        this.databaseService.client
      )
      return {
        message: 'Category and all its children have been soft deleted'
      }
    } else {
      const isExistChildren = await this.databaseService.client.category.findFirst({
        where: {
          parentId: id
        }
      })

      if (isExistChildren) {
        return {
          message: 'Category has children - If you want to delete it, please use cascade option from query params'
        }
      }

      return await this.databaseService.client.category.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date(),
        }
      })
    }
  }

  async softDeleteCategoryAndChildren(categoryId: string, userId: string, client: any) {
    await client.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId
      }
    })

    const children = await client.category.findMany({
      where: { parentId: categoryId }
    })

    for (const child of children) {
      await this.softDeleteCategoryAndChildren(child.id, userId, client)
    }
  }

  async advanced(query: any) {
    return await this.databaseService.advancedQuery({
      queryString: query ?? {},
      model: 'category'
    })
  }
}
