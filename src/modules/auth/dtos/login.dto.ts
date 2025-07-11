import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'coithichiu', description: 'Username, email or PhoneNumber' })
  @IsString()
  identifier!: string

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @MinLength(6)
  password!: string
}
