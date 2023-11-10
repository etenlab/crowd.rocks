import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerTokenAuthGuard } from '../guards/bearer-token-auth.guard';
import { IsAdminGuard } from '../guards/is-admin.guard';

export function IsAuthAdmin() {
  return applyDecorators(UseGuards(BearerTokenAuthGuard, IsAdminGuard));
}
