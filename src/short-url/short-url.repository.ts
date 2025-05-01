import { PrismaService } from 'prisma/prisma.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortUrlRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createShortUrlDto: CreateShortUrlDto) {
    const { originalUrl, alias, expiresAt } = createShortUrlDto;
    const shortUrl = await this.prismaService.shortLink.create({
      data: {
        originalUrl,
        alias,
        expiresAt,
      },
    });
    return shortUrl;
  }
}
