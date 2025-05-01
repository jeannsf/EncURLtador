import { Module } from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlRepository } from './short-url.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersController } from 'src/users/users.controller';
import { UserRepository } from 'src/users/user.repository';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShortUrlController, UsersController],
  providers: [
    ShortUrlService,
    ShortUrlRepository,
    UserRepository,
    UsersService,
  ],
})
export class ShortUrlModule {}
