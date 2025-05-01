export class CreateShortUrlDto {
  originalUrl: string;
  alias: string;
  expiresAt: Date;
}
