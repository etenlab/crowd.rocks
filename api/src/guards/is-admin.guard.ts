import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationService } from '../components/authentication/authentication.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const token = request.token;

      return await this.authenticationService.isAdmin(token);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
