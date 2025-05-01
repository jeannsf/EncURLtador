import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { ShortUrlRepository } from './short-url.repository';

@Injectable()
export class ShortUrlService {
  constructor(readonly shortUrlRepository: ShortUrlRepository) {}

  create(createShortUrlDto: CreateShortUrlDto) {
    return this.shortUrlRepository.create(createShortUrlDto);
  }

  async redirect(alias: string) {
    const url = await this.shortUrlRepository.getShortUrl(alias);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    await this.shortUrlRepository.incrementVisit(alias);
    return url;
  }

  async getDetails(alias: string) {
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
