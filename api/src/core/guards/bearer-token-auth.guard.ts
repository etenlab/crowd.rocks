import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationService } from '../../components/authorization/authorization.service';
@Injectable()
export class BearerTokenAuthGuard implements CanActivate {
  constructor(private readonly authorizationService: AuthorizationService) {} // inject here services if needed

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const is_authorized = await this.authorizationService.is_authorized(
        token,
      );

      if (!is_authorized) throw new UnauthorizedException();

      request['token'] = token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
