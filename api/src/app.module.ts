import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { PubSubModule } from './pubSub.module';
import { AuthenticationModule } from './components/authentication/authentication.module';
import { EmailModule } from './components/email/email.module';
import { PostModule } from './components/post/post.module';
import { UserModule } from './components/user/user.module';
import { WordsModule } from './components/words/words.module';
import { MapsModule } from './components/maps/maps.module';
import { TranslationsModule } from './components/translations/translations.module';
import { DefinitionsModule } from './components/definitions/definitions.module';
import { PhraseModule } from './components/phrases/phrases.module';
import { SiteTextsModule } from './components/site-text/site-texts.module';
import { ForumsModule } from './components/forums/forums.module';
import { ForumFoldersModule } from './components/forum-folders/folders.module';
import { ThreadModule } from './components/threads/threads.module';
import { NotificationModule } from './components/notifications/notification.module';

import { DocumentsModule } from './components/documents/documents.module';
import { PericopiesModule } from './components/pericopies/pericopies.module';
import { QuestionAndAnswersModule } from './components/question-answer/question-answer.module';
import { TaggingsModule } from './components/tagging/tagging.module';

import { FlagsModule } from './components/flag/flags.module';
import { FileModule } from './components/file/file.module';
import { BotsModule } from './components/translator-bots/bots.module';
import { PopulatorModule } from './components/populators/populator.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksModule } from './scheduled-tasks/scheduledTasks.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';
import { PericopeTrModule } from './components/pericope-translations/pericope-tr.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': true,
      },
      sortSchema: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    PubSubModule,
    TranslationsModule,
    AuthenticationModule,
    UserModule,
    PostModule,
    EmailModule,
    WordsModule,
    MapsModule,
    ForumsModule,
    ForumFoldersModule,
    ThreadModule,
    DefinitionsModule,
    PhraseModule,
    SiteTextsModule,
    MiddlewareModule,
    NotificationModule,
    DocumentsModule,
    TaggingsModule,
    QuestionAndAnswersModule,
    PericopiesModule,
    FlagsModule,
    FileModule,
    BotsModule,
    PopulatorModule,
    ScheduleModule.forRoot(),
    ScheduledTasksModule,
    PericopeTrModule,
  ],
  controllers: [],
  providers: [],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
