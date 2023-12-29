import { MaxLength, MinLength, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';

export class ChannelCreateDto {
	@MinLength(4)
	@MaxLength(20)
	name: string;
	@Optional()
	description: string;
	@IsOptional()
	password: string;
	users: number[];
}
