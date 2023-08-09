import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class GenericOutput {
  @Field(() => ErrorType) readonly error: ErrorType;
}

export enum ErrorType {
  AvatarUnavailable = 'AvatarUnavailable',
  AvatarNotFound = 'AvatarNotFound',
  AvatarTooShort = 'AvatarTooShort',
  AvatarTooLong = 'AvatarTooLong',

  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',

  ElectionNotFound = 'ElectionNotFound',

  EmailNotFound = 'EmailNotFound',
  EmailTooLong = 'EmailTooLong',
  EmailTooShort = 'EmailTooShort',
  EmailInvalid = 'EmailInvalid',
  EmailIsBlocked = 'EmailIsBlocked',
  EmailUnavailable = 'EmailUnavailable',

  InvalidEmailOrPassword = 'InvalidEmailOrPassword',
  InvalidInputs = 'InvalidInputs',
  LimitInvalid = 'LimitInvalid',
  NoError = 'NoError',
  OffsetInvalid = 'OffsetInvalid',
  ParentElectionNotFound = 'ParentElectionNotFound',

  PasswordTooLong = 'PasswordTooLong',
  PasswordTooShort = 'PasswordTooShort',
  PasswordInvalid = 'PasswordInvalid',

  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',

  PrefixInvalid = 'PrefixInvalid',
  PrefixTooLong = 'PrefixTooLong',
  PrefixTooShort = 'PrefixTooShort',

  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',

  TokenInvalid = 'TokenInvalid',

  WordInsertFailed = 'WordInsertFailed',
  WordLikeStringInsertFailed = 'WordLikeStringInsertFailed',

  WordNotFound = 'WordNotFound',
  WordDefinitionNotFound = 'WordDefinitionNotFound',
  WordDefinitionAlreadyExists = 'WordDefinitionAlreadyExists',
  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseDefinitionAlreadyExists = 'PhraseDefinitionAlreadyExists',
  PhraseNotFound = 'PhraseNotFound',

  PhraseToPhraseTranslationNotFound = 'PhraseToPhraseTranslationNotFound',
  WordToWordTranslationNotFound = 'WordToWordTranslationNotFound',
  WordToPhraseTranslationNotFound = 'WordToPhraseTranslationNotFound',
  PhraseToWordTranslationNotFound = 'PhraseToWordTranslationNotFound',

  SiteTextTranslationNotFound = 'SiteTextTranslationNotFound',
  SiteTextWordDefinitionAlreadyExists = 'SiteTextWordDefinitionAlreadyExists',
  SiteTextWordDefinitionNotFound = 'SiteTextWordDefinitionNotFound',
  SiteTextPhraseDefinitionAlreadyExists = 'SiteTextPhraseDefinitionAlreadyExists',

  MapFilenameAlreadyExists = 'MapFilenameAlreadyExists',
  MapInsertFailed = 'MapInsertFailed',

  Unauthorized = 'Unauthorized',
  UnknownError = 'UnknownError',
}

registerEnumType(ErrorType, {
  name: 'ErrorType',
});

export interface ITagInfo {
  tag: string | null;
  descriptions?: Array<string>;
}

export type TLang = Omit<ITagInfo, 'tag'> & { tag: string }; // make tag mandatory for Lang tag
export type TRegion = ITagInfo;
export type TDialect = ITagInfo;

export type LanguageInfo = {
  lang: TLang;
  dialect?: TDialect | undefined;
  region?: TRegion | undefined;
};
