import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { IMAGE_STORAGE } from './cloudinary.tokens';

@Global()
@Module({
  providers: [
    {
      provide: IMAGE_STORAGE,
      useClass: CloudinaryService,
    },
  ],
  exports: [IMAGE_STORAGE],
})
export class CloudinaryModule {}
