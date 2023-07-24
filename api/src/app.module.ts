import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthenticationModule } from './components/authentication/authentication.module';
import { EmailModule } from './components/email/email.module';
import { PostModule } from './components/post/post.module';
import { UserModule } from './components/user/user.module';
import { WordModule } from './components/words/words.module';
import { MapModule } from './components/maps/maps.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    AuthenticationModule,
    UserModule,
    PostModule,
    EmailModule,
    WordModule,
    MapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
