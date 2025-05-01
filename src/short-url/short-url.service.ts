import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { ShortUrlRepository } from './short-url.repository';

@Injectable()
export class ShortUrlService {
  constructor(readonly shortUrlRepository: ShortUrlRepository) {}

  create(createShortUrlDto: CreateShortUrlDto) {
    return this.shortUrlRepository.create(createShortUrlDto);
  }
}
