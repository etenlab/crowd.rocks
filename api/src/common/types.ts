import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

@ObjectType()
export class GenericOutput {
  @Field(type => ErrorType) readonly error: ErrorType
}

export enum ErrorType {
  AvatarUnavailable = "AvatarUnavailable",
  AvatarNotFound = "AvatarNotFound",
  AvatarTooShort = "AvatarTooShort",
  AvatarTooLong = "AvatarTooLong",
  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',
  ElectionNotFound = 'ElectionNotFound',
  EmailNotFound = "EmailNotFound",
  EmailTooLong = "EmailTooLong",
  EmailTooShort = "EmailTooShort",
  EmailInvalid = "EmailInvalid",
  EmailIsBlocked = "EmailIsBlocked",
  EmailUnavailable = "EmailUnavailable",
  InvalidEmailOrPassword = "InvalidEmailOrPassword",
  LimitInvalid = "LimitInvalid",
  NoError = "NoError",
  OffsetInvalid = "OffsetInvalid",
  ParentElectionNotFound = "ParentElectionNotFound",
  PasswordTooLong = "PasswordTooLong",
  PasswordTooShort = "PasswordTooShort",
  PasswordInvalid = "PasswordInvalid",
  PositionInvalid = "PositionInvalid",
  PostCreateFailed = "PostCreateFailed",
  PrefixInvalid = "PrefixInvalid",
  PrefixTooLong = "PrefixTooLong",
  PrefixTooShort = "PrefixTooShort",
  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',
  TokenInvalid = "TokenInvalid",
  Unauthorized = "Unauthorized",
  UnknownError = "UnknownError",
}

registerEnumType(ErrorType, {
  name: 'ErrorType',
});