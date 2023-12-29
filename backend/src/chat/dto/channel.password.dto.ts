import { MaxLength, MinLength, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';

export class ChannelPasswordDto {
	@Optional()
	password: string;
}
