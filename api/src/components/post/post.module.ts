import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostReadResolver } from './post-read.resolver';
import { PostCreateResolver } from './post-create.resolver';
import { VersionCreateResolver } from './version-create.resolver';
import { UserReadResolver } from '../user/user-read.resolver';
import { NotificationModule } from '../notifications/notification.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { PostService } from './post.service';
import { ThreadModule } from '../threads/threads.module';
import { PhraseModule } from '../phrases/phrases.module';
import { DefinitionsModule } from '../definitions/definitions.module';
import { WordsModule } from '../words/words.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    CoreModule,
    NotificationModule,
    forwardRef(() => ThreadModule),
    forwardRef(() => PhraseModule),
    forwardRef(() => DefinitionsModule),
    forwardRef(() => WordsModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => UserModule),
    forwardRef(() => TranslationsModule),
  ],
  providers: [
    UserReadResolver,
    PostReadResolver,
    PostCreateResolver,
    VersionCreateResolver,
    PostService,
  ],
  exports: [PostReadResolver, PostCreateResolver, VersionCreateResolver],
})
export class PostModule {}
