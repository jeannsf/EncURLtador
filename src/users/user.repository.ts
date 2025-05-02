import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userCreateDto: CreateUserDto) {
    const { email, password, firstName, lastName } = userCreateDto;
    const user = await this.prismaService.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
