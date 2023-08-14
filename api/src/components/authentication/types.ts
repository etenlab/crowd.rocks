import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Session {
  @Field(() => ID) user_id: number;
  @Field() token: string;
  @Field() readonly avatar: string;
  @Field(() => String, { nullable: true }) readonly avatar_url: string | null;
}

@InputType()
export class RegisterInput {
  @Field() readonly email: string;
  @Field() readonly password: string;
  @Field() readonly avatar: string;
}

@ObjectType()
export class RegisterOutput extends GenericOutput {
  @Field(() => Session, { nullable: true })
  readonly session: Session | null;
}

@InputType()
export class LoginInput {
  @Field() readonly email: string;
  @Field() readonly password: string;
}

@ObjectType()
export class LoginOutput extends GenericOutput {
  @Field(() => Session, { nullable: true })
  readonly session: Session | null;
}

@InputType()
export class LogoutInput {
  @Field() readonly token: string;
}

@ObjectType()
export class LogoutOutput extends GenericOutput {}

@InputType()
export class ResetEmailRequestInput {
  @Field() email: string;
}

@ObjectType()
export class ResetEmailRequestOutput extends GenericOutput {}

@InputType()
export class PasswordResetFormInput {
  @Field() token: string;
  @Field() password: string;
}

@ObjectType()
export class PasswordResetFormOutput extends GenericOutput {}
