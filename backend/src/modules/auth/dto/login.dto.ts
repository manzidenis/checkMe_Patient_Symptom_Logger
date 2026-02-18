import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'User email address', example: 'clinician@checkme.rw' })
    @IsEmail()
    email!: string;

    @ApiProperty({ description: 'User password', example: 'clinician123' })
    @IsString()
    @IsNotEmpty()
    password!: string;
}
