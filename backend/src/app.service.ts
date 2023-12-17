import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
}



export function IsImageFile(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(avatar: string, args: ValidationArguments) {
			const acceptMimeTypes = ['image/png', 'image/jpeg'];
			const isValidMimeType = acceptMimeTypes.some(type => avatar.startsWith(`data:${type}`));

			const isValidFileType = ['png', 'jpeg'].some(type => avatar.includes(`data:image/${type}`));

			const maxSize = 1000000;
          	const isValidSize = Buffer.from(avatar, 'base64').length <= maxSize;
			return isValidMimeType && isValidFileType && isValidSize;
          	
        },
		defaultMessage(args: ValidationArguments) {
			return 'Invalid image file. Supported types: image/png, image/jpeg. Maximum size: 1MB';
		  },
      },
    });
  };
}
