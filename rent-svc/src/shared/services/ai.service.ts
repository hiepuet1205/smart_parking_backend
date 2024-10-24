import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly url: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.url = this.configService.get<string>('AI_URL');
  }

  // Get place detail by Id
  async detectLicensePlate(imageUrl: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.url}/detect`, {
        image_url: imageUrl,
      }),
    );
    return response.data;
  }
}
