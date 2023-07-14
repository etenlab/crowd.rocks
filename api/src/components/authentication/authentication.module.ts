import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { LoginResolver } from "./login.resolver";
import { LogoutResolver } from "./logout.resolver";
import { RegisterResolver } from "./register.resolver";

@Module({
  imports: [CoreModule],
  providers: [RegisterResolver, LoginResolver, LogoutResolver],
})
export class AuthenticationModule {}