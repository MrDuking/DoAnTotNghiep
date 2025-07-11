import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../index'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier' })
  }

  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identifier, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
