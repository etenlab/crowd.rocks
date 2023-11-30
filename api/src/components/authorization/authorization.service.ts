import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class AuthorizationService {
  constructor(private authService: AuthenticationService) {}

  // right now, just checking to see if user is registered.
  async is_authorized(token?: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    const userId = await this.authService.get_user_id_from_bearer(token);
    console.log(userId);
    if (!userId) {
      return false;
    } else {
      return true;
    }
  }

  async is_same_user(userId: number, token?: string): Promise<boolean> {
    if (!token) {
      return false;
    }

    const currentUserId = await this.authService.get_user_id_from_bearer(token);

    if (userId === currentUserId) {
      return true;
    } else {
      return false;
    }
  }
}
