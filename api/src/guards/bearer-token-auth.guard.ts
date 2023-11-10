import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthorizationService } from '../components/authorization/authorization.service';
@Injectable()
export class BearerTokenAuthGuard implements CanActivate {
  constructor(private readonly authorizationService: AuthorizationService) {} // inject here services if needed

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
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
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
