import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IHttpClient } from '../../domain/ports/http-client.port';

@Injectable()
export class AxiosHttpClient implements IHttpClient {
  async getBuffer(url: string): Promise<Buffer> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        Accept: 'image/',
      },
    });
    return Buffer.from(response.data as string, 'binary');
  }
}
