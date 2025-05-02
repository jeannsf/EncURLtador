import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userRepository.create(userWithHashedPassword);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
