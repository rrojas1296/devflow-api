export interface IHttpClient {
  getBuffer(url: string): Promise<Buffer>;
}

export const HTTP_CLIENT = 'IHttpClient';
