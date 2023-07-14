import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { PostReadResolver } from "./word-read.resolver";
import { PostCreateResolver } from "./word-create.resolver";

@Module({
  imports: [CoreModule],
  providers: [
    PostReadResolver,
    PostCreateResolver,
  ],
  exports: [
    PostReadResolver,
    PostCreateResolver,
  ]
})
export class PostModule { }