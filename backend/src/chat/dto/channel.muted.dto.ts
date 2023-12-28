import { MaxLength, MinLength, IsOptional, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

export class ChannelMutedDto {
	@IsNumber()
	time: number;
}
