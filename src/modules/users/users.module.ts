import { UserController } from '@/modules/users/users.controller';
import { UserService } from '@/modules/users/users.service';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
