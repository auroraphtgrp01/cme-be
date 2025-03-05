import { DatabaseService } from '@/core/database/database.service';
import { comparePassword, hashPassword } from '@/common/utils/hashPassword';

import {
  Injectable,
  Logger,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterUserDto, UpdateUserDto, ValidateUserDto } from '@/modules/users/dto/user.dto';
import { IUserFromToken } from '@/modules/users/user.i';
import {
  EUserRoles,
  RegisterUserNormal,
} from '@/core/auth/dto/create-auth.dto';
@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(UserService.name);

  async registerUserNormal(registerUserNormalPayload: RegisterUserNormal) {
    const emailUser = registerUserNormalPayload.email;
    const newPhoneNumber = registerUserNormalPayload.phone_number;
    if (newPhoneNumber) {
      const existingUser = await this.databaseService.client.user.findFirst({
        where: {
          phone_number: newPhoneNumber,
          id: {
            not: emailUser,
          },
        },
      });
      if (existingUser) {
        throw new UnprocessableEntityException(
          'Số điện thoại này đã sử dụng bởi người dùng khác.'
        );
      }
    }
    if (emailUser) {
      const existingUser = await this.databaseService.client.user.findFirst({
        where: {
          email: emailUser,
          id: {
            not: emailUser,
          },
        },
      });
      if (existingUser) {
        throw new UnprocessableEntityException(
          'Email này đã sử dụng bởi người dùng khác.'
        );
      }
    }
    return await this.databaseService.client.user.create({
      data: {
        ...registerUserNormalPayload,
        password: await hashPassword(registerUserNormalPayload.password),
      },
      select: {
        email: true,
        full_name: true,
        id: true,
        phone_number: true,
        roles: true,
      },
    });
  }

  async validateUser(user: ValidateUserDto) {
    const userExist = await this.databaseService.client.user.findFirst({
      where: { email: user.email },
    });
    if (!userExist) {
      throw new UnprocessableEntityException('User not found');
    }
    const isMatch = comparePassword(user.password, userExist.password);
    if (!isMatch) {
      throw new UnprocessableEntityException('Password is incorrect');
    }
    return userExist;
  }

  async getById(id: string) {
    const user = await this.databaseService.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone_number: true,
        roles: true,
        status: true,
      },
    });
    return user ?? null;
  }

  async initAdminAccount() {
    this.logger.verbose('Checking admin account ... 🧀');
    const isExits = await this.databaseService.client.user.findFirst({
      where: {
        email: 'admin@gmail.com',
      },
    });
    if (!isExits) {
      this.logger.verbose('Admin account does not exits, initialize ... ✨');
      const password = await hashPassword('admin001');
      await this.databaseService.client.user.create({
        data: {
          email: 'admin@gmail.com',
          password: password,
          full_name: 'Admin',
        },
      });
      this.logger.verbose('Admin account initialized successfully ✨');
    }
  }

  async onModuleInit() {
    await this.initAdminAccount();
  }

  async getMe(payload: IUserFromToken) {
    const user: any = await this.databaseService.client.user.findFirst({
      where: {
        id: payload.userId
      },
      select: {
        email: true,
        full_name: true,
        phone_number: true,
        address: true,
        picture: true,
        avatar: {
          select: {
            id: true,
            mediaType: true,
            mediaUrl: true,
            types: true
          }
        },
        date_of_birth: true,
        experience: true,
        gender: true,
        id: true,
        profession: true,
        specialization: true,
        license_number: true,
        workplace: true,
        roles: true,
        placeOfBirth: true,
        placeOfGraduation: true,
        yearOfGraduation: true,
        highestDegree: true
      }
    })

    if (!user) {
      throw new UnprocessableEntityException('Không tìm thấy tài khoản !')
    }

    const medias = user.avatar.map((media) => ({
      mimeType: media.mediaType,
      mediaUrl: `https://apiv2.hoclientuc.vn/media/stream/${media.mediaType}?path=${media.mediaUrl}`,
      types: media.types,
      id: media.id
    }))

    user.medias = medias.length > 0 ? medias : (user.avatar as any)
    delete user.avatar
    return user
  }

  async updatePassword(userId: string, oldPassword, newPassword: string) {
    const isExits = await this.databaseService.client.user.findUnique({
      where: { id: userId }
    })
    if (!isExits) {
      throw new UnprocessableEntityException('Không tìm thấy tài khoản !')
    }
    const compare = await comparePassword(oldPassword, isExits.password)
    if (!compare) {
      throw new UnprocessableEntityException('Mật khẩu cũ không chính xác !')
    }
    return this.databaseService.client.user.update({
      where: { id: userId },
      data: {
        password: await hashPassword(newPassword)
      }
    })
  }

  async create(registerUserPayload: RegisterUserDto, user: IUserFromToken) {
    const emailUser = registerUserPayload.email
    const newPhoneNumber = registerUserPayload.phone_number
    const isAdmin = user.roles === EUserRoles.ADMIN
    const roleCreate =
      registerUserPayload.roles === EUserRoles.ADMIN ||
      registerUserPayload.roles === EUserRoles.EXPERT
    if (!isAdmin && roleCreate) {
      throw new UnprocessableEntityException('Bạn không có quyền tạo tài khoản !')
    }

    if (newPhoneNumber) {
      const existingUser = await this.databaseService.client.user.findFirst({
        where: {
          phone_number: newPhoneNumber,
          id: {
            not: emailUser
          }
        }
      })
      if (existingUser) {
        throw new UnprocessableEntityException('Số điện thoại đã được sử dụng bởi người dùng khác.')
      }
    }
    if (emailUser) {
      const existingUser = await this.databaseService.client.user.findFirst({
        where: {
          email: emailUser,
          id: {
            not: emailUser
          }
        }
      })
      if (existingUser) {
        throw new UnprocessableEntityException('Email này đã sử dụng bởi người dùng khác.')
      }
    }
    await this.databaseService.client.user.create({
      data: {
        ...registerUserPayload,
        email: registerUserPayload.email,
        password: await hashPassword(registerUserPayload.password),
        roles: registerUserPayload.roles as EUserRoles
      }
    })
    return {
      messages: 'Tạo tài khoản thành công'
    }
  }

  async updateUser(id: string, data: UpdateUserDto, user: IUserFromToken) {
    const userId = user.userId
    const newPhoneNumber = data.phone_number

    const isExits = await this.databaseService.client.user.findFirst({
      where: {
        id: id
      }
    })
    if (!isExits) {
      throw new UnprocessableEntityException('Không tìm thấy tài khoản !')
    }

    if (newPhoneNumber) {
      const existingUser = await this.databaseService.client.user.findFirst({
        where: {
          phone_number: newPhoneNumber,
          id: {
            not: userId
          }
        }
      })
      if (existingUser) {
        throw new UnprocessableEntityException('Số điện thoại đã được sử dụng bởi người dùng khác.')
      }
    }

    const updatedUser = await this.databaseService.client.user.update({
      where: {
        id: id
      },
      data: {
        address: data.address,
        date_of_birth: data.dateOfBirth,
        experience: data.experience,
        gender: data.gender,
        profession: data.profession,
        specialization: data.specialization,
        highestDegree: data.highestDegree,
        license_number: data.license_number,
        workplace: data.workplace,
        phone_number: data.phone_number,
        full_name: data.full_name,
        placeOfBirth: data.placeOfBirth,
        placeOfGraduation: data.placeOfGraduation,
        yearOfGraduation: data.yearOfGraduation,

      }
    })

    const { password, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }

  async queryAdvanced(payload: any) {
    return await this.databaseService.advancedQuery({
      queryString: payload,
      model: 'user',
      selectField: {
        email: true,
        full_name: true,
        phone_number: true,
        gender: true,
        id: true,
        profession: true,
        roles: true,
        license_number: true,
        status: true,
        workplace: true,
        address: true,
        avatar: true,
        placeOfBirth: true,
        placeOfGraduation: true,
        yearOfGraduation: true,
        highestDegree: true,
        date_of_birth: true,
        experience: true,
        specialization: true
      }
    })
  }
}
