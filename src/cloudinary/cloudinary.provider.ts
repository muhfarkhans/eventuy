import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (config: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: config.get('CLOUDINARY_NAME'),
      api_key: config.get('CLOUDINARY_KEY'),
      api_secret: config.get('CLOUDINARY_SECRET'),
    });
  },
  inject: [ConfigService],
};
