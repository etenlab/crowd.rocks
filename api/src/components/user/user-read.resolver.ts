import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostgresService } from 'src/core/postgres.service';
import { User, UserReadInput, UserReadOutput } from './types';
import { UserService } from './user.service';

@Injectable()
@Resolver(User)
export class UserReadResolver {
  constructor(private pg: PostgresService, private userService: UserService) {}
  @Query(() => UserReadOutput)
  async userReadResolver(
    @Args('input') input: UserReadInput,
  ): Promise<UserReadOutput> {
    console.log('user read resolver');
    return await this.userService.read(input);
  }
}
