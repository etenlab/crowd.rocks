import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostReadResolver } from './post-read.resolver';
import { PostCreateResolver } from './post-create.resolver';
import { VersionCreateResolver } from './version-create.resolver';
import { UserReadResolver } from '../user/user-read.resolver';
import { PostService } from './post.service';

@Module({
  imports: [CoreModule],
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
