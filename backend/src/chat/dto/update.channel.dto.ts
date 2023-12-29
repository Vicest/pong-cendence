import { MaxLength, MinLength, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateCreateDto {
	@MinLength(4)
	@MaxLength(20)
	name: string;
	@Optional()
	description: string;
	@IsOptional()
	password: string;
}
