import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

const HUMAN_LOGIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE'];

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true, // gives us access to req.body
    });
  }

  async validate(req: any, email: string, password: string) {
    const selectedRole: string = req.body?.role;

    // Block AI_SERVICE and invalid roles at the strategy level
    if (!selectedRole || !HUMAN_LOGIN_ROLES.includes(selectedRole)) {
      throw new UnauthorizedException(
        'Invalid role selected. Only human roles may use the login form.',
      );
    }

    const user = await this.authService.validateUser(email, password, selectedRole);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials or account not authorized for the selected role.');
    }
    return user;
  }
}
