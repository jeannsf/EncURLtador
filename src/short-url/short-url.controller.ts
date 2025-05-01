import { Controller, Post, Body, Get, Res, Param } from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Response } from 'express';

@Controller('shortUrl')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post()
  async create(@Body() createShortUrlDto: CreateShortUrlDto) {
    return this.shortUrlService.create(createShortUrlDto);
  }

  @Get(':alias')
  async redirect(@Param('alias') alias: string, @Res() res: Response) {
    const url = await this.shortUrlService.redirect(alias);
    return res.redirect(url);
  }
}
