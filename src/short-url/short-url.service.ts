import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { ShortUrlRepository } from './short-url.repository';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class ShortUrlService {
  constructor(
    private readonly shortUrlRepository: ShortUrlRepository,
    private readonly userRepository: UserRepository,
  ) {}

  create(createShortUrlDto: CreateShortUrlDto) {
    return this.shortUrlRepository.create(createShortUrlDto);
  }

  async redirect(alias: string, userId: string) {
    const url = await this.shortUrlRepository.getShortUrlByAliasAndUser(
      alias,
      userId,
    );
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    await this.shortUrlRepository.incrementVisit(alias);
    return url;
  }

  async getDetailsAsAdmin(alias: string, userId: string) {
    const role = await this.userRepository.getUserRole(userId);

    if (role !== 'ADMIN') {
      throw new ForbiddenException('Access allowed only for administrators');
    }

    const urlDetails = await this.shortUrlRepository.getDetails(alias);
    if (!urlDetails) {
      throw new NotFoundException('URL not found');
    }
    return urlDetails;
  }

  async delete(alias: string) {
    const urlDelete = await this.shortUrlRepository.delete(alias);
    if (!urlDelete) {
      throw new NotFoundException('URL not found');
    }
    return urlDelete;
  }
}
