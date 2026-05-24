import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IImageStorage',
      useClass: CloudinaryService,
    },
  ],
  exports: ['IImageStorage'],
})
export class CloudinaryModule {}
