import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostReadResolver } from './post-read.resolver';
import { PostCreateResolver } from './post-create.resolver';
import { VersionCreateResolver } from './version-create.resolver';

@Module({
  imports: [CoreModule],
  providers: [PostReadResolver, PostCreateResolver, VersionCreateResolver],
  exports: [PostReadResolver, PostCreateResolver, VersionCreateResolver],
})
export class PostModule {}
