import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationService } from '../../components/authentication/authentication.service';
const ADMIN_DEFAULT_EMAIL = 'admin@crowd.rocks'; // todo move to .env

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authenticationService: AuthenticationService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const adminAdditionalEmails = this.reflector.get<string[]>(
      'adminAdditionalEmails',
      context.getHandler(),
    );
    const adminEmails = [ADMIN_DEFAULT_EMAIL, ...adminAdditionalEmails];

    console.log(
      `########is-admin-guard for ${JSON.stringify(adminEmails)}########`,
    );

    const request = context.switchToHttp().getRequest();
    const token = request.token;

    return this.usersService.hasRole(user, roles);
  }
}
