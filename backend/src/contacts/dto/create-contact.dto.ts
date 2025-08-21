import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString() name: string;
  @IsString() phone: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() photoUrl?: string;
}