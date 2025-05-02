import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Response } from 'express';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('shortUrl')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createShortUrlDto: CreateShortUrlDto,
    @Request() req: { user: { id: string } },
  ) {
    const userId: string = req.user.id;
    return this.shortUrlService.create({
      ...createShortUrlDto,
      userId,
    });
  }

  @Get(':alias')
  @UseGuards(JwtAuthGuard)
  async redirect(
    @Param('alias') alias: string,
    @Request() req: { user: { id: string } },
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const url = await this.shortUrlService.redirect(alias, userId);
    return res.redirect(url);
  }

  @Get('admin/:alias')
  getDetails(@Param('alias') alias: string) {
    return this.shortUrlService.getDetails(alias);
  }

  @Delete('admin/:alias')
  async delete(@Param('alias') alias: string) {
    return this.shortUrlService.delete(alias);
  }
}
