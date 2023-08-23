import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AddWordAsTranslationForWordInput = {
  originalDefinitionId: Scalars['String']['input'];
  translationDefinition: Scalars['String']['input'];
  translationWord: WordUpsertInput;
};

export type AddWordAsTranslationForWordOutput = {
  __typename?: 'AddWordAsTranslationForWordOutput';
  error: ErrorType;
  wordTranslationId: Scalars['String']['output'];
};

export type AvatarUpdateInput = {
  avatar: Scalars['String']['input'];
};

export type AvatarUpdateOutput = {
  __typename?: 'AvatarUpdateOutput';
  error: ErrorType;
  user?: Maybe<User>;
};

export type DefinitionUpdateaInput = {
  definition_id: Scalars['ID']['input'];
  definition_type_is_word: Scalars['Boolean']['input'];
  definitionlike_string: Scalars['String']['input'];
};

export type DefinitionVoteStatus = {
  __typename?: 'DefinitionVoteStatus';
  definition_id: Scalars['ID']['output'];
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
};

export type DefinitionVoteStatusOutputRow = {
  __typename?: 'DefinitionVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<DefinitionVoteStatus>;
};

export type EmailResponseInput = {
  token: Scalars['String']['input'];
};

export type EmailResponseOutput = {
  __typename?: 'EmailResponseOutput';
  error: ErrorType;
};

export enum ErrorType {
  AvatarNotFound = 'AvatarNotFound',
  AvatarTooLong = 'AvatarTooLong',
  AvatarTooShort = 'AvatarTooShort',
  AvatarUnavailable = 'AvatarUnavailable',
  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',
  ElectionNotFound = 'ElectionNotFound',
  EmailInvalid = 'EmailInvalid',
  EmailIsBlocked = 'EmailIsBlocked',
  EmailNotFound = 'EmailNotFound',
  EmailTooLong = 'EmailTooLong',
  EmailTooShort = 'EmailTooShort',
  EmailUnavailable = 'EmailUnavailable',
  InvalidEmailOrPassword = 'InvalidEmailOrPassword',
  InvalidInputs = 'InvalidInputs',
  LimitInvalid = 'LimitInvalid',
  MapFilenameAlreadyExists = 'MapFilenameAlreadyExists',
  MapInsertFailed = 'MapInsertFailed',
  NoError = 'NoError',
  OffsetInvalid = 'OffsetInvalid',
  ParentElectionNotFound = 'ParentElectionNotFound',
  PasswordInvalid = 'PasswordInvalid',
  PasswordTooLong = 'PasswordTooLong',
  PasswordTooShort = 'PasswordTooShort',
  PhraseDefinitionAlreadyExists = 'PhraseDefinitionAlreadyExists',
  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseNotFound = 'PhraseNotFound',
  PhraseToPhraseTranslationNotFound = 'PhraseToPhraseTranslationNotFound',
  PhraseToWordTranslationNotFound = 'PhraseToWordTranslationNotFound',
  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',
  PrefixInvalid = 'PrefixInvalid',
  PrefixTooLong = 'PrefixTooLong',
  PrefixTooShort = 'PrefixTooShort',
  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',
  SiteTextPhraseDefinitionAlreadyExists = 'SiteTextPhraseDefinitionAlreadyExists',
  SiteTextPhraseDefinitionNotFound = 'SiteTextPhraseDefinitionNotFound',
  SiteTextWordDefinitionAlreadyExists = 'SiteTextWordDefinitionAlreadyExists',
  SiteTextWordDefinitionNotFound = 'SiteTextWordDefinitionNotFound',
  TokenInvalid = 'TokenInvalid',
  Unauthorized = 'Unauthorized',
  UnknownError = 'UnknownError',
  WordDefinitionAlreadyExists = 'WordDefinitionAlreadyExists',
  WordDefinitionNotFound = 'WordDefinitionNotFound',
  WordInsertFailed = 'WordInsertFailed',
  WordLikeStringInsertFailed = 'WordLikeStringInsertFailed',
  WordNotFound = 'WordNotFound',
  WordToPhraseTranslationNotFound = 'WordToPhraseTranslationNotFound',
  WordToWordTranslationNotFound = 'WordToWordTranslationNotFound'
}

export type FileUploadUrlRequest = {
  user_id: Scalars['ID']['input'];
};

export type FileUploadUrlResponse = {
  __typename?: 'FileUploadUrlResponse';
  avatar_image_url: Scalars['String']['output'];
  error: ErrorType;
  url: Scalars['String']['output'];
};

export type FromPhraseAndDefintionlikeStringUpsertInput = {
  definitionlike_string: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  phraselike_string: Scalars['String']['input'];
};

export type FromWordAndDefintionlikeStringUpsertInput = {
  definitionlike_string: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  wordlike_string: Scalars['String']['input'];
};

export type GetAllMapsListInput = {
  lang?: InputMaybe<LanguageInput>;
};

export type GetAllMapsListOutput = {
  __typename?: 'GetAllMapsListOutput';
  allMapsList: Array<MapFileOutput>;
};

export type GetOrigMapContentInput = {
  original_map_id: Scalars['ID']['input'];
};

export type GetOrigMapContentOutput = {
  __typename?: 'GetOrigMapContentOutput';
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  is_original: Scalars['Boolean']['output'];
  language: LanguageOutput;
  map_file_name: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
  translated_map_id?: Maybe<Scalars['ID']['output']>;
};

export type GetOrigMapListInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetOrigMapWordsInput = {
  o_dialect_code?: InputMaybe<Scalars['String']['input']>;
  o_geo_code?: InputMaybe<Scalars['String']['input']>;
  o_language_code?: InputMaybe<Scalars['String']['input']>;
  original_map_id?: InputMaybe<Scalars['ID']['input']>;
  t_dialect_code?: InputMaybe<Scalars['String']['input']>;
  t_geo_code?: InputMaybe<Scalars['String']['input']>;
  t_language_code?: InputMaybe<Scalars['String']['input']>;
};

export type GetOrigMapWordsOutput = {
  __typename?: 'GetOrigMapWordsOutput';
  origMapWords: Array<WordTranslations>;
};

export type GetOrigMapsListOutput = {
  __typename?: 'GetOrigMapsListOutput';
  origMapList: Array<MapFileOutput>;
};

export type GetTranslatedMapContentInput = {
  translated_map_id: Scalars['ID']['input'];
};

export type GetTranslatedMapContentOutput = {
  __typename?: 'GetTranslatedMapContentOutput';
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  is_original: Scalars['Boolean']['output'];
  language: LanguageOutput;
  map_file_name: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
  translated_map_id?: Maybe<Scalars['ID']['output']>;
};

export type IsAdminIdInput = {
  user_id: Scalars['ID']['input'];
};

export type IsAdminIdOutput = {
  __typename?: 'IsAdminIdOutput';
  isAdmin: Scalars['Boolean']['output'];
};

export type LanguageInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
};

export type LanguageOutput = {
  __typename?: 'LanguageOutput';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  error: ErrorType;
  session?: Maybe<Session>;
};

export type LogoutInput = {
  token: Scalars['String']['input'];
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  error: ErrorType;
};

export type MapFileOutput = {
  __typename?: 'MapFileOutput';
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  is_original: Scalars['Boolean']['output'];
  language: LanguageOutput;
  map_file_name: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
  translated_map_id?: Maybe<Scalars['ID']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addWordAsTranslationForWord: AddWordAsTranslationForWordOutput;
  avatarUpdateResolver: AvatarUpdateOutput;
  emailResponseResolver: EmailResponseOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  mapUpload: MapFileOutput;
  passwordResetFormResolver: LoginOutput;
  phraseDefinitionUpsert: PhraseDefinitionUpsertOutput;
  phraseToPhraseTranslationUpsert: PhraseToPhraseTranslationUpsertOutput;
  phraseUpsert: PhraseUpsertOutput;
  phraseVoteUpsert: PhraseVoteOutput;
  postCreateResolver: PostCreateOutput;
  register: RegisterOutput;
  resetEmailRequest: ResetEmailRequestOutput;
  siteTextPhraseDefinitionUpsert: SiteTextPhraseDefinitionOutput;
  siteTextTranslationVoteUpsert: SiteTextTranslationVoteOutput;
  siteTextUpsert: SiteTextDefinitionOutput;
  siteTextWordDefinitionUpsert: SiteTextWordDefinitionOutput;
  togglePhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  togglePhraseToPhraseTrVoteStatus: PhraseToPhraseTranslationVoteStatusOutputRow;
  togglePhraseToWordTrVoteStatus: PhraseToWordTranslationVoteStatusOutputRow;
  togglePhraseVoteStatus: PhraseVoteStatusOutputRow;
  toggleSiteTextTranslationVoteStatus: SiteTextTranslationVoteStatusOutputRow;
  toggleTranslationVoteStatus: TranslationVoteStatusOutputRow;
  toggleWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  toggleWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  toggleWordTrVoteStatus: WordTrVoteStatusOutputRow;
  toggleWordVoteStatus: WordVoteStatusOutputRow;
  updateDefinition: PhraseDefinitionUpsertOutput;
  upsertFromTranslationlikeString: TranslationUpsertOutput;
  upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: PhraseDefinitionUpsertOutput;
  upsertSiteTextTranslation: TranslationUpsertOutput;
  upsertTranslation: TranslationUpsertOutput;
  upsertTranslationFromWordAndDefinitionlikeString: TranslationUpsertOutput;
  upsertWordDefinitionFromWordAndDefinitionlikeString: WordDefinitionUpsertOutput;
  versionCreateResolver: VersionCreateOutput;
  wordDefinitionUpsert: WordDefinitionUpsertOutput;
  wordToPhraseTranslationUpsert: WordToPhraseTranslationUpsertOutput;
  wordToWordTranslationUpsert: WordToWordTranslationUpsertOutput;
  wordUpsert: WordUpsertOutput;
  wordVoteUpsert: WordVoteOutput;
};


export type MutationAddWordAsTranslationForWordArgs = {
  input: AddWordAsTranslationForWordInput;
};


export type MutationAvatarUpdateResolverArgs = {
  input: AvatarUpdateInput;
};


export type MutationEmailResponseResolverArgs = {
  input: EmailResponseInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  input: LogoutInput;
};


export type MutationMapUploadArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationPasswordResetFormResolverArgs = {
  input: PasswordResetFormInput;
};


export type MutationPhraseDefinitionUpsertArgs = {
  input: PhraseDefinitionUpsertInput;
};


export type MutationPhraseToPhraseTranslationUpsertArgs = {
  input: PhraseToPhraseTranslationUpsertInput;
};


export type MutationPhraseUpsertArgs = {
  input: PhraseUpsertInput;
};


export type MutationPhraseVoteUpsertArgs = {
  input: PhraseVoteUpsertInput;
};


export type MutationPostCreateResolverArgs = {
  input: PostCreateInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationResetEmailRequestArgs = {
  input: ResetEmailRequestInput;
};


export type MutationSiteTextPhraseDefinitionUpsertArgs = {
  phrase_definition_id: Scalars['ID']['input'];
};


export type MutationSiteTextTranslationVoteUpsertArgs = {
  from_type_is_word: Scalars['Boolean']['input'];
  to_type_is_word: Scalars['Boolean']['input'];
  translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationSiteTextUpsertArgs = {
  input: SiteTextUpsertInput;
};


export type MutationSiteTextWordDefinitionUpsertArgs = {
  word_definition_id: Scalars['ID']['input'];
};


export type MutationTogglePhraseDefinitionVoteStatusArgs = {
  phrase_definition_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationTogglePhraseToPhraseTrVoteStatusArgs = {
  phrase_to_phrase_translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationTogglePhraseToWordTrVoteStatusArgs = {
  phrase_to_word_translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationTogglePhraseVoteStatusArgs = {
  phrase_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationToggleSiteTextTranslationVoteStatusArgs = {
  from_type_is_word: Scalars['Boolean']['input'];
  to_type_is_word: Scalars['Boolean']['input'];
  translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationToggleTranslationVoteStatusArgs = {
  from_definition_type_is_word: Scalars['Boolean']['input'];
  to_definition_type_is_word: Scalars['Boolean']['input'];
  translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationToggleWordDefinitionVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_definition_id: Scalars['ID']['input'];
};


export type MutationToggleWordToPhraseTrVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_to_phrase_translation_id: Scalars['ID']['input'];
};


export type MutationToggleWordTrVoteStatusArgs = {
  input: WordTrVoteStatusInput;
};


export type MutationToggleWordVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_id: Scalars['ID']['input'];
};


export type MutationUpdateDefinitionArgs = {
  input: DefinitionUpdateaInput;
};


export type MutationUpsertFromTranslationlikeStringArgs = {
  fromInput: SiteTextTranslationsFromInput;
  toInput: SiteTextTranslationsToInput;
};


export type MutationUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringArgs = {
  input: FromPhraseAndDefintionlikeStringUpsertInput;
};


export type MutationUpsertSiteTextTranslationArgs = {
  input: SiteTextTranslationUpsertInput;
};


export type MutationUpsertTranslationArgs = {
  from_definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  to_definition_id: Scalars['ID']['input'];
  to_definition_type_is_word: Scalars['Boolean']['input'];
};


export type MutationUpsertTranslationFromWordAndDefinitionlikeStringArgs = {
  from_definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  to_definition_input: ToDefinitionInput;
};


export type MutationUpsertWordDefinitionFromWordAndDefinitionlikeStringArgs = {
  input: FromWordAndDefintionlikeStringUpsertInput;
};


export type MutationVersionCreateResolverArgs = {
  input: VersionCreateInput;
};


export type MutationWordDefinitionUpsertArgs = {
  input: WordDefinitionUpsertInput;
};


export type MutationWordToPhraseTranslationUpsertArgs = {
  input: WordToPhraseTranslationUpsertInput;
};


export type MutationWordToWordTranslationUpsertArgs = {
  input: WordToWordTranslationUpsertInput;
};


export type MutationWordUpsertArgs = {
  input: WordUpsertInput;
};


export type MutationWordVoteUpsertArgs = {
  input: WordVoteUpsertInput;
};

export type PasswordResetFormInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Phrase = {
  __typename?: 'Phrase';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
};

export type PhraseDefinition = {
  __typename?: 'PhraseDefinition';
  definition: Scalars['String']['output'];
  phrase: Phrase;
  phrase_definition_id: Scalars['ID']['output'];
};

export type PhraseDefinitionReadOutput = {
  __typename?: 'PhraseDefinitionReadOutput';
  error: ErrorType;
  phrase_definition?: Maybe<PhraseDefinition>;
};

export type PhraseDefinitionUpsertInput = {
  definition: Scalars['String']['input'];
  phrase_id: Scalars['ID']['input'];
};

export type PhraseDefinitionUpsertOutput = {
  __typename?: 'PhraseDefinitionUpsertOutput';
  error: ErrorType;
  phrase_definition?: Maybe<PhraseDefinition>;
};

export type PhraseDefinitionVote = {
  __typename?: 'PhraseDefinitionVote';
  last_updated_at: Scalars['DateTime']['output'];
  phrase_definition_id: Scalars['ID']['output'];
  phrase_definitions_vote_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type PhraseDefinitionWithVote = {
  __typename?: 'PhraseDefinitionWithVote';
  created_at: Scalars['String']['output'];
  definition: Scalars['String']['output'];
  downvotes: Scalars['Int']['output'];
  phrase: Phrase;
  phrase_definition_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseDefinitionWithVoteListOutput = {
  __typename?: 'PhraseDefinitionWithVoteListOutput';
  error: ErrorType;
  phrase_definition_list: Array<Maybe<PhraseDefinitionWithVote>>;
};

export type PhraseReadInput = {
  phrase_id: Scalars['ID']['input'];
};

export type PhraseReadOutput = {
  __typename?: 'PhraseReadOutput';
  error: ErrorType;
  phrase?: Maybe<Phrase>;
};

export type PhraseToPhraseTranslation = {
  __typename?: 'PhraseToPhraseTranslation';
  from_phrase_definition: PhraseDefinition;
  phrase_to_phrase_translation_id: Scalars['ID']['output'];
  to_phrase_definition: PhraseDefinition;
};

export type PhraseToPhraseTranslationReadOutput = {
  __typename?: 'PhraseToPhraseTranslationReadOutput';
  error: ErrorType;
  phrase_to_phrase_translation?: Maybe<PhraseToPhraseTranslation>;
};

export type PhraseToPhraseTranslationUpsertInput = {
  from_phrase_definition_id: Scalars['ID']['input'];
  to_phrase_definition_id: Scalars['ID']['input'];
};

export type PhraseToPhraseTranslationUpsertOutput = {
  __typename?: 'PhraseToPhraseTranslationUpsertOutput';
  error: ErrorType;
  phrase_to_phrase_translation?: Maybe<PhraseToPhraseTranslation>;
};

export type PhraseToPhraseTranslationVoteStatus = {
  __typename?: 'PhraseToPhraseTranslationVoteStatus';
  downvotes: Scalars['Int']['output'];
  phrase_to_phrase_translation_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseToPhraseTranslationVoteStatusOutputRow = {
  __typename?: 'PhraseToPhraseTranslationVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<PhraseToPhraseTranslationVoteStatus>;
};

export type PhraseToPhraseTranslationWithVote = {
  __typename?: 'PhraseToPhraseTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_phrase_definition: PhraseDefinition;
  phrase_to_phrase_translation_id: Scalars['ID']['output'];
  to_phrase_definition: PhraseDefinition;
  upvotes: Scalars['Int']['output'];
};

export type PhraseToPhraseTranslationWithVoteListOutput = {
  __typename?: 'PhraseToPhraseTranslationWithVoteListOutput';
  error: ErrorType;
  phrase_to_phrase_tr_with_vote_list?: Maybe<Array<PhraseToPhraseTranslationWithVote>>;
};

export type PhraseToWordTranslation = {
  __typename?: 'PhraseToWordTranslation';
  from_phrase_definition: PhraseDefinition;
  phrase_to_word_translation_id: Scalars['ID']['output'];
  to_word_definition: WordDefinition;
};

export type PhraseToWordTranslationVoteStatus = {
  __typename?: 'PhraseToWordTranslationVoteStatus';
  downvotes: Scalars['Int']['output'];
  phrase_to_word_translation_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseToWordTranslationVoteStatusOutputRow = {
  __typename?: 'PhraseToWordTranslationVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<PhraseToWordTranslationVoteStatus>;
};

export type PhraseToWordTranslationWithVote = {
  __typename?: 'PhraseToWordTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_phrase_definition: PhraseDefinition;
  phrase_to_word_translation_id: Scalars['ID']['output'];
  to_word_definition: WordDefinition;
  upvotes: Scalars['Int']['output'];
};

export type PhraseToWordTranslationWithVoteListOutput = {
  __typename?: 'PhraseToWordTranslationWithVoteListOutput';
  error: ErrorType;
  phrase_to_word_tr_with_vote_list?: Maybe<Array<PhraseToWordTranslationWithVote>>;
};

export type PhraseUpsertInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  phraselike_string: Scalars['String']['input'];
};

export type PhraseUpsertOutput = {
  __typename?: 'PhraseUpsertOutput';
  error: ErrorType;
  phrase?: Maybe<Phrase>;
};

export type PhraseVote = {
  __typename?: 'PhraseVote';
  last_updated_at: Scalars['DateTime']['output'];
  phrase_id: Scalars['ID']['output'];
  phrase_vote_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type PhraseVoteOutput = {
  __typename?: 'PhraseVoteOutput';
  error: ErrorType;
  phrase_vote?: Maybe<PhraseVote>;
};

export type PhraseVoteStatus = {
  __typename?: 'PhraseVoteStatus';
  downvotes: Scalars['Int']['output'];
  phrase_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseVoteStatusOutputRow = {
  __typename?: 'PhraseVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<PhraseVoteStatus>;
};

export type PhraseVoteUpsertInput = {
  phrase_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};

export type PhraseWithDefinitions = {
  __typename?: 'PhraseWithDefinitions';
  definitions: Array<Maybe<PhraseDefinition>>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseWithVote = {
  __typename?: 'PhraseWithVote';
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseWithVoteListOutput = {
  __typename?: 'PhraseWithVoteListOutput';
  error: ErrorType;
  phrase_with_vote_list: Array<Maybe<PhraseWithDefinitions>>;
};

export type PhraseWithVoteOutput = {
  __typename?: 'PhraseWithVoteOutput';
  error: ErrorType;
  phrase_with_vote?: Maybe<PhraseWithVote>;
};

export type Post = {
  __typename?: 'Post';
  created_at: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  post_id: Scalars['ID']['output'];
};

export type PostCreateInput = {
  content: Scalars['String']['input'];
  parent_id?: InputMaybe<Scalars['Int']['input']>;
};

export type PostCreateOutput = {
  __typename?: 'PostCreateOutput';
  error: ErrorType;
  post?: Maybe<Post>;
};

export type PostReadInput = {
  post_id: Scalars['ID']['input'];
};

export type PostReadOutput = {
  __typename?: 'PostReadOutput';
  error: ErrorType;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  fileUploadUrlRequest: FileUploadUrlResponse;
  getAllMapsList: GetAllMapsListOutput;
  getAllRecommendedSiteTextTranslationList: SiteTextTranslationWithVoteListByLanguageListOutput;
  getAllRecommendedSiteTextTranslationListByLanguage: SiteTextTranslationWithVoteListByLanguageOutput;
  getAllSiteTextDefinitions: SiteTextDefinitionListOutput;
  getAllSiteTextLanguageList: SiteTextLanguageListOutput;
  getAllTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteListOutput;
  getOrigMapContent: GetOrigMapContentOutput;
  getOrigMapWords: GetOrigMapWordsOutput;
  getOrigMapsList: GetOrigMapsListOutput;
  getPhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getPhraseDefinitionsByLanguage: PhraseDefinitionWithVoteListOutput;
  getPhraseDefinitionsByPhraseId: PhraseDefinitionWithVoteListOutput;
  getPhraseToPhraseTrVoteStatus: PhraseToPhraseTranslationVoteStatusOutputRow;
  getPhraseToPhraseTranslationsByFromPhraseDefinitionId: PhraseToPhraseTranslationWithVoteListOutput;
  getPhraseToWordTrVoteStatus: PhraseToWordTranslationVoteStatusOutputRow;
  getPhraseToWordTranslationsByFromPhraseDefinitionId: PhraseToWordTranslationWithVoteListOutput;
  getPhraseVoteStatus: PhraseVoteStatusOutputRow;
  getPhraseWithVoteById: PhraseWithVoteOutput;
  getPhrasesByLanguage: PhraseWithVoteListOutput;
  getRecommendedTranslationFromDefinitionID: TranslationWithVoteOutput;
  getRecommendedTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteOutput;
  getSiteTextTranslationVoteStatus: SiteTextTranslationVoteStatusOutputRow;
  getTranslatedMapContent: GetTranslatedMapContentOutput;
  getTranslationsByFromDefinitionId: TranslationWithVoteListOutput;
  getWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getWordDefinitionsByLanguage: WordDefinitionWithVoteListOutput;
  getWordDefinitionsByWordId: WordDefinitionWithVoteListOutput;
  getWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  getWordToPhraseTranslationsByFromWordDefinitionId: WordToPhraseTranslationWithVoteListOutput;
  getWordToWordTrVoteStatus: WordTrVoteStatusOutputRow;
  getWordToWordTranslationsByFromWordDefinitionId: WordToWordTranslationWithVoteListOutput;
  getWordVoteStatus: WordVoteStatusOutputRow;
  getWordWithVoteById: WordWithVoteOutput;
  getWordsByLanguage: WordWithVoteListOutput;
  loggedInIsAdmin: IsAdminIdOutput;
  phraseDefinitionRead: PhraseDefinitionReadOutput;
  phraseRead: PhraseReadOutput;
  phraseToPhraseTranslationRead: PhraseToPhraseTranslationReadOutput;
  phraseVoteRead: PhraseVoteOutput;
  postReadResolver: PostReadOutput;
  siteTextPhraseDefinitionRead: SiteTextPhraseDefinitionOutput;
  siteTextTranslationVoteRead: SiteTextTranslationVoteOutput;
  siteTextWordDefinitionRead: SiteTextWordDefinitionOutput;
  userReadResolver: UserReadOutput;
  wordDefinitionRead: WordDefinitionReadOutput;
  wordRead: WordReadOutput;
  wordToPhraseTranslationRead: WordToPhraseTranslationReadOutput;
  wordToWordTranslationRead: WordToWordTranslationReadOutput;
  wordVoteRead: WordVoteOutput;
};


export type QueryFileUploadUrlRequestArgs = {
  input: FileUploadUrlRequest;
};


export type QueryGetAllMapsListArgs = {
  input: GetAllMapsListInput;
};


export type QueryGetAllRecommendedSiteTextTranslationListByLanguageArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
};


export type QueryGetAllSiteTextDefinitionsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
};


export type QueryGetOrigMapContentArgs = {
  input: GetOrigMapContentInput;
};


export type QueryGetOrigMapWordsArgs = {
  input?: InputMaybe<GetOrigMapWordsInput>;
};


export type QueryGetOrigMapsListArgs = {
  input: GetOrigMapListInput;
};


export type QueryGetPhraseDefinitionVoteStatusArgs = {
  phrase_definition_id: Scalars['ID']['input'];
};


export type QueryGetPhraseDefinitionsByLanguageArgs = {
  input: LanguageInput;
};


export type QueryGetPhraseDefinitionsByPhraseIdArgs = {
  phrase_id: Scalars['ID']['input'];
};


export type QueryGetPhraseToPhraseTrVoteStatusArgs = {
  phrase_to_phrase_translation_id: Scalars['ID']['input'];
};


export type QueryGetPhraseToPhraseTranslationsByFromPhraseDefinitionIdArgs = {
  from_phrase_definition_id: Scalars['ID']['input'];
  langInfo: LanguageInput;
};


export type QueryGetPhraseToWordTrVoteStatusArgs = {
  phrase_to_word_translation_id: Scalars['ID']['input'];
};


export type QueryGetPhraseToWordTranslationsByFromPhraseDefinitionIdArgs = {
  from_phrase_definition_id: Scalars['ID']['input'];
  langInfo: LanguageInput;
};


export type QueryGetPhraseVoteStatusArgs = {
  phrase_id: Scalars['ID']['input'];
};


export type QueryGetPhraseWithVoteByIdArgs = {
  phrase_id: Scalars['ID']['input'];
};


export type QueryGetPhrasesByLanguageArgs = {
  input: LanguageInput;
};


export type QueryGetRecommendedTranslationFromDefinitionIdArgs = {
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  langInfo: LanguageInput;
};


export type QueryGetRecommendedTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
};


export type QueryGetSiteTextTranslationVoteStatusArgs = {
  from_type_is_word: Scalars['Boolean']['input'];
  to_type_is_word: Scalars['Boolean']['input'];
  translation_id: Scalars['ID']['input'];
};


export type QueryGetTranslatedMapContentArgs = {
  input: GetTranslatedMapContentInput;
};


export type QueryGetTranslationsByFromDefinitionIdArgs = {
  definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  langInfo: LanguageInput;
};


export type QueryGetWordDefinitionVoteStatusArgs = {
  word_definition_id: Scalars['ID']['input'];
};


export type QueryGetWordDefinitionsByLanguageArgs = {
  input: LanguageInput;
};


export type QueryGetWordDefinitionsByWordIdArgs = {
  word_id: Scalars['ID']['input'];
};


export type QueryGetWordToPhraseTrVoteStatusArgs = {
  word_to_phrase_translation_id: Scalars['ID']['input'];
};


export type QueryGetWordToPhraseTranslationsByFromWordDefinitionIdArgs = {
  from_word_definition_id: Scalars['ID']['input'];
  langInfo: LanguageInput;
};


export type QueryGetWordToWordTrVoteStatusArgs = {
  word_to_word_translation_id: Scalars['ID']['input'];
};


export type QueryGetWordToWordTranslationsByFromWordDefinitionIdArgs = {
  from_word_definition_id: Scalars['ID']['input'];
  langInfo: LanguageInput;
};


export type QueryGetWordVoteStatusArgs = {
  word_id: Scalars['ID']['input'];
};


export type QueryGetWordWithVoteByIdArgs = {
  word_id: Scalars['ID']['input'];
};


export type QueryGetWordsByLanguageArgs = {
  input: LanguageInput;
};


export type QueryLoggedInIsAdminArgs = {
  input: IsAdminIdInput;
};


export type QueryPhraseDefinitionReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPhraseReadArgs = {
  input: PhraseReadInput;
};


export type QueryPhraseToPhraseTranslationReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPhraseVoteReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostReadResolverArgs = {
  input: PostReadInput;
};


export type QuerySiteTextPhraseDefinitionReadArgs = {
  id: Scalars['String']['input'];
};


export type QuerySiteTextTranslationVoteReadArgs = {
  id: Scalars['String']['input'];
};


export type QuerySiteTextWordDefinitionReadArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserReadResolverArgs = {
  input: UserReadInput;
};


export type QueryWordDefinitionReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWordReadArgs = {
  input: WordReadInput;
};


export type QueryWordToPhraseTranslationReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWordToWordTranslationReadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWordVoteReadArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  avatar: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterOutput = {
  __typename?: 'RegisterOutput';
  error: ErrorType;
  session?: Maybe<Session>;
};

export type ResetEmailRequestInput = {
  email: Scalars['String']['input'];
};

export type ResetEmailRequestOutput = {
  __typename?: 'ResetEmailRequestOutput';
  error: ErrorType;
};

export type Session = {
  __typename?: 'Session';
  avatar: Scalars['String']['output'];
  avatar_url?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  user_id: Scalars['ID']['output'];
};

export type SiteTextDefinition = SiteTextPhraseDefinition | SiteTextWordDefinition;

export type SiteTextDefinitionListOutput = {
  __typename?: 'SiteTextDefinitionListOutput';
  error: ErrorType;
  site_text_definition_list?: Maybe<Array<SiteTextDefinition>>;
};

export type SiteTextDefinitionOutput = {
  __typename?: 'SiteTextDefinitionOutput';
  error: ErrorType;
  site_text_definition?: Maybe<SiteTextDefinition>;
};

export type SiteTextLanguage = {
  __typename?: 'SiteTextLanguage';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
};

export type SiteTextLanguageListOutput = {
  __typename?: 'SiteTextLanguageListOutput';
  error: ErrorType;
  site_text_language_list?: Maybe<Array<SiteTextLanguage>>;
};

export type SiteTextPhraseDefinition = {
  __typename?: 'SiteTextPhraseDefinition';
  phrase_definition: PhraseDefinition;
  site_text_id: Scalars['ID']['output'];
};

export type SiteTextPhraseDefinitionOutput = {
  __typename?: 'SiteTextPhraseDefinitionOutput';
  error: ErrorType;
  site_text_phrase_definition?: Maybe<SiteTextPhraseDefinition>;
};

export type SiteTextPhraseToPhraseTranslationWithVote = {
  __typename?: 'SiteTextPhraseToPhraseTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_phrase_definition: PhraseDefinition;
  phrase_to_phrase_translation_id: Scalars['ID']['output'];
  to_phrase_definition: PhraseDefinition;
  upvotes: Scalars['Int']['output'];
};

export type SiteTextPhraseToWordTranslationWithVote = {
  __typename?: 'SiteTextPhraseToWordTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_phrase_definition: PhraseDefinition;
  phrase_to_word_translation_id: Scalars['ID']['output'];
  to_word_definition: WordDefinition;
  upvotes: Scalars['Int']['output'];
};

export type SiteTextTranslationUpsertInput = {
  definitionlike_string: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  is_word_definition: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['ID']['input'];
  translationlike_string: Scalars['String']['input'];
};

export type SiteTextTranslationVote = {
  __typename?: 'SiteTextTranslationVote';
  from_type_is_word: Scalars['Boolean']['output'];
  last_updated_at: Scalars['DateTime']['output'];
  site_text_translation_vote_id: Scalars['ID']['output'];
  to_type_is_word: Scalars['Boolean']['output'];
  translation_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type SiteTextTranslationVoteOutput = {
  __typename?: 'SiteTextTranslationVoteOutput';
  error: ErrorType;
  site_text_translation_vote?: Maybe<SiteTextTranslationVote>;
};

export type SiteTextTranslationVoteStatus = {
  __typename?: 'SiteTextTranslationVoteStatus';
  downvotes: Scalars['Int']['output'];
  from_type_is_word: Scalars['Boolean']['output'];
  to_type_is_word: Scalars['Boolean']['output'];
  translation_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type SiteTextTranslationVoteStatusOutputRow = {
  __typename?: 'SiteTextTranslationVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<SiteTextTranslationVoteStatus>;
};

export type SiteTextTranslationWithVote = SiteTextPhraseToPhraseTranslationWithVote | SiteTextPhraseToWordTranslationWithVote | SiteTextWordToPhraseTranslationWithVote | SiteTextWordToWordTranslationWithVote;

export type SiteTextTranslationWithVoteListByLanguage = {
  __typename?: 'SiteTextTranslationWithVoteListByLanguage';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  site_text_translation_with_vote_list?: Maybe<Array<SiteTextTranslationWithVote>>;
};

export type SiteTextTranslationWithVoteListByLanguageListOutput = {
  __typename?: 'SiteTextTranslationWithVoteListByLanguageListOutput';
  error: ErrorType;
  site_text_translation_with_vote_list_by_language_list?: Maybe<Array<SiteTextTranslationWithVoteListByLanguage>>;
};

export type SiteTextTranslationWithVoteListByLanguageOutput = {
  __typename?: 'SiteTextTranslationWithVoteListByLanguageOutput';
  error: ErrorType;
  site_text_translation_with_vote_list_by_language: SiteTextTranslationWithVoteListByLanguage;
};

export type SiteTextTranslationWithVoteListOutput = {
  __typename?: 'SiteTextTranslationWithVoteListOutput';
  error: ErrorType;
  site_text_translation_with_vote_list?: Maybe<Array<SiteTextTranslationWithVote>>;
};

export type SiteTextTranslationWithVoteOutput = {
  __typename?: 'SiteTextTranslationWithVoteOutput';
  error: ErrorType;
  site_text_translation_with_vote?: Maybe<SiteTextTranslationWithVote>;
};

export type SiteTextTranslationsFromInput = {
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
};

export type SiteTextTranslationsToInput = {
  definitionlike_string: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  translationlike_string: Scalars['String']['input'];
};

export type SiteTextUpsertInput = {
  definitionlike_string: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  siteTextlike_string: Scalars['String']['input'];
};

export type SiteTextWordDefinition = {
  __typename?: 'SiteTextWordDefinition';
  site_text_id: Scalars['ID']['output'];
  word_definition: WordDefinition;
};

export type SiteTextWordDefinitionOutput = {
  __typename?: 'SiteTextWordDefinitionOutput';
  error: ErrorType;
  site_text_word_definition?: Maybe<SiteTextWordDefinition>;
};

export type SiteTextWordToPhraseTranslationWithVote = {
  __typename?: 'SiteTextWordToPhraseTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_word_definition: WordDefinition;
  to_phrase_definition: PhraseDefinition;
  upvotes: Scalars['Int']['output'];
  word_to_phrase_translation_id: Scalars['ID']['output'];
};

export type SiteTextWordToWordTranslationWithVote = {
  __typename?: 'SiteTextWordToWordTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_word_definition: WordDefinition;
  to_word_definition: WordDefinition;
  upvotes: Scalars['Int']['output'];
  word_to_word_translation_id: Scalars['ID']['output'];
};

export type ToDefinitionInput = {
  definition: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  is_type_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  word_or_phrase: Scalars['String']['input'];
};

export type Translation = PhraseToPhraseTranslation | PhraseToWordTranslation | WordToPhraseTranslation | WordToWordTranslation;

export type TranslationUpsertOutput = {
  __typename?: 'TranslationUpsertOutput';
  error: ErrorType;
  translation?: Maybe<Translation>;
};

export type TranslationVoteStatus = PhraseToPhraseTranslationVoteStatus | PhraseToWordTranslationVoteStatus | WordToPhraseTranslationVoteStatus | WordTrVoteStatus;

export type TranslationVoteStatusOutputRow = {
  __typename?: 'TranslationVoteStatusOutputRow';
  error: ErrorType;
  translation_vote_status?: Maybe<TranslationVoteStatus>;
};

export type TranslationWithVote = PhraseToPhraseTranslationWithVote | PhraseToWordTranslationWithVote | WordToPhraseTranslationWithVote | WordToWordTranslationWithVote;

export type TranslationWithVoteListOutput = {
  __typename?: 'TranslationWithVoteListOutput';
  error: ErrorType;
  translation_with_vote_list?: Maybe<Array<TranslationWithVote>>;
};

export type TranslationWithVoteOutput = {
  __typename?: 'TranslationWithVoteOutput';
  error: ErrorType;
  translation_with_vote?: Maybe<TranslationWithVote>;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  avatar_url?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['ID']['output'];
};

export type UserReadInput = {
  user_id: Scalars['ID']['input'];
};

export type UserReadOutput = {
  __typename?: 'UserReadOutput';
  error: ErrorType;
  user?: Maybe<User>;
};

export type Version = {
  __typename?: 'Version';
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  license_title: Scalars['String']['output'];
  post_id: Scalars['Int']['output'];
  version_id: Scalars['ID']['output'];
};

export type VersionCreateInput = {
  content: Scalars['String']['input'];
  license_title: Scalars['String']['input'];
  post_id: Scalars['Int']['input'];
};

export type VersionCreateOutput = {
  __typename?: 'VersionCreateOutput';
  error: ErrorType;
  version?: Maybe<Version>;
};

export type Word = {
  __typename?: 'Word';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordDefinition = {
  __typename?: 'WordDefinition';
  definition: Scalars['String']['output'];
  word: Word;
  word_definition_id: Scalars['ID']['output'];
};

export type WordDefinitionReadOutput = {
  __typename?: 'WordDefinitionReadOutput';
  error: ErrorType;
  word_definition?: Maybe<WordDefinition>;
};

export type WordDefinitionUpsertInput = {
  definition: Scalars['String']['input'];
  word_id: Scalars['ID']['input'];
};

export type WordDefinitionUpsertOutput = {
  __typename?: 'WordDefinitionUpsertOutput';
  error: ErrorType;
  word_definition?: Maybe<WordDefinition>;
};

export type WordDefinitionVote = {
  __typename?: 'WordDefinitionVote';
  last_updated_at: Scalars['DateTime']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
  word_definition_id: Scalars['ID']['output'];
  word_definitions_vote_id: Scalars['ID']['output'];
};

export type WordDefinitionWithVote = {
  __typename?: 'WordDefinitionWithVote';
  created_at: Scalars['String']['output'];
  definition: Scalars['String']['output'];
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
  word: Word;
  word_definition_id: Scalars['ID']['output'];
};

export type WordDefinitionWithVoteListOutput = {
  __typename?: 'WordDefinitionWithVoteListOutput';
  error: ErrorType;
  word_definition_list: Array<Maybe<WordDefinitionWithVote>>;
};

export type WordReadInput = {
  word_id: Scalars['ID']['input'];
};

export type WordReadOutput = {
  __typename?: 'WordReadOutput';
  error: ErrorType;
  word?: Maybe<Word>;
};

export type WordToPhraseTranslation = {
  __typename?: 'WordToPhraseTranslation';
  from_word_definition: WordDefinition;
  to_phrase_definition: PhraseDefinition;
  word_to_phrase_translation_id: Scalars['ID']['output'];
};

export type WordToPhraseTranslationReadOutput = {
  __typename?: 'WordToPhraseTranslationReadOutput';
  error: ErrorType;
  word_to_phrase_translation?: Maybe<WordToPhraseTranslation>;
};

export type WordToPhraseTranslationUpsertInput = {
  from_word_definition_id: Scalars['ID']['input'];
  to_phrase_definition_id: Scalars['ID']['input'];
};

export type WordToPhraseTranslationUpsertOutput = {
  __typename?: 'WordToPhraseTranslationUpsertOutput';
  error: ErrorType;
  word_to_phrase_translation?: Maybe<WordToPhraseTranslation>;
};

export type WordToPhraseTranslationVoteStatus = {
  __typename?: 'WordToPhraseTranslationVoteStatus';
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
  word_to_phrase_translation_id: Scalars['ID']['output'];
};

export type WordToPhraseTranslationVoteStatusOutputRow = {
  __typename?: 'WordToPhraseTranslationVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<WordToPhraseTranslationVoteStatus>;
};

export type WordToPhraseTranslationWithVote = {
  __typename?: 'WordToPhraseTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_word_definition: WordDefinition;
  to_phrase_definition: PhraseDefinition;
  upvotes: Scalars['Int']['output'];
  word_to_phrase_translation_id: Scalars['ID']['output'];
};

export type WordToPhraseTranslationWithVoteListOutput = {
  __typename?: 'WordToPhraseTranslationWithVoteListOutput';
  error: ErrorType;
  word_to_phrase_tr_with_vote_list?: Maybe<Array<WordToPhraseTranslationWithVote>>;
};

export type WordToWordTranslation = {
  __typename?: 'WordToWordTranslation';
  from_word_definition: WordDefinition;
  to_word_definition: WordDefinition;
  word_to_word_translation_id: Scalars['ID']['output'];
};

export type WordToWordTranslationReadOutput = {
  __typename?: 'WordToWordTranslationReadOutput';
  error: ErrorType;
  word_to_word_translation?: Maybe<WordToWordTranslation>;
};

export type WordToWordTranslationUpsertInput = {
  from_word_definition_id: Scalars['ID']['input'];
  to_word_definition_id: Scalars['ID']['input'];
};

export type WordToWordTranslationUpsertOutput = {
  __typename?: 'WordToWordTranslationUpsertOutput';
  error: ErrorType;
  word_to_word_translation?: Maybe<WordToWordTranslation>;
};

export type WordToWordTranslationWithVote = {
  __typename?: 'WordToWordTranslationWithVote';
  downvotes: Scalars['Int']['output'];
  from_word_definition: WordDefinition;
  to_word_definition: WordDefinition;
  upvotes: Scalars['Int']['output'];
  word_to_word_translation_id: Scalars['ID']['output'];
};

export type WordToWordTranslationWithVoteListOutput = {
  __typename?: 'WordToWordTranslationWithVoteListOutput';
  error: ErrorType;
  word_to_word_tr_with_vote_list?: Maybe<Array<WordToWordTranslationWithVote>>;
};

export type WordTrVoteStatus = {
  __typename?: 'WordTrVoteStatus';
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
  word_to_word_translation_id: Scalars['String']['output'];
};

export type WordTrVoteStatusInput = {
  vote: Scalars['Boolean']['input'];
  word_to_word_translation_id: Scalars['ID']['input'];
};

export type WordTrVoteStatusOutputRow = {
  __typename?: 'WordTrVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<WordTrVoteStatus>;
};

export type WordTranslations = {
  __typename?: 'WordTranslations';
  definition?: Maybe<Scalars['String']['output']>;
  definition_id?: Maybe<Scalars['String']['output']>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  translations?: Maybe<Array<WordWithVotes>>;
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordUpsertInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  wordlike_string: Scalars['String']['input'];
};

export type WordUpsertOutput = {
  __typename?: 'WordUpsertOutput';
  error: ErrorType;
  word?: Maybe<Word>;
};

export type WordVote = {
  __typename?: 'WordVote';
  last_updated_at: Scalars['DateTime']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
  word_id: Scalars['ID']['output'];
  words_vote_id: Scalars['ID']['output'];
};

export type WordVoteOutput = {
  __typename?: 'WordVoteOutput';
  error: ErrorType;
  word_vote?: Maybe<WordVote>;
};

export type WordVoteStatus = {
  __typename?: 'WordVoteStatus';
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordVoteStatusOutputRow = {
  __typename?: 'WordVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<WordVoteStatus>;
};

export type WordVoteUpsertInput = {
  vote: Scalars['Boolean']['input'];
  word_id: Scalars['ID']['input'];
};

export type WordWithDefinitions = {
  __typename?: 'WordWithDefinitions';
  definitions: Array<Maybe<WordDefinition>>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  upvotes: Scalars['Int']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordWithVote = {
  __typename?: 'WordWithVote';
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  upvotes: Scalars['Int']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordWithVoteListOutput = {
  __typename?: 'WordWithVoteListOutput';
  error: ErrorType;
  word_with_vote_list: Array<Maybe<WordWithDefinitions>>;
};

export type WordWithVoteOutput = {
  __typename?: 'WordWithVoteOutput';
  error: ErrorType;
  word_with_vote?: Maybe<WordWithVote>;
};

export type WordWithVotes = {
  __typename?: 'WordWithVotes';
  definition?: Maybe<Scalars['String']['output']>;
  definition_id?: Maybe<Scalars['String']['output']>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  down_votes: Scalars['String']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  translation_id: Scalars['String']['output'];
  up_votes: Scalars['String']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type SessionFieldsFragment = { __typename?: 'Session', user_id: string, token: string, avatar: string, avatar_url?: string | null };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  avatar: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'RegisterOutput', error: ErrorType, session?: { __typename?: 'Session', user_id: string, token: string, avatar: string, avatar_url?: string | null } | null } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', error: ErrorType, session?: { __typename?: 'Session', user_id: string, token: string, avatar: string, avatar_url?: string | null } | null } };

export type LogoutMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutOutput', error: ErrorType } };

export type ResetEmailRequestMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResetEmailRequestMutation = { __typename?: 'Mutation', resetEmailRequest: { __typename?: 'ResetEmailRequestOutput', error: ErrorType } };

export type PasswordResetFormRequestMutationVariables = Exact<{
  token: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type PasswordResetFormRequestMutation = { __typename?: 'Mutation', passwordResetFormResolver: { __typename?: 'LoginOutput', error: ErrorType, session?: { __typename?: 'Session', user_id: string, token: string, avatar: string, avatar_url?: string | null } | null } };

export type WordFragmentFragment = { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type WordDefinitionFragmentFragment = { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type WordWithDefinitionsFragmentFragment = { __typename?: 'WordWithDefinitions', word_id: string, word: string, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> };

export type WordDefinitionWithVoteFragmentFragment = { __typename?: 'WordDefinitionWithVote', word_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type WordWithVoteFragmentFragment = { __typename?: 'WordWithVote', dialect_code?: string | null, downvotes: number, geo_code?: string | null, language_code: string, upvotes: number, word: string, word_id: string };

export type DefinitionVoteStatusFragmentFragment = { __typename?: 'DefinitionVoteStatus', definition_id: string, downvotes: number, upvotes: number };

export type WordVoteStatusFragmentFragment = { __typename?: 'WordVoteStatus', word_id: string, downvotes: number, upvotes: number };

export type WordDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WordDefinitionReadQuery = { __typename?: 'Query', wordDefinitionRead: { __typename?: 'WordDefinitionReadOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type GetWordsByLanguageQueryVariables = Exact<{
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWordsByLanguageQuery = { __typename?: 'Query', getWordsByLanguage: { __typename?: 'WordWithVoteListOutput', error: ErrorType, word_with_vote_list: Array<{ __typename?: 'WordWithDefinitions', word_id: string, word: string, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } | null> } };

export type GetWordDefinitionsByWordIdQueryVariables = Exact<{
  word_id: Scalars['ID']['input'];
}>;


export type GetWordDefinitionsByWordIdQuery = { __typename?: 'Query', getWordDefinitionsByWordId: { __typename?: 'WordDefinitionWithVoteListOutput', error: ErrorType, word_definition_list: Array<{ __typename?: 'WordDefinitionWithVote', word_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } };

export type GetWordWithVoteByIdQueryVariables = Exact<{
  word_id: Scalars['ID']['input'];
}>;


export type GetWordWithVoteByIdQuery = { __typename?: 'Query', getWordWithVoteById: { __typename?: 'WordWithVoteOutput', error: ErrorType, word_with_vote?: { __typename?: 'WordWithVote', dialect_code?: string | null, downvotes: number, geo_code?: string | null, language_code: string, upvotes: number, word: string, word_id: string } | null } };

export type WordDefinitionUpsertMutationVariables = Exact<{
  word_id: Scalars['ID']['input'];
  definition: Scalars['String']['input'];
}>;


export type WordDefinitionUpsertMutation = { __typename?: 'Mutation', wordDefinitionUpsert: { __typename?: 'WordDefinitionUpsertOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type ToggleWordDefinitionVoteStatusMutationVariables = Exact<{
  word_definition_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleWordDefinitionVoteStatusMutation = { __typename?: 'Mutation', toggleWordDefinitionVoteStatus: { __typename?: 'DefinitionVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'DefinitionVoteStatus', definition_id: string, downvotes: number, upvotes: number } | null } };

export type ToggleWordVoteStatusMutationVariables = Exact<{
  word_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleWordVoteStatusMutation = { __typename?: 'Mutation', toggleWordVoteStatus: { __typename?: 'WordVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'WordVoteStatus', word_id: string, downvotes: number, upvotes: number } | null } };

export type WordUpsertMutationVariables = Exact<{
  wordlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type WordUpsertMutation = { __typename?: 'Mutation', wordUpsert: { __typename?: 'WordUpsertOutput', error: ErrorType, word?: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type EmailResponseMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type EmailResponseMutation = { __typename?: 'Mutation', emailResponseResolver: { __typename?: 'EmailResponseOutput', error: ErrorType } };

export type GetOrigMapWordsQueryVariables = Exact<{
  original_map_id?: InputMaybe<Scalars['ID']['input']>;
  o_language_code?: InputMaybe<Scalars['String']['input']>;
  t_language_code?: InputMaybe<Scalars['String']['input']>;
  t_dialect_code?: InputMaybe<Scalars['String']['input']>;
  t_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrigMapWordsQuery = { __typename?: 'Query', getOrigMapWords: { __typename?: 'GetOrigMapWordsOutput', origMapWords: Array<{ __typename?: 'WordTranslations', word: string, word_id: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, translations?: Array<{ __typename?: 'WordWithVotes', word: string, word_id: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, up_votes: string, down_votes: string, translation_id: string }> | null }> } };

export type GetAllMapsListQueryVariables = Exact<{
  lang?: InputMaybe<LanguageInput>;
}>;


export type GetAllMapsListQuery = { __typename?: 'Query', getAllMapsList: { __typename?: 'GetAllMapsListOutput', allMapsList: Array<{ __typename?: 'MapFileOutput', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, created_at: string, created_by: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } }> } };

export type GetTranslatedMapContentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTranslatedMapContentQuery = { __typename?: 'Query', getTranslatedMapContent: { __typename?: 'GetTranslatedMapContentOutput', translated_map_id?: string | null, map_file_name: string, created_at: string, created_by: string, content: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type IsAdminLoggedInQueryVariables = Exact<{
  input: IsAdminIdInput;
}>;


export type IsAdminLoggedInQuery = { __typename?: 'Query', loggedInIsAdmin: { __typename?: 'IsAdminIdOutput', isAdmin: boolean } };

export type GetOrigMapContentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrigMapContentQuery = { __typename?: 'Query', getOrigMapContent: { __typename?: 'GetOrigMapContentOutput', original_map_id: string, map_file_name: string, created_at: string, created_by: string, content: string } };

export type MapUploadMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type MapUploadMutation = { __typename?: 'Mutation', mapUpload: { __typename?: 'MapFileOutput', original_map_id: string, map_file_name: string } };

export type PhraseFragmentFragment = { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type PhraseDefinitionFragmentFragment = { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type PhraseWithDefinitionsFragmentFragment = { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> };

export type PhraseDefinitionWithVoteFragmentFragment = { __typename?: 'PhraseDefinitionWithVote', phrase_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type PhraseWithVoteFragmentFragment = { __typename?: 'PhraseWithVote', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number };

export type PhraseVoteStatusFragmentFragment = { __typename?: 'PhraseVoteStatus', downvotes: number, phrase_id: string, upvotes: number };

export type PhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PhraseDefinitionReadQuery = { __typename?: 'Query', phraseDefinitionRead: { __typename?: 'PhraseDefinitionReadOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type GetPhrasesByLanguageQueryVariables = Exact<{
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPhrasesByLanguageQuery = { __typename?: 'Query', getPhrasesByLanguage: { __typename?: 'PhraseWithVoteListOutput', error: ErrorType, phrase_with_vote_list: Array<{ __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } | null> } };

export type GetPhraseDefinitionsByPhraseIdQueryVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
}>;


export type GetPhraseDefinitionsByPhraseIdQuery = { __typename?: 'Query', getPhraseDefinitionsByPhraseId: { __typename?: 'PhraseDefinitionWithVoteListOutput', error: ErrorType, phrase_definition_list: Array<{ __typename?: 'PhraseDefinitionWithVote', phrase_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } };

export type GetPhraseWithVoteByIdQueryVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
}>;


export type GetPhraseWithVoteByIdQuery = { __typename?: 'Query', getPhraseWithVoteById: { __typename?: 'PhraseWithVoteOutput', error: ErrorType, phrase_with_vote?: { __typename?: 'PhraseWithVote', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number } | null } };

export type PhraseDefinitionUpsertMutationVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
  definition: Scalars['String']['input'];
}>;


export type PhraseDefinitionUpsertMutation = { __typename?: 'Mutation', phraseDefinitionUpsert: { __typename?: 'PhraseDefinitionUpsertOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type TogglePhraseDefinitionVoteStatusMutationVariables = Exact<{
  phrase_definition_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type TogglePhraseDefinitionVoteStatusMutation = { __typename?: 'Mutation', togglePhraseDefinitionVoteStatus: { __typename?: 'DefinitionVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'DefinitionVoteStatus', definition_id: string, downvotes: number, upvotes: number } | null } };

export type TogglePhraseVoteStatusMutationVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type TogglePhraseVoteStatusMutation = { __typename?: 'Mutation', togglePhraseVoteStatus: { __typename?: 'PhraseVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'PhraseVoteStatus', downvotes: number, phrase_id: string, upvotes: number } | null } };

export type PhraseUpsertMutationVariables = Exact<{
  phraselike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type PhraseUpsertMutation = { __typename?: 'Mutation', phraseUpsert: { __typename?: 'PhraseUpsertOutput', error: ErrorType, phrase?: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type VersionFieldsFragment = { __typename?: 'Version', version_id: string, post_id: number, created_at: string, license_title: string, content: string };

export type PostFieldsFragment = { __typename?: 'Post', post_id: string, created_at: string, created_by: number };

export type PostCreateMutationVariables = Exact<{
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PostCreateMutation = { __typename?: 'Mutation', postCreateResolver: { __typename?: 'PostCreateOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, created_at: string, created_by: number } | null } };

export type VersionCreateMutationVariables = Exact<{
  postId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
  license_title: Scalars['String']['input'];
}>;


export type VersionCreateMutation = { __typename?: 'Mutation', versionCreateResolver: { __typename?: 'VersionCreateOutput', error: ErrorType, version?: { __typename?: 'Version', version_id: string, post_id: number, created_at: string, license_title: string, content: string } | null } };

export type PostReadQueryVariables = Exact<{
  postId: Scalars['ID']['input'];
}>;


export type PostReadQuery = { __typename?: 'Query', postReadResolver: { __typename?: 'PostReadOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, created_at: string, created_by: number } | null } };

export type SiteTextWordToWordTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextWordToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseToWordTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseDefinitionFragmentFragment = { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextWordDefinitionFragmentFragment = { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextTranslationVoteStatusFragmentFragment = { __typename?: 'SiteTextTranslationVoteStatus', translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, downvotes: number, upvotes: number };

export type SiteTextLanguageFragmentFragment = { __typename?: 'SiteTextLanguage', language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type SiteTextTranslationWithVoteListByLanguageFragmentFragment = { __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list?: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null };

export type GetAllSiteTextDefinitionsQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllSiteTextDefinitionsQuery = { __typename?: 'Query', getAllSiteTextDefinitions: { __typename?: 'SiteTextDefinitionListOutput', error: ErrorType, site_text_definition_list?: Array<{ __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null } };

export type GetAllTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getAllTranslationFromSiteTextDefinitionID: { __typename?: 'SiteTextTranslationWithVoteListOutput', error: ErrorType, site_text_translation_with_vote_list?: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null } };

export type SiteTextWordDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextWordDefinitionReadQuery = { __typename?: 'Query', siteTextWordDefinitionRead: { __typename?: 'SiteTextWordDefinitionOutput', error: ErrorType, site_text_word_definition?: { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type SiteTextPhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextPhraseDefinitionReadQuery = { __typename?: 'Query', siteTextPhraseDefinitionRead: { __typename?: 'SiteTextPhraseDefinitionOutput', error: ErrorType, site_text_phrase_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type UpsertSiteTextTranslationMutationVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
  translationlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertSiteTextTranslationMutation = { __typename?: 'Mutation', upsertSiteTextTranslation: { __typename?: 'TranslationUpsertOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type ToggleSiteTextTranslationVoteStatusMutationVariables = Exact<{
  translation_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  to_type_is_word: Scalars['Boolean']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleSiteTextTranslationVoteStatusMutation = { __typename?: 'Mutation', toggleSiteTextTranslationVoteStatus: { __typename?: 'SiteTextTranslationVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'SiteTextTranslationVoteStatus', translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, downvotes: number, upvotes: number } | null } };

export type GetAllSiteTextLanguageListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSiteTextLanguageListQuery = { __typename?: 'Query', getAllSiteTextLanguageList: { __typename?: 'SiteTextLanguageListOutput', error: ErrorType, site_text_language_list?: Array<{ __typename?: 'SiteTextLanguage', language_code: string, dialect_code?: string | null, geo_code?: string | null }> | null } };

export type GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromSiteTextDefinitionID: { __typename?: 'SiteTextTranslationWithVoteOutput', error: ErrorType, site_text_translation_with_vote?: { __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables = Exact<{
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllRecommendedSiteTextTranslationListByLanguageQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationListByLanguage: { __typename?: 'SiteTextTranslationWithVoteListByLanguageOutput', error: ErrorType, site_text_translation_with_vote_list_by_language: { __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list?: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null } } };

export type GetAllRecommendedSiteTextTranslationListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRecommendedSiteTextTranslationListQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationList: { __typename?: 'SiteTextTranslationWithVoteListByLanguageListOutput', error: ErrorType, site_text_translation_with_vote_list_by_language_list?: Array<{ __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list?: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null }> | null } };

export type SiteTextUpsertMutationVariables = Exact<{
  siteTextlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type SiteTextUpsertMutation = { __typename?: 'Mutation', siteTextUpsert: { __typename?: 'SiteTextDefinitionOutput', error: ErrorType, site_text_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type WordToWordTranslationWithVoteFragmentFragment = { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToWordTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToWordTranslationFragmentFragment = { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToPhraseTranslationFragmentFragment = { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToWordTranslationFragmentFragment = { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToPhraseTranslationFragmentFragment = { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordTrVoteStatusFragmentFragment = { __typename?: 'WordTrVoteStatus', word_to_word_translation_id: string, upvotes: number, downvotes: number };

export type WordToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'WordToPhraseTranslationVoteStatus', word_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToWordTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToWordTranslationVoteStatus', phrase_to_word_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToPhraseTranslationVoteStatus', phrase_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type GetTranslationsByFromDefinitionIdQueryVariables = Exact<{
  definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTranslationsByFromDefinitionIdQuery = { __typename?: 'Query', getTranslationsByFromDefinitionId: { __typename?: 'TranslationWithVoteListOutput', error: ErrorType, translation_with_vote_list?: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }> | null } };

export type GetRecommendedTranslationFromDefinitionIdQueryVariables = Exact<{
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromDefinitionID: { __typename?: 'TranslationWithVoteOutput', error: ErrorType, translation_with_vote?: { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type ToggleTranslationVoteStatusMutationVariables = Exact<{
  translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  to_definition_type_is_word: Scalars['Boolean']['input'];
}>;


export type ToggleTranslationVoteStatusMutation = { __typename?: 'Mutation', toggleTranslationVoteStatus: { __typename?: 'TranslationVoteStatusOutputRow', error: ErrorType, translation_vote_status?: { __typename?: 'PhraseToPhraseTranslationVoteStatus', phrase_to_phrase_translation_id: string, upvotes: number, downvotes: number } | { __typename?: 'PhraseToWordTranslationVoteStatus', phrase_to_word_translation_id: string, upvotes: number, downvotes: number } | { __typename?: 'WordToPhraseTranslationVoteStatus', word_to_phrase_translation_id: string, upvotes: number, downvotes: number } | { __typename?: 'WordTrVoteStatus', word_to_word_translation_id: string, upvotes: number, downvotes: number } | null } };

export type UpsertTranslationMutationVariables = Exact<{
  from_definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  to_definition_id: Scalars['ID']['input'];
  to_definition_type_is_word: Scalars['Boolean']['input'];
}>;


export type UpsertTranslationMutation = { __typename?: 'Mutation', upsertTranslation: { __typename?: 'TranslationUpsertOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type UpsertTranslationFromWordAndDefinitionlikeStringMutationVariables = Exact<{
  from_definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  word_or_phrase: Scalars['String']['input'];
  definition: Scalars['String']['input'];
  is_type_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertTranslationFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertTranslationFromWordAndDefinitionlikeString: { __typename?: 'TranslationUpsertOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables = Exact<{
  wordlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertWordDefinitionFromWordAndDefinitionlikeString: { __typename?: 'WordDefinitionUpsertOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables = Exact<{
  phraselike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: { __typename?: 'PhraseDefinitionUpsertOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type UserReadQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type UserReadQuery = { __typename?: 'Query', userReadResolver: { __typename?: 'UserReadOutput', error: ErrorType, user?: { __typename?: 'User', avatar: string, avatar_url?: string | null, user_id: string } | null } };

export type AvatarUpdateMutationVariables = Exact<{
  avatar: Scalars['String']['input'];
}>;


export type AvatarUpdateMutation = { __typename?: 'Mutation', avatarUpdateResolver: { __typename?: 'AvatarUpdateOutput', error: ErrorType, user?: { __typename?: 'User', avatar: string, avatar_url?: string | null, user_id: string } | null } };

export type GetFileUploadUrlQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetFileUploadUrlQuery = { __typename?: 'Query', fileUploadUrlRequest: { __typename?: 'FileUploadUrlResponse', error: ErrorType, url: string, avatar_image_url: string } };

export type ToggleWordTranslationVoteStatusMutationVariables = Exact<{
  word_to_word_translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleWordTranslationVoteStatusMutation = { __typename?: 'Mutation', toggleWordTrVoteStatus: { __typename?: 'WordTrVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'WordTrVoteStatus', upvotes: number, downvotes: number, word_to_word_translation_id: string } | null } };

export type AddWordAsTranslationForWordMutationVariables = Exact<{
  originalDefinitionId: Scalars['String']['input'];
  translationDefinition: Scalars['String']['input'];
  translationWord: WordUpsertInput;
}>;


export type AddWordAsTranslationForWordMutation = { __typename?: 'Mutation', addWordAsTranslationForWord: { __typename?: 'AddWordAsTranslationForWordOutput', wordTranslationId: string, error: ErrorType } };

export const SessionFieldsFragmentDoc = gql`
    fragment SessionFields on Session {
  user_id
  token
  avatar
  avatar_url
}
    `;
export const WordFragmentFragmentDoc = gql`
    fragment WordFragment on Word {
  word_id
  word
  language_code
  dialect_code
  geo_code
}
    `;
export const WordDefinitionFragmentFragmentDoc = gql`
    fragment WordDefinitionFragment on WordDefinition {
  word_definition_id
  word {
    ...WordFragment
  }
  definition
}
    ${WordFragmentFragmentDoc}`;
export const WordWithDefinitionsFragmentFragmentDoc = gql`
    fragment WordWithDefinitionsFragment on WordWithDefinitions {
  word_id
  word
  definitions {
    ...WordDefinitionFragment
  }
  downvotes
  upvotes
  language_code
  dialect_code
  geo_code
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const WordDefinitionWithVoteFragmentFragmentDoc = gql`
    fragment WordDefinitionWithVoteFragment on WordDefinitionWithVote {
  word_definition_id
  word {
    ...WordFragment
  }
  definition
  downvotes
  upvotes
  created_at
}
    ${WordFragmentFragmentDoc}`;
export const WordWithVoteFragmentFragmentDoc = gql`
    fragment WordWithVoteFragment on WordWithVote {
  dialect_code
  downvotes
  geo_code
  language_code
  upvotes
  word
  word_id
}
    `;
export const DefinitionVoteStatusFragmentFragmentDoc = gql`
    fragment DefinitionVoteStatusFragment on DefinitionVoteStatus {
  definition_id
  downvotes
  upvotes
}
    `;
export const WordVoteStatusFragmentFragmentDoc = gql`
    fragment WordVoteStatusFragment on WordVoteStatus {
  word_id
  downvotes
  upvotes
}
    `;
export const PhraseFragmentFragmentDoc = gql`
    fragment PhraseFragment on Phrase {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
}
    `;
export const PhraseDefinitionFragmentFragmentDoc = gql`
    fragment PhraseDefinitionFragment on PhraseDefinition {
  phrase_definition_id
  definition
  phrase {
    ...PhraseFragment
  }
}
    ${PhraseFragmentFragmentDoc}`;
export const PhraseWithDefinitionsFragmentFragmentDoc = gql`
    fragment PhraseWithDefinitionsFragment on PhraseWithDefinitions {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  definitions {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const PhraseDefinitionWithVoteFragmentFragmentDoc = gql`
    fragment PhraseDefinitionWithVoteFragment on PhraseDefinitionWithVote {
  phrase_definition_id
  phrase {
    ...PhraseFragment
  }
  definition
  downvotes
  upvotes
  created_at
}
    ${PhraseFragmentFragmentDoc}`;
export const PhraseWithVoteFragmentFragmentDoc = gql`
    fragment PhraseWithVoteFragment on PhraseWithVote {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  downvotes
  upvotes
}
    `;
export const PhraseVoteStatusFragmentFragmentDoc = gql`
    fragment PhraseVoteStatusFragment on PhraseVoteStatus {
  downvotes
  phrase_id
  upvotes
}
    `;
export const VersionFieldsFragmentDoc = gql`
    fragment VersionFields on Version {
  version_id
  post_id
  created_at
  license_title
  content
}
    `;
export const PostFieldsFragmentDoc = gql`
    fragment PostFields on Post {
  post_id
  created_at
  created_by
}
    `;
export const SiteTextPhraseDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextPhraseDefinitionFragment on SiteTextPhraseDefinition {
  site_text_id
  phrase_definition {
    ...PhraseDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextWordDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextWordDefinitionFragment on SiteTextWordDefinition {
  site_text_id
  word_definition {
    ...WordDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const SiteTextTranslationVoteStatusFragmentFragmentDoc = gql`
    fragment SiteTextTranslationVoteStatusFragment on SiteTextTranslationVoteStatus {
  translation_id
  from_type_is_word
  to_type_is_word
  downvotes
  upvotes
}
    `;
export const SiteTextLanguageFragmentFragmentDoc = gql`
    fragment SiteTextLanguageFragment on SiteTextLanguage {
  language_code
  dialect_code
  geo_code
}
    `;
export const SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc = gql`
    fragment SiteTextWordToWordTranslationWithVoteFragment on SiteTextWordToWordTranslationWithVote {
  word_to_word_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
  downvotes
  upvotes
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc = gql`
    fragment SiteTextWordToPhraseTranslationWithVoteFragment on SiteTextWordToPhraseTranslationWithVote {
  word_to_phrase_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${WordDefinitionFragmentFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc = gql`
    fragment SiteTextPhraseToWordTranslationWithVoteFragment on SiteTextPhraseToWordTranslationWithVote {
  phrase_to_word_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
  downvotes
  upvotes
}
    ${PhraseDefinitionFragmentFragmentDoc}
${WordDefinitionFragmentFragmentDoc}`;
export const SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc = gql`
    fragment SiteTextPhraseToPhraseTranslationWithVoteFragment on SiteTextPhraseToPhraseTranslationWithVote {
  phrase_to_phrase_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextTranslationWithVoteListByLanguageFragmentFragmentDoc = gql`
    fragment SiteTextTranslationWithVoteListByLanguageFragment on SiteTextTranslationWithVoteListByLanguage {
  dialect_code
  geo_code
  language_code
  site_text_translation_with_vote_list {
    ...SiteTextWordToWordTranslationWithVoteFragment
    ...SiteTextWordToPhraseTranslationWithVoteFragment
    ...SiteTextPhraseToWordTranslationWithVoteFragment
    ...SiteTextPhraseToPhraseTranslationWithVoteFragment
  }
}
    ${SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;
export const WordToWordTranslationWithVoteFragmentFragmentDoc = gql`
    fragment WordToWordTranslationWithVoteFragment on WordToWordTranslationWithVote {
  word_to_word_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
  downvotes
  upvotes
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const WordToPhraseTranslationWithVoteFragmentFragmentDoc = gql`
    fragment WordToPhraseTranslationWithVoteFragment on WordToPhraseTranslationWithVote {
  word_to_phrase_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${WordDefinitionFragmentFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const PhraseToWordTranslationWithVoteFragmentFragmentDoc = gql`
    fragment PhraseToWordTranslationWithVoteFragment on PhraseToWordTranslationWithVote {
  phrase_to_word_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
  downvotes
  upvotes
}
    ${PhraseDefinitionFragmentFragmentDoc}
${WordDefinitionFragmentFragmentDoc}`;
export const PhraseToPhraseTranslationWithVoteFragmentFragmentDoc = gql`
    fragment PhraseToPhraseTranslationWithVoteFragment on PhraseToPhraseTranslationWithVote {
  phrase_to_phrase_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const WordToWordTranslationFragmentFragmentDoc = gql`
    fragment WordToWordTranslationFragment on WordToWordTranslation {
  word_to_word_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const WordToPhraseTranslationFragmentFragmentDoc = gql`
    fragment WordToPhraseTranslationFragment on WordToPhraseTranslation {
  word_to_phrase_translation_id
  from_word_definition {
    ...WordDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const PhraseToWordTranslationFragmentFragmentDoc = gql`
    fragment PhraseToWordTranslationFragment on PhraseToWordTranslation {
  phrase_to_word_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_word_definition {
    ...WordDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}
${WordDefinitionFragmentFragmentDoc}`;
export const PhraseToPhraseTranslationFragmentFragmentDoc = gql`
    fragment PhraseToPhraseTranslationFragment on PhraseToPhraseTranslation {
  phrase_to_phrase_translation_id
  from_phrase_definition {
    ...PhraseDefinitionFragment
  }
  to_phrase_definition {
    ...PhraseDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const WordTrVoteStatusFragmentFragmentDoc = gql`
    fragment WordTrVoteStatusFragment on WordTrVoteStatus {
  word_to_word_translation_id
  upvotes
  downvotes
}
    `;
export const WordToPhraseTranslationVoteStatusFragmentFragmentDoc = gql`
    fragment WordToPhraseTranslationVoteStatusFragment on WordToPhraseTranslationVoteStatus {
  word_to_phrase_translation_id
  upvotes
  downvotes
}
    `;
export const PhraseToWordTranslationVoteStatusFragmentFragmentDoc = gql`
    fragment PhraseToWordTranslationVoteStatusFragment on PhraseToWordTranslationVoteStatus {
  phrase_to_word_translation_id
  upvotes
  downvotes
}
    `;
export const PhraseToPhraseTranslationVoteStatusFragmentFragmentDoc = gql`
    fragment PhraseToPhraseTranslationVoteStatusFragment on PhraseToPhraseTranslationVoteStatus {
  phrase_to_phrase_translation_id
  upvotes
  downvotes
}
    `;
export const RegisterDocument = gql`
    mutation Register($email: String!, $avatar: String!, $password: String!) {
  register(input: {email: $email, avatar: $avatar, password: $password}) {
    error
    session {
      ...SessionFields
    }
  }
}
    ${SessionFieldsFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      avatar: // value for 'avatar'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    error
    session {
      ...SessionFields
    }
  }
}
    ${SessionFieldsFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout($token: String!) {
  logout(input: {token: $token}) {
    error
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ResetEmailRequestDocument = gql`
    mutation ResetEmailRequest($email: String!) {
  resetEmailRequest(input: {email: $email}) {
    error
  }
}
    `;
export type ResetEmailRequestMutationFn = Apollo.MutationFunction<ResetEmailRequestMutation, ResetEmailRequestMutationVariables>;

/**
 * __useResetEmailRequestMutation__
 *
 * To run a mutation, you first call `useResetEmailRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetEmailRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetEmailRequestMutation, { data, loading, error }] = useResetEmailRequestMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResetEmailRequestMutation(baseOptions?: Apollo.MutationHookOptions<ResetEmailRequestMutation, ResetEmailRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetEmailRequestMutation, ResetEmailRequestMutationVariables>(ResetEmailRequestDocument, options);
      }
export type ResetEmailRequestMutationHookResult = ReturnType<typeof useResetEmailRequestMutation>;
export type ResetEmailRequestMutationResult = Apollo.MutationResult<ResetEmailRequestMutation>;
export type ResetEmailRequestMutationOptions = Apollo.BaseMutationOptions<ResetEmailRequestMutation, ResetEmailRequestMutationVariables>;
export const PasswordResetFormRequestDocument = gql`
    mutation PasswordResetFormRequest($token: String!, $password: String!) {
  passwordResetFormResolver(input: {token: $token, password: $password}) {
    error
    session {
      ...SessionFields
    }
  }
}
    ${SessionFieldsFragmentDoc}`;
export type PasswordResetFormRequestMutationFn = Apollo.MutationFunction<PasswordResetFormRequestMutation, PasswordResetFormRequestMutationVariables>;

/**
 * __usePasswordResetFormRequestMutation__
 *
 * To run a mutation, you first call `usePasswordResetFormRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePasswordResetFormRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [passwordResetFormRequestMutation, { data, loading, error }] = usePasswordResetFormRequestMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function usePasswordResetFormRequestMutation(baseOptions?: Apollo.MutationHookOptions<PasswordResetFormRequestMutation, PasswordResetFormRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PasswordResetFormRequestMutation, PasswordResetFormRequestMutationVariables>(PasswordResetFormRequestDocument, options);
      }
export type PasswordResetFormRequestMutationHookResult = ReturnType<typeof usePasswordResetFormRequestMutation>;
export type PasswordResetFormRequestMutationResult = Apollo.MutationResult<PasswordResetFormRequestMutation>;
export type PasswordResetFormRequestMutationOptions = Apollo.BaseMutationOptions<PasswordResetFormRequestMutation, PasswordResetFormRequestMutationVariables>;
export const WordDefinitionReadDocument = gql`
    query WordDefinitionRead($id: ID!) {
  wordDefinitionRead(id: $id) {
    error
    word_definition {
      ...WordDefinitionFragment
    }
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;

/**
 * __useWordDefinitionReadQuery__
 *
 * To run a query within a React component, call `useWordDefinitionReadQuery` and pass it any options that fit your needs.
 * When your component renders, `useWordDefinitionReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWordDefinitionReadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWordDefinitionReadQuery(baseOptions: Apollo.QueryHookOptions<WordDefinitionReadQuery, WordDefinitionReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WordDefinitionReadQuery, WordDefinitionReadQueryVariables>(WordDefinitionReadDocument, options);
      }
export function useWordDefinitionReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WordDefinitionReadQuery, WordDefinitionReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WordDefinitionReadQuery, WordDefinitionReadQueryVariables>(WordDefinitionReadDocument, options);
        }
export type WordDefinitionReadQueryHookResult = ReturnType<typeof useWordDefinitionReadQuery>;
export type WordDefinitionReadLazyQueryHookResult = ReturnType<typeof useWordDefinitionReadLazyQuery>;
export type WordDefinitionReadQueryResult = Apollo.QueryResult<WordDefinitionReadQuery, WordDefinitionReadQueryVariables>;
export const GetWordsByLanguageDocument = gql`
    query GetWordsByLanguage($language_code: String!, $dialect_code: String, $geo_code: String, $filter: String) {
  getWordsByLanguage(
    input: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code, filter: $filter}
  ) {
    error
    word_with_vote_list {
      ...WordWithDefinitionsFragment
    }
  }
}
    ${WordWithDefinitionsFragmentFragmentDoc}`;

/**
 * __useGetWordsByLanguageQuery__
 *
 * To run a query within a React component, call `useGetWordsByLanguageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWordsByLanguageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWordsByLanguageQuery({
 *   variables: {
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetWordsByLanguageQuery(baseOptions: Apollo.QueryHookOptions<GetWordsByLanguageQuery, GetWordsByLanguageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWordsByLanguageQuery, GetWordsByLanguageQueryVariables>(GetWordsByLanguageDocument, options);
      }
export function useGetWordsByLanguageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWordsByLanguageQuery, GetWordsByLanguageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWordsByLanguageQuery, GetWordsByLanguageQueryVariables>(GetWordsByLanguageDocument, options);
        }
export type GetWordsByLanguageQueryHookResult = ReturnType<typeof useGetWordsByLanguageQuery>;
export type GetWordsByLanguageLazyQueryHookResult = ReturnType<typeof useGetWordsByLanguageLazyQuery>;
export type GetWordsByLanguageQueryResult = Apollo.QueryResult<GetWordsByLanguageQuery, GetWordsByLanguageQueryVariables>;
export const GetWordDefinitionsByWordIdDocument = gql`
    query GetWordDefinitionsByWordId($word_id: ID!) {
  getWordDefinitionsByWordId(word_id: $word_id) {
    error
    word_definition_list {
      ...WordDefinitionWithVoteFragment
    }
  }
}
    ${WordDefinitionWithVoteFragmentFragmentDoc}`;

/**
 * __useGetWordDefinitionsByWordIdQuery__
 *
 * To run a query within a React component, call `useGetWordDefinitionsByWordIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWordDefinitionsByWordIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWordDefinitionsByWordIdQuery({
 *   variables: {
 *      word_id: // value for 'word_id'
 *   },
 * });
 */
export function useGetWordDefinitionsByWordIdQuery(baseOptions: Apollo.QueryHookOptions<GetWordDefinitionsByWordIdQuery, GetWordDefinitionsByWordIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWordDefinitionsByWordIdQuery, GetWordDefinitionsByWordIdQueryVariables>(GetWordDefinitionsByWordIdDocument, options);
      }
export function useGetWordDefinitionsByWordIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWordDefinitionsByWordIdQuery, GetWordDefinitionsByWordIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWordDefinitionsByWordIdQuery, GetWordDefinitionsByWordIdQueryVariables>(GetWordDefinitionsByWordIdDocument, options);
        }
export type GetWordDefinitionsByWordIdQueryHookResult = ReturnType<typeof useGetWordDefinitionsByWordIdQuery>;
export type GetWordDefinitionsByWordIdLazyQueryHookResult = ReturnType<typeof useGetWordDefinitionsByWordIdLazyQuery>;
export type GetWordDefinitionsByWordIdQueryResult = Apollo.QueryResult<GetWordDefinitionsByWordIdQuery, GetWordDefinitionsByWordIdQueryVariables>;
export const GetWordWithVoteByIdDocument = gql`
    query GetWordWithVoteById($word_id: ID!) {
  getWordWithVoteById(word_id: $word_id) {
    error
    word_with_vote {
      ...WordWithVoteFragment
    }
  }
}
    ${WordWithVoteFragmentFragmentDoc}`;

/**
 * __useGetWordWithVoteByIdQuery__
 *
 * To run a query within a React component, call `useGetWordWithVoteByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWordWithVoteByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWordWithVoteByIdQuery({
 *   variables: {
 *      word_id: // value for 'word_id'
 *   },
 * });
 */
export function useGetWordWithVoteByIdQuery(baseOptions: Apollo.QueryHookOptions<GetWordWithVoteByIdQuery, GetWordWithVoteByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWordWithVoteByIdQuery, GetWordWithVoteByIdQueryVariables>(GetWordWithVoteByIdDocument, options);
      }
export function useGetWordWithVoteByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWordWithVoteByIdQuery, GetWordWithVoteByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWordWithVoteByIdQuery, GetWordWithVoteByIdQueryVariables>(GetWordWithVoteByIdDocument, options);
        }
export type GetWordWithVoteByIdQueryHookResult = ReturnType<typeof useGetWordWithVoteByIdQuery>;
export type GetWordWithVoteByIdLazyQueryHookResult = ReturnType<typeof useGetWordWithVoteByIdLazyQuery>;
export type GetWordWithVoteByIdQueryResult = Apollo.QueryResult<GetWordWithVoteByIdQuery, GetWordWithVoteByIdQueryVariables>;
export const WordDefinitionUpsertDocument = gql`
    mutation WordDefinitionUpsert($word_id: ID!, $definition: String!) {
  wordDefinitionUpsert(input: {word_id: $word_id, definition: $definition}) {
    error
    word_definition {
      ...WordDefinitionFragment
    }
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export type WordDefinitionUpsertMutationFn = Apollo.MutationFunction<WordDefinitionUpsertMutation, WordDefinitionUpsertMutationVariables>;

/**
 * __useWordDefinitionUpsertMutation__
 *
 * To run a mutation, you first call `useWordDefinitionUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWordDefinitionUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [wordDefinitionUpsertMutation, { data, loading, error }] = useWordDefinitionUpsertMutation({
 *   variables: {
 *      word_id: // value for 'word_id'
 *      definition: // value for 'definition'
 *   },
 * });
 */
export function useWordDefinitionUpsertMutation(baseOptions?: Apollo.MutationHookOptions<WordDefinitionUpsertMutation, WordDefinitionUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WordDefinitionUpsertMutation, WordDefinitionUpsertMutationVariables>(WordDefinitionUpsertDocument, options);
      }
export type WordDefinitionUpsertMutationHookResult = ReturnType<typeof useWordDefinitionUpsertMutation>;
export type WordDefinitionUpsertMutationResult = Apollo.MutationResult<WordDefinitionUpsertMutation>;
export type WordDefinitionUpsertMutationOptions = Apollo.BaseMutationOptions<WordDefinitionUpsertMutation, WordDefinitionUpsertMutationVariables>;
export const ToggleWordDefinitionVoteStatusDocument = gql`
    mutation ToggleWordDefinitionVoteStatus($word_definition_id: ID!, $vote: Boolean!) {
  toggleWordDefinitionVoteStatus(
    word_definition_id: $word_definition_id
    vote: $vote
  ) {
    error
    vote_status {
      ...DefinitionVoteStatusFragment
    }
  }
}
    ${DefinitionVoteStatusFragmentFragmentDoc}`;
export type ToggleWordDefinitionVoteStatusMutationFn = Apollo.MutationFunction<ToggleWordDefinitionVoteStatusMutation, ToggleWordDefinitionVoteStatusMutationVariables>;

/**
 * __useToggleWordDefinitionVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleWordDefinitionVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleWordDefinitionVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleWordDefinitionVoteStatusMutation, { data, loading, error }] = useToggleWordDefinitionVoteStatusMutation({
 *   variables: {
 *      word_definition_id: // value for 'word_definition_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleWordDefinitionVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleWordDefinitionVoteStatusMutation, ToggleWordDefinitionVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleWordDefinitionVoteStatusMutation, ToggleWordDefinitionVoteStatusMutationVariables>(ToggleWordDefinitionVoteStatusDocument, options);
      }
export type ToggleWordDefinitionVoteStatusMutationHookResult = ReturnType<typeof useToggleWordDefinitionVoteStatusMutation>;
export type ToggleWordDefinitionVoteStatusMutationResult = Apollo.MutationResult<ToggleWordDefinitionVoteStatusMutation>;
export type ToggleWordDefinitionVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleWordDefinitionVoteStatusMutation, ToggleWordDefinitionVoteStatusMutationVariables>;
export const ToggleWordVoteStatusDocument = gql`
    mutation ToggleWordVoteStatus($word_id: ID!, $vote: Boolean!) {
  toggleWordVoteStatus(word_id: $word_id, vote: $vote) {
    error
    vote_status {
      ...WordVoteStatusFragment
    }
  }
}
    ${WordVoteStatusFragmentFragmentDoc}`;
export type ToggleWordVoteStatusMutationFn = Apollo.MutationFunction<ToggleWordVoteStatusMutation, ToggleWordVoteStatusMutationVariables>;

/**
 * __useToggleWordVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleWordVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleWordVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleWordVoteStatusMutation, { data, loading, error }] = useToggleWordVoteStatusMutation({
 *   variables: {
 *      word_id: // value for 'word_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleWordVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleWordVoteStatusMutation, ToggleWordVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleWordVoteStatusMutation, ToggleWordVoteStatusMutationVariables>(ToggleWordVoteStatusDocument, options);
      }
export type ToggleWordVoteStatusMutationHookResult = ReturnType<typeof useToggleWordVoteStatusMutation>;
export type ToggleWordVoteStatusMutationResult = Apollo.MutationResult<ToggleWordVoteStatusMutation>;
export type ToggleWordVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleWordVoteStatusMutation, ToggleWordVoteStatusMutationVariables>;
export const WordUpsertDocument = gql`
    mutation WordUpsert($wordlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  wordUpsert(
    input: {wordlike_string: $wordlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    word {
      ...WordFragment
    }
  }
}
    ${WordFragmentFragmentDoc}`;
export type WordUpsertMutationFn = Apollo.MutationFunction<WordUpsertMutation, WordUpsertMutationVariables>;

/**
 * __useWordUpsertMutation__
 *
 * To run a mutation, you first call `useWordUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWordUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [wordUpsertMutation, { data, loading, error }] = useWordUpsertMutation({
 *   variables: {
 *      wordlike_string: // value for 'wordlike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useWordUpsertMutation(baseOptions?: Apollo.MutationHookOptions<WordUpsertMutation, WordUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WordUpsertMutation, WordUpsertMutationVariables>(WordUpsertDocument, options);
      }
export type WordUpsertMutationHookResult = ReturnType<typeof useWordUpsertMutation>;
export type WordUpsertMutationResult = Apollo.MutationResult<WordUpsertMutation>;
export type WordUpsertMutationOptions = Apollo.BaseMutationOptions<WordUpsertMutation, WordUpsertMutationVariables>;
export const EmailResponseDocument = gql`
    mutation EmailResponse($token: String!) {
  emailResponseResolver(input: {token: $token}) {
    error
  }
}
    `;
export type EmailResponseMutationFn = Apollo.MutationFunction<EmailResponseMutation, EmailResponseMutationVariables>;

/**
 * __useEmailResponseMutation__
 *
 * To run a mutation, you first call `useEmailResponseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailResponseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailResponseMutation, { data, loading, error }] = useEmailResponseMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useEmailResponseMutation(baseOptions?: Apollo.MutationHookOptions<EmailResponseMutation, EmailResponseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailResponseMutation, EmailResponseMutationVariables>(EmailResponseDocument, options);
      }
export type EmailResponseMutationHookResult = ReturnType<typeof useEmailResponseMutation>;
export type EmailResponseMutationResult = Apollo.MutationResult<EmailResponseMutation>;
export type EmailResponseMutationOptions = Apollo.BaseMutationOptions<EmailResponseMutation, EmailResponseMutationVariables>;
export const GetOrigMapWordsDocument = gql`
    query GetOrigMapWords($original_map_id: ID, $o_language_code: String, $t_language_code: String, $t_dialect_code: String, $t_geo_code: String) {
  getOrigMapWords(
    input: {original_map_id: $original_map_id, o_language_code: $o_language_code, t_language_code: $t_language_code, t_dialect_code: $t_dialect_code, t_geo_code: $t_geo_code}
  ) {
    origMapWords {
      word
      word_id
      language_code
      dialect_code
      geo_code
      definition
      definition_id
      translations {
        word
        word_id
        language_code
        dialect_code
        geo_code
        definition
        definition_id
        up_votes
        down_votes
        translation_id
      }
    }
  }
}
    `;

/**
 * __useGetOrigMapWordsQuery__
 *
 * To run a query within a React component, call `useGetOrigMapWordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrigMapWordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrigMapWordsQuery({
 *   variables: {
 *      original_map_id: // value for 'original_map_id'
 *      o_language_code: // value for 'o_language_code'
 *      t_language_code: // value for 't_language_code'
 *      t_dialect_code: // value for 't_dialect_code'
 *      t_geo_code: // value for 't_geo_code'
 *   },
 * });
 */
export function useGetOrigMapWordsQuery(baseOptions?: Apollo.QueryHookOptions<GetOrigMapWordsQuery, GetOrigMapWordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrigMapWordsQuery, GetOrigMapWordsQueryVariables>(GetOrigMapWordsDocument, options);
      }
export function useGetOrigMapWordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrigMapWordsQuery, GetOrigMapWordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrigMapWordsQuery, GetOrigMapWordsQueryVariables>(GetOrigMapWordsDocument, options);
        }
export type GetOrigMapWordsQueryHookResult = ReturnType<typeof useGetOrigMapWordsQuery>;
export type GetOrigMapWordsLazyQueryHookResult = ReturnType<typeof useGetOrigMapWordsLazyQuery>;
export type GetOrigMapWordsQueryResult = Apollo.QueryResult<GetOrigMapWordsQuery, GetOrigMapWordsQueryVariables>;
export const GetAllMapsListDocument = gql`
    query GetAllMapsList($lang: LanguageInput) {
  getAllMapsList(input: {lang: $lang}) {
    allMapsList {
      is_original
      original_map_id
      translated_map_id
      map_file_name
      language {
        language_code
        dialect_code
        geo_code
      }
      created_at
      created_by
    }
  }
}
    `;

/**
 * __useGetAllMapsListQuery__
 *
 * To run a query within a React component, call `useGetAllMapsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllMapsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllMapsListQuery({
 *   variables: {
 *      lang: // value for 'lang'
 *   },
 * });
 */
export function useGetAllMapsListQuery(baseOptions?: Apollo.QueryHookOptions<GetAllMapsListQuery, GetAllMapsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllMapsListQuery, GetAllMapsListQueryVariables>(GetAllMapsListDocument, options);
      }
export function useGetAllMapsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllMapsListQuery, GetAllMapsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllMapsListQuery, GetAllMapsListQueryVariables>(GetAllMapsListDocument, options);
        }
export type GetAllMapsListQueryHookResult = ReturnType<typeof useGetAllMapsListQuery>;
export type GetAllMapsListLazyQueryHookResult = ReturnType<typeof useGetAllMapsListLazyQuery>;
export type GetAllMapsListQueryResult = Apollo.QueryResult<GetAllMapsListQuery, GetAllMapsListQueryVariables>;
export const GetTranslatedMapContentDocument = gql`
    query GetTranslatedMapContent($id: ID!) {
  getTranslatedMapContent(input: {translated_map_id: $id}) {
    translated_map_id
    map_file_name
    language {
      language_code
      dialect_code
      geo_code
    }
    created_at
    created_by
    content
  }
}
    `;

/**
 * __useGetTranslatedMapContentQuery__
 *
 * To run a query within a React component, call `useGetTranslatedMapContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranslatedMapContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranslatedMapContentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTranslatedMapContentQuery(baseOptions: Apollo.QueryHookOptions<GetTranslatedMapContentQuery, GetTranslatedMapContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranslatedMapContentQuery, GetTranslatedMapContentQueryVariables>(GetTranslatedMapContentDocument, options);
      }
export function useGetTranslatedMapContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranslatedMapContentQuery, GetTranslatedMapContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranslatedMapContentQuery, GetTranslatedMapContentQueryVariables>(GetTranslatedMapContentDocument, options);
        }
export type GetTranslatedMapContentQueryHookResult = ReturnType<typeof useGetTranslatedMapContentQuery>;
export type GetTranslatedMapContentLazyQueryHookResult = ReturnType<typeof useGetTranslatedMapContentLazyQuery>;
export type GetTranslatedMapContentQueryResult = Apollo.QueryResult<GetTranslatedMapContentQuery, GetTranslatedMapContentQueryVariables>;
export const IsAdminLoggedInDocument = gql`
    query IsAdminLoggedIn($input: IsAdminIdInput!) {
  loggedInIsAdmin(input: $input) {
    isAdmin
  }
}
    `;

/**
 * __useIsAdminLoggedInQuery__
 *
 * To run a query within a React component, call `useIsAdminLoggedInQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsAdminLoggedInQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsAdminLoggedInQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useIsAdminLoggedInQuery(baseOptions: Apollo.QueryHookOptions<IsAdminLoggedInQuery, IsAdminLoggedInQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsAdminLoggedInQuery, IsAdminLoggedInQueryVariables>(IsAdminLoggedInDocument, options);
      }
export function useIsAdminLoggedInLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsAdminLoggedInQuery, IsAdminLoggedInQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsAdminLoggedInQuery, IsAdminLoggedInQueryVariables>(IsAdminLoggedInDocument, options);
        }
export type IsAdminLoggedInQueryHookResult = ReturnType<typeof useIsAdminLoggedInQuery>;
export type IsAdminLoggedInLazyQueryHookResult = ReturnType<typeof useIsAdminLoggedInLazyQuery>;
export type IsAdminLoggedInQueryResult = Apollo.QueryResult<IsAdminLoggedInQuery, IsAdminLoggedInQueryVariables>;
export const GetOrigMapContentDocument = gql`
    query GetOrigMapContent($id: ID!) {
  getOrigMapContent(input: {original_map_id: $id}) {
    original_map_id
    map_file_name
    created_at
    created_by
    content
  }
}
    `;

/**
 * __useGetOrigMapContentQuery__
 *
 * To run a query within a React component, call `useGetOrigMapContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrigMapContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrigMapContentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrigMapContentQuery(baseOptions: Apollo.QueryHookOptions<GetOrigMapContentQuery, GetOrigMapContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrigMapContentQuery, GetOrigMapContentQueryVariables>(GetOrigMapContentDocument, options);
      }
export function useGetOrigMapContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrigMapContentQuery, GetOrigMapContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrigMapContentQuery, GetOrigMapContentQueryVariables>(GetOrigMapContentDocument, options);
        }
export type GetOrigMapContentQueryHookResult = ReturnType<typeof useGetOrigMapContentQuery>;
export type GetOrigMapContentLazyQueryHookResult = ReturnType<typeof useGetOrigMapContentLazyQuery>;
export type GetOrigMapContentQueryResult = Apollo.QueryResult<GetOrigMapContentQuery, GetOrigMapContentQueryVariables>;
export const MapUploadDocument = gql`
    mutation MapUpload($file: Upload!) {
  mapUpload(file: $file) {
    original_map_id
    map_file_name
  }
}
    `;
export type MapUploadMutationFn = Apollo.MutationFunction<MapUploadMutation, MapUploadMutationVariables>;

/**
 * __useMapUploadMutation__
 *
 * To run a mutation, you first call `useMapUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMapUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mapUploadMutation, { data, loading, error }] = useMapUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useMapUploadMutation(baseOptions?: Apollo.MutationHookOptions<MapUploadMutation, MapUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MapUploadMutation, MapUploadMutationVariables>(MapUploadDocument, options);
      }
export type MapUploadMutationHookResult = ReturnType<typeof useMapUploadMutation>;
export type MapUploadMutationResult = Apollo.MutationResult<MapUploadMutation>;
export type MapUploadMutationOptions = Apollo.BaseMutationOptions<MapUploadMutation, MapUploadMutationVariables>;
export const PhraseDefinitionReadDocument = gql`
    query PhraseDefinitionRead($id: ID!) {
  phraseDefinitionRead(id: $id) {
    error
    phrase_definition {
      ...PhraseDefinitionFragment
    }
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;

/**
 * __usePhraseDefinitionReadQuery__
 *
 * To run a query within a React component, call `usePhraseDefinitionReadQuery` and pass it any options that fit your needs.
 * When your component renders, `usePhraseDefinitionReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePhraseDefinitionReadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePhraseDefinitionReadQuery(baseOptions: Apollo.QueryHookOptions<PhraseDefinitionReadQuery, PhraseDefinitionReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PhraseDefinitionReadQuery, PhraseDefinitionReadQueryVariables>(PhraseDefinitionReadDocument, options);
      }
export function usePhraseDefinitionReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PhraseDefinitionReadQuery, PhraseDefinitionReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PhraseDefinitionReadQuery, PhraseDefinitionReadQueryVariables>(PhraseDefinitionReadDocument, options);
        }
export type PhraseDefinitionReadQueryHookResult = ReturnType<typeof usePhraseDefinitionReadQuery>;
export type PhraseDefinitionReadLazyQueryHookResult = ReturnType<typeof usePhraseDefinitionReadLazyQuery>;
export type PhraseDefinitionReadQueryResult = Apollo.QueryResult<PhraseDefinitionReadQuery, PhraseDefinitionReadQueryVariables>;
export const GetPhrasesByLanguageDocument = gql`
    query GetPhrasesByLanguage($language_code: String!, $dialect_code: String, $geo_code: String, $filter: String) {
  getPhrasesByLanguage(
    input: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code, filter: $filter}
  ) {
    error
    phrase_with_vote_list {
      ...PhraseWithDefinitionsFragment
    }
  }
}
    ${PhraseWithDefinitionsFragmentFragmentDoc}`;

/**
 * __useGetPhrasesByLanguageQuery__
 *
 * To run a query within a React component, call `useGetPhrasesByLanguageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPhrasesByLanguageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPhrasesByLanguageQuery({
 *   variables: {
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetPhrasesByLanguageQuery(baseOptions: Apollo.QueryHookOptions<GetPhrasesByLanguageQuery, GetPhrasesByLanguageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPhrasesByLanguageQuery, GetPhrasesByLanguageQueryVariables>(GetPhrasesByLanguageDocument, options);
      }
export function useGetPhrasesByLanguageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPhrasesByLanguageQuery, GetPhrasesByLanguageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPhrasesByLanguageQuery, GetPhrasesByLanguageQueryVariables>(GetPhrasesByLanguageDocument, options);
        }
export type GetPhrasesByLanguageQueryHookResult = ReturnType<typeof useGetPhrasesByLanguageQuery>;
export type GetPhrasesByLanguageLazyQueryHookResult = ReturnType<typeof useGetPhrasesByLanguageLazyQuery>;
export type GetPhrasesByLanguageQueryResult = Apollo.QueryResult<GetPhrasesByLanguageQuery, GetPhrasesByLanguageQueryVariables>;
export const GetPhraseDefinitionsByPhraseIdDocument = gql`
    query GetPhraseDefinitionsByPhraseId($phrase_id: ID!) {
  getPhraseDefinitionsByPhraseId(phrase_id: $phrase_id) {
    error
    phrase_definition_list {
      ...PhraseDefinitionWithVoteFragment
    }
  }
}
    ${PhraseDefinitionWithVoteFragmentFragmentDoc}`;

/**
 * __useGetPhraseDefinitionsByPhraseIdQuery__
 *
 * To run a query within a React component, call `useGetPhraseDefinitionsByPhraseIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPhraseDefinitionsByPhraseIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPhraseDefinitionsByPhraseIdQuery({
 *   variables: {
 *      phrase_id: // value for 'phrase_id'
 *   },
 * });
 */
export function useGetPhraseDefinitionsByPhraseIdQuery(baseOptions: Apollo.QueryHookOptions<GetPhraseDefinitionsByPhraseIdQuery, GetPhraseDefinitionsByPhraseIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPhraseDefinitionsByPhraseIdQuery, GetPhraseDefinitionsByPhraseIdQueryVariables>(GetPhraseDefinitionsByPhraseIdDocument, options);
      }
export function useGetPhraseDefinitionsByPhraseIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPhraseDefinitionsByPhraseIdQuery, GetPhraseDefinitionsByPhraseIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPhraseDefinitionsByPhraseIdQuery, GetPhraseDefinitionsByPhraseIdQueryVariables>(GetPhraseDefinitionsByPhraseIdDocument, options);
        }
export type GetPhraseDefinitionsByPhraseIdQueryHookResult = ReturnType<typeof useGetPhraseDefinitionsByPhraseIdQuery>;
export type GetPhraseDefinitionsByPhraseIdLazyQueryHookResult = ReturnType<typeof useGetPhraseDefinitionsByPhraseIdLazyQuery>;
export type GetPhraseDefinitionsByPhraseIdQueryResult = Apollo.QueryResult<GetPhraseDefinitionsByPhraseIdQuery, GetPhraseDefinitionsByPhraseIdQueryVariables>;
export const GetPhraseWithVoteByIdDocument = gql`
    query GetPhraseWithVoteById($phrase_id: ID!) {
  getPhraseWithVoteById(phrase_id: $phrase_id) {
    error
    phrase_with_vote {
      ...PhraseWithVoteFragment
    }
  }
}
    ${PhraseWithVoteFragmentFragmentDoc}`;

/**
 * __useGetPhraseWithVoteByIdQuery__
 *
 * To run a query within a React component, call `useGetPhraseWithVoteByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPhraseWithVoteByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPhraseWithVoteByIdQuery({
 *   variables: {
 *      phrase_id: // value for 'phrase_id'
 *   },
 * });
 */
export function useGetPhraseWithVoteByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPhraseWithVoteByIdQuery, GetPhraseWithVoteByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPhraseWithVoteByIdQuery, GetPhraseWithVoteByIdQueryVariables>(GetPhraseWithVoteByIdDocument, options);
      }
export function useGetPhraseWithVoteByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPhraseWithVoteByIdQuery, GetPhraseWithVoteByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPhraseWithVoteByIdQuery, GetPhraseWithVoteByIdQueryVariables>(GetPhraseWithVoteByIdDocument, options);
        }
export type GetPhraseWithVoteByIdQueryHookResult = ReturnType<typeof useGetPhraseWithVoteByIdQuery>;
export type GetPhraseWithVoteByIdLazyQueryHookResult = ReturnType<typeof useGetPhraseWithVoteByIdLazyQuery>;
export type GetPhraseWithVoteByIdQueryResult = Apollo.QueryResult<GetPhraseWithVoteByIdQuery, GetPhraseWithVoteByIdQueryVariables>;
export const PhraseDefinitionUpsertDocument = gql`
    mutation PhraseDefinitionUpsert($phrase_id: ID!, $definition: String!) {
  phraseDefinitionUpsert(input: {phrase_id: $phrase_id, definition: $definition}) {
    error
    phrase_definition {
      ...PhraseDefinitionFragment
    }
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export type PhraseDefinitionUpsertMutationFn = Apollo.MutationFunction<PhraseDefinitionUpsertMutation, PhraseDefinitionUpsertMutationVariables>;

/**
 * __usePhraseDefinitionUpsertMutation__
 *
 * To run a mutation, you first call `usePhraseDefinitionUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePhraseDefinitionUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [phraseDefinitionUpsertMutation, { data, loading, error }] = usePhraseDefinitionUpsertMutation({
 *   variables: {
 *      phrase_id: // value for 'phrase_id'
 *      definition: // value for 'definition'
 *   },
 * });
 */
export function usePhraseDefinitionUpsertMutation(baseOptions?: Apollo.MutationHookOptions<PhraseDefinitionUpsertMutation, PhraseDefinitionUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PhraseDefinitionUpsertMutation, PhraseDefinitionUpsertMutationVariables>(PhraseDefinitionUpsertDocument, options);
      }
export type PhraseDefinitionUpsertMutationHookResult = ReturnType<typeof usePhraseDefinitionUpsertMutation>;
export type PhraseDefinitionUpsertMutationResult = Apollo.MutationResult<PhraseDefinitionUpsertMutation>;
export type PhraseDefinitionUpsertMutationOptions = Apollo.BaseMutationOptions<PhraseDefinitionUpsertMutation, PhraseDefinitionUpsertMutationVariables>;
export const TogglePhraseDefinitionVoteStatusDocument = gql`
    mutation TogglePhraseDefinitionVoteStatus($phrase_definition_id: ID!, $vote: Boolean!) {
  togglePhraseDefinitionVoteStatus(
    phrase_definition_id: $phrase_definition_id
    vote: $vote
  ) {
    error
    vote_status {
      ...DefinitionVoteStatusFragment
    }
  }
}
    ${DefinitionVoteStatusFragmentFragmentDoc}`;
export type TogglePhraseDefinitionVoteStatusMutationFn = Apollo.MutationFunction<TogglePhraseDefinitionVoteStatusMutation, TogglePhraseDefinitionVoteStatusMutationVariables>;

/**
 * __useTogglePhraseDefinitionVoteStatusMutation__
 *
 * To run a mutation, you first call `useTogglePhraseDefinitionVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePhraseDefinitionVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePhraseDefinitionVoteStatusMutation, { data, loading, error }] = useTogglePhraseDefinitionVoteStatusMutation({
 *   variables: {
 *      phrase_definition_id: // value for 'phrase_definition_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useTogglePhraseDefinitionVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<TogglePhraseDefinitionVoteStatusMutation, TogglePhraseDefinitionVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePhraseDefinitionVoteStatusMutation, TogglePhraseDefinitionVoteStatusMutationVariables>(TogglePhraseDefinitionVoteStatusDocument, options);
      }
export type TogglePhraseDefinitionVoteStatusMutationHookResult = ReturnType<typeof useTogglePhraseDefinitionVoteStatusMutation>;
export type TogglePhraseDefinitionVoteStatusMutationResult = Apollo.MutationResult<TogglePhraseDefinitionVoteStatusMutation>;
export type TogglePhraseDefinitionVoteStatusMutationOptions = Apollo.BaseMutationOptions<TogglePhraseDefinitionVoteStatusMutation, TogglePhraseDefinitionVoteStatusMutationVariables>;
export const TogglePhraseVoteStatusDocument = gql`
    mutation TogglePhraseVoteStatus($phrase_id: ID!, $vote: Boolean!) {
  togglePhraseVoteStatus(phrase_id: $phrase_id, vote: $vote) {
    error
    vote_status {
      ...PhraseVoteStatusFragment
    }
  }
}
    ${PhraseVoteStatusFragmentFragmentDoc}`;
export type TogglePhraseVoteStatusMutationFn = Apollo.MutationFunction<TogglePhraseVoteStatusMutation, TogglePhraseVoteStatusMutationVariables>;

/**
 * __useTogglePhraseVoteStatusMutation__
 *
 * To run a mutation, you first call `useTogglePhraseVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePhraseVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePhraseVoteStatusMutation, { data, loading, error }] = useTogglePhraseVoteStatusMutation({
 *   variables: {
 *      phrase_id: // value for 'phrase_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useTogglePhraseVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<TogglePhraseVoteStatusMutation, TogglePhraseVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePhraseVoteStatusMutation, TogglePhraseVoteStatusMutationVariables>(TogglePhraseVoteStatusDocument, options);
      }
export type TogglePhraseVoteStatusMutationHookResult = ReturnType<typeof useTogglePhraseVoteStatusMutation>;
export type TogglePhraseVoteStatusMutationResult = Apollo.MutationResult<TogglePhraseVoteStatusMutation>;
export type TogglePhraseVoteStatusMutationOptions = Apollo.BaseMutationOptions<TogglePhraseVoteStatusMutation, TogglePhraseVoteStatusMutationVariables>;
export const PhraseUpsertDocument = gql`
    mutation PhraseUpsert($phraselike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  phraseUpsert(
    input: {phraselike_string: $phraselike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    phrase {
      ...PhraseFragment
    }
  }
}
    ${PhraseFragmentFragmentDoc}`;
export type PhraseUpsertMutationFn = Apollo.MutationFunction<PhraseUpsertMutation, PhraseUpsertMutationVariables>;

/**
 * __usePhraseUpsertMutation__
 *
 * To run a mutation, you first call `usePhraseUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePhraseUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [phraseUpsertMutation, { data, loading, error }] = usePhraseUpsertMutation({
 *   variables: {
 *      phraselike_string: // value for 'phraselike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function usePhraseUpsertMutation(baseOptions?: Apollo.MutationHookOptions<PhraseUpsertMutation, PhraseUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PhraseUpsertMutation, PhraseUpsertMutationVariables>(PhraseUpsertDocument, options);
      }
export type PhraseUpsertMutationHookResult = ReturnType<typeof usePhraseUpsertMutation>;
export type PhraseUpsertMutationResult = Apollo.MutationResult<PhraseUpsertMutation>;
export type PhraseUpsertMutationOptions = Apollo.BaseMutationOptions<PhraseUpsertMutation, PhraseUpsertMutationVariables>;
export const PostCreateDocument = gql`
    mutation PostCreate($content: String!, $parentId: Int) {
  postCreateResolver(input: {content: $content, parent_id: $parentId}) {
    error
    post {
      ...PostFields
    }
  }
}
    ${PostFieldsFragmentDoc}`;
export type PostCreateMutationFn = Apollo.MutationFunction<PostCreateMutation, PostCreateMutationVariables>;

/**
 * __usePostCreateMutation__
 *
 * To run a mutation, you first call `usePostCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postCreateMutation, { data, loading, error }] = usePostCreateMutation({
 *   variables: {
 *      content: // value for 'content'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function usePostCreateMutation(baseOptions?: Apollo.MutationHookOptions<PostCreateMutation, PostCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostCreateMutation, PostCreateMutationVariables>(PostCreateDocument, options);
      }
export type PostCreateMutationHookResult = ReturnType<typeof usePostCreateMutation>;
export type PostCreateMutationResult = Apollo.MutationResult<PostCreateMutation>;
export type PostCreateMutationOptions = Apollo.BaseMutationOptions<PostCreateMutation, PostCreateMutationVariables>;
export const VersionCreateDocument = gql`
    mutation VersionCreate($postId: Int!, $content: String!, $license_title: String!) {
  versionCreateResolver(
    input: {post_id: $postId, content: $content, license_title: $license_title}
  ) {
    error
    version {
      ...VersionFields
    }
  }
}
    ${VersionFieldsFragmentDoc}`;
export type VersionCreateMutationFn = Apollo.MutationFunction<VersionCreateMutation, VersionCreateMutationVariables>;

/**
 * __useVersionCreateMutation__
 *
 * To run a mutation, you first call `useVersionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVersionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [versionCreateMutation, { data, loading, error }] = useVersionCreateMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      content: // value for 'content'
 *      license_title: // value for 'license_title'
 *   },
 * });
 */
export function useVersionCreateMutation(baseOptions?: Apollo.MutationHookOptions<VersionCreateMutation, VersionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VersionCreateMutation, VersionCreateMutationVariables>(VersionCreateDocument, options);
      }
export type VersionCreateMutationHookResult = ReturnType<typeof useVersionCreateMutation>;
export type VersionCreateMutationResult = Apollo.MutationResult<VersionCreateMutation>;
export type VersionCreateMutationOptions = Apollo.BaseMutationOptions<VersionCreateMutation, VersionCreateMutationVariables>;
export const PostReadDocument = gql`
    query PostRead($postId: ID!) {
  postReadResolver(input: {post_id: $postId}) {
    error
    post {
      ...PostFields
    }
  }
}
    ${PostFieldsFragmentDoc}`;

/**
 * __usePostReadQuery__
 *
 * To run a query within a React component, call `usePostReadQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostReadQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function usePostReadQuery(baseOptions: Apollo.QueryHookOptions<PostReadQuery, PostReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostReadQuery, PostReadQueryVariables>(PostReadDocument, options);
      }
export function usePostReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostReadQuery, PostReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostReadQuery, PostReadQueryVariables>(PostReadDocument, options);
        }
export type PostReadQueryHookResult = ReturnType<typeof usePostReadQuery>;
export type PostReadLazyQueryHookResult = ReturnType<typeof usePostReadLazyQuery>;
export type PostReadQueryResult = Apollo.QueryResult<PostReadQuery, PostReadQueryVariables>;
export const GetAllSiteTextDefinitionsDocument = gql`
    query GetAllSiteTextDefinitions($filter: String) {
  getAllSiteTextDefinitions(filter: $filter) {
    error
    site_text_definition_list {
      ...SiteTextPhraseDefinitionFragment
      ...SiteTextWordDefinitionFragment
    }
  }
}
    ${SiteTextPhraseDefinitionFragmentFragmentDoc}
${SiteTextWordDefinitionFragmentFragmentDoc}`;

/**
 * __useGetAllSiteTextDefinitionsQuery__
 *
 * To run a query within a React component, call `useGetAllSiteTextDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSiteTextDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSiteTextDefinitionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAllSiteTextDefinitionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSiteTextDefinitionsQuery, GetAllSiteTextDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSiteTextDefinitionsQuery, GetAllSiteTextDefinitionsQueryVariables>(GetAllSiteTextDefinitionsDocument, options);
      }
export function useGetAllSiteTextDefinitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSiteTextDefinitionsQuery, GetAllSiteTextDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSiteTextDefinitionsQuery, GetAllSiteTextDefinitionsQueryVariables>(GetAllSiteTextDefinitionsDocument, options);
        }
export type GetAllSiteTextDefinitionsQueryHookResult = ReturnType<typeof useGetAllSiteTextDefinitionsQuery>;
export type GetAllSiteTextDefinitionsLazyQueryHookResult = ReturnType<typeof useGetAllSiteTextDefinitionsLazyQuery>;
export type GetAllSiteTextDefinitionsQueryResult = Apollo.QueryResult<GetAllSiteTextDefinitionsQuery, GetAllSiteTextDefinitionsQueryVariables>;
export const GetAllTranslationFromSiteTextDefinitionIdDocument = gql`
    query GetAllTranslationFromSiteTextDefinitionID($site_text_id: ID!, $site_text_type_is_word: Boolean!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  getAllTranslationFromSiteTextDefinitionID(
    site_text_id: $site_text_id
    site_text_type_is_word: $site_text_type_is_word
    language_code: $language_code
    dialect_code: $dialect_code
    geo_code: $geo_code
  ) {
    error
    site_text_translation_with_vote_list {
      ...SiteTextWordToWordTranslationWithVoteFragment
      ...SiteTextWordToPhraseTranslationWithVoteFragment
      ...SiteTextPhraseToWordTranslationWithVoteFragment
      ...SiteTextPhraseToPhraseTranslationWithVoteFragment
    }
  }
}
    ${SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;

/**
 * __useGetAllTranslationFromSiteTextDefinitionIdQuery__
 *
 * To run a query within a React component, call `useGetAllTranslationFromSiteTextDefinitionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTranslationFromSiteTextDefinitionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTranslationFromSiteTextDefinitionIdQuery({
 *   variables: {
 *      site_text_id: // value for 'site_text_id'
 *      site_text_type_is_word: // value for 'site_text_type_is_word'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetAllTranslationFromSiteTextDefinitionIdQuery(baseOptions: Apollo.QueryHookOptions<GetAllTranslationFromSiteTextDefinitionIdQuery, GetAllTranslationFromSiteTextDefinitionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTranslationFromSiteTextDefinitionIdQuery, GetAllTranslationFromSiteTextDefinitionIdQueryVariables>(GetAllTranslationFromSiteTextDefinitionIdDocument, options);
      }
export function useGetAllTranslationFromSiteTextDefinitionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTranslationFromSiteTextDefinitionIdQuery, GetAllTranslationFromSiteTextDefinitionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTranslationFromSiteTextDefinitionIdQuery, GetAllTranslationFromSiteTextDefinitionIdQueryVariables>(GetAllTranslationFromSiteTextDefinitionIdDocument, options);
        }
export type GetAllTranslationFromSiteTextDefinitionIdQueryHookResult = ReturnType<typeof useGetAllTranslationFromSiteTextDefinitionIdQuery>;
export type GetAllTranslationFromSiteTextDefinitionIdLazyQueryHookResult = ReturnType<typeof useGetAllTranslationFromSiteTextDefinitionIdLazyQuery>;
export type GetAllTranslationFromSiteTextDefinitionIdQueryResult = Apollo.QueryResult<GetAllTranslationFromSiteTextDefinitionIdQuery, GetAllTranslationFromSiteTextDefinitionIdQueryVariables>;
export const SiteTextWordDefinitionReadDocument = gql`
    query SiteTextWordDefinitionRead($id: String!) {
  siteTextWordDefinitionRead(id: $id) {
    error
    site_text_word_definition {
      ...SiteTextWordDefinitionFragment
    }
  }
}
    ${SiteTextWordDefinitionFragmentFragmentDoc}`;

/**
 * __useSiteTextWordDefinitionReadQuery__
 *
 * To run a query within a React component, call `useSiteTextWordDefinitionReadQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteTextWordDefinitionReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteTextWordDefinitionReadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSiteTextWordDefinitionReadQuery(baseOptions: Apollo.QueryHookOptions<SiteTextWordDefinitionReadQuery, SiteTextWordDefinitionReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SiteTextWordDefinitionReadQuery, SiteTextWordDefinitionReadQueryVariables>(SiteTextWordDefinitionReadDocument, options);
      }
export function useSiteTextWordDefinitionReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SiteTextWordDefinitionReadQuery, SiteTextWordDefinitionReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SiteTextWordDefinitionReadQuery, SiteTextWordDefinitionReadQueryVariables>(SiteTextWordDefinitionReadDocument, options);
        }
export type SiteTextWordDefinitionReadQueryHookResult = ReturnType<typeof useSiteTextWordDefinitionReadQuery>;
export type SiteTextWordDefinitionReadLazyQueryHookResult = ReturnType<typeof useSiteTextWordDefinitionReadLazyQuery>;
export type SiteTextWordDefinitionReadQueryResult = Apollo.QueryResult<SiteTextWordDefinitionReadQuery, SiteTextWordDefinitionReadQueryVariables>;
export const SiteTextPhraseDefinitionReadDocument = gql`
    query SiteTextPhraseDefinitionRead($id: String!) {
  siteTextPhraseDefinitionRead(id: $id) {
    error
    site_text_phrase_definition {
      ...SiteTextPhraseDefinitionFragment
    }
  }
}
    ${SiteTextPhraseDefinitionFragmentFragmentDoc}`;

/**
 * __useSiteTextPhraseDefinitionReadQuery__
 *
 * To run a query within a React component, call `useSiteTextPhraseDefinitionReadQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteTextPhraseDefinitionReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteTextPhraseDefinitionReadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSiteTextPhraseDefinitionReadQuery(baseOptions: Apollo.QueryHookOptions<SiteTextPhraseDefinitionReadQuery, SiteTextPhraseDefinitionReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SiteTextPhraseDefinitionReadQuery, SiteTextPhraseDefinitionReadQueryVariables>(SiteTextPhraseDefinitionReadDocument, options);
      }
export function useSiteTextPhraseDefinitionReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SiteTextPhraseDefinitionReadQuery, SiteTextPhraseDefinitionReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SiteTextPhraseDefinitionReadQuery, SiteTextPhraseDefinitionReadQueryVariables>(SiteTextPhraseDefinitionReadDocument, options);
        }
export type SiteTextPhraseDefinitionReadQueryHookResult = ReturnType<typeof useSiteTextPhraseDefinitionReadQuery>;
export type SiteTextPhraseDefinitionReadLazyQueryHookResult = ReturnType<typeof useSiteTextPhraseDefinitionReadLazyQuery>;
export type SiteTextPhraseDefinitionReadQueryResult = Apollo.QueryResult<SiteTextPhraseDefinitionReadQuery, SiteTextPhraseDefinitionReadQueryVariables>;
export const UpsertSiteTextTranslationDocument = gql`
    mutation UpsertSiteTextTranslation($site_text_id: ID!, $is_word_definition: Boolean!, $translationlike_string: String!, $definitionlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  upsertSiteTextTranslation(
    input: {site_text_id: $site_text_id, is_word_definition: $is_word_definition, translationlike_string: $translationlike_string, definitionlike_string: $definitionlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    translation {
      ...WordToWordTranslationFragment
      ...WordToPhraseTranslationFragment
      ...PhraseToWordTranslationFragment
      ...PhraseToPhraseTranslationFragment
    }
  }
}
    ${WordToWordTranslationFragmentFragmentDoc}
${WordToPhraseTranslationFragmentFragmentDoc}
${PhraseToWordTranslationFragmentFragmentDoc}
${PhraseToPhraseTranslationFragmentFragmentDoc}`;
export type UpsertSiteTextTranslationMutationFn = Apollo.MutationFunction<UpsertSiteTextTranslationMutation, UpsertSiteTextTranslationMutationVariables>;

/**
 * __useUpsertSiteTextTranslationMutation__
 *
 * To run a mutation, you first call `useUpsertSiteTextTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertSiteTextTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertSiteTextTranslationMutation, { data, loading, error }] = useUpsertSiteTextTranslationMutation({
 *   variables: {
 *      site_text_id: // value for 'site_text_id'
 *      is_word_definition: // value for 'is_word_definition'
 *      translationlike_string: // value for 'translationlike_string'
 *      definitionlike_string: // value for 'definitionlike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useUpsertSiteTextTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpsertSiteTextTranslationMutation, UpsertSiteTextTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertSiteTextTranslationMutation, UpsertSiteTextTranslationMutationVariables>(UpsertSiteTextTranslationDocument, options);
      }
export type UpsertSiteTextTranslationMutationHookResult = ReturnType<typeof useUpsertSiteTextTranslationMutation>;
export type UpsertSiteTextTranslationMutationResult = Apollo.MutationResult<UpsertSiteTextTranslationMutation>;
export type UpsertSiteTextTranslationMutationOptions = Apollo.BaseMutationOptions<UpsertSiteTextTranslationMutation, UpsertSiteTextTranslationMutationVariables>;
export const ToggleSiteTextTranslationVoteStatusDocument = gql`
    mutation ToggleSiteTextTranslationVoteStatus($translation_id: ID!, $from_type_is_word: Boolean!, $to_type_is_word: Boolean!, $vote: Boolean!) {
  toggleSiteTextTranslationVoteStatus(
    translation_id: $translation_id
    from_type_is_word: $from_type_is_word
    to_type_is_word: $to_type_is_word
    vote: $vote
  ) {
    error
    vote_status {
      ...SiteTextTranslationVoteStatusFragment
    }
  }
}
    ${SiteTextTranslationVoteStatusFragmentFragmentDoc}`;
export type ToggleSiteTextTranslationVoteStatusMutationFn = Apollo.MutationFunction<ToggleSiteTextTranslationVoteStatusMutation, ToggleSiteTextTranslationVoteStatusMutationVariables>;

/**
 * __useToggleSiteTextTranslationVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleSiteTextTranslationVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleSiteTextTranslationVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleSiteTextTranslationVoteStatusMutation, { data, loading, error }] = useToggleSiteTextTranslationVoteStatusMutation({
 *   variables: {
 *      translation_id: // value for 'translation_id'
 *      from_type_is_word: // value for 'from_type_is_word'
 *      to_type_is_word: // value for 'to_type_is_word'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleSiteTextTranslationVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleSiteTextTranslationVoteStatusMutation, ToggleSiteTextTranslationVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleSiteTextTranslationVoteStatusMutation, ToggleSiteTextTranslationVoteStatusMutationVariables>(ToggleSiteTextTranslationVoteStatusDocument, options);
      }
export type ToggleSiteTextTranslationVoteStatusMutationHookResult = ReturnType<typeof useToggleSiteTextTranslationVoteStatusMutation>;
export type ToggleSiteTextTranslationVoteStatusMutationResult = Apollo.MutationResult<ToggleSiteTextTranslationVoteStatusMutation>;
export type ToggleSiteTextTranslationVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleSiteTextTranslationVoteStatusMutation, ToggleSiteTextTranslationVoteStatusMutationVariables>;
export const GetAllSiteTextLanguageListDocument = gql`
    query GetAllSiteTextLanguageList {
  getAllSiteTextLanguageList {
    error
    site_text_language_list {
      ...SiteTextLanguageFragment
    }
  }
}
    ${SiteTextLanguageFragmentFragmentDoc}`;

/**
 * __useGetAllSiteTextLanguageListQuery__
 *
 * To run a query within a React component, call `useGetAllSiteTextLanguageListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSiteTextLanguageListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSiteTextLanguageListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllSiteTextLanguageListQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSiteTextLanguageListQuery, GetAllSiteTextLanguageListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSiteTextLanguageListQuery, GetAllSiteTextLanguageListQueryVariables>(GetAllSiteTextLanguageListDocument, options);
      }
export function useGetAllSiteTextLanguageListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSiteTextLanguageListQuery, GetAllSiteTextLanguageListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSiteTextLanguageListQuery, GetAllSiteTextLanguageListQueryVariables>(GetAllSiteTextLanguageListDocument, options);
        }
export type GetAllSiteTextLanguageListQueryHookResult = ReturnType<typeof useGetAllSiteTextLanguageListQuery>;
export type GetAllSiteTextLanguageListLazyQueryHookResult = ReturnType<typeof useGetAllSiteTextLanguageListLazyQuery>;
export type GetAllSiteTextLanguageListQueryResult = Apollo.QueryResult<GetAllSiteTextLanguageListQuery, GetAllSiteTextLanguageListQueryVariables>;
export const GetRecommendedTranslationFromSiteTextDefinitionIdDocument = gql`
    query GetRecommendedTranslationFromSiteTextDefinitionID($site_text_id: ID!, $site_text_type_is_word: Boolean!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  getRecommendedTranslationFromSiteTextDefinitionID(
    site_text_id: $site_text_id
    site_text_type_is_word: $site_text_type_is_word
    language_code: $language_code
    dialect_code: $dialect_code
    geo_code: $geo_code
  ) {
    error
    site_text_translation_with_vote {
      ...SiteTextWordToWordTranslationWithVoteFragment
      ...SiteTextWordToPhraseTranslationWithVoteFragment
      ...SiteTextPhraseToWordTranslationWithVoteFragment
      ...SiteTextPhraseToPhraseTranslationWithVoteFragment
    }
  }
}
    ${SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc}
${SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;

/**
 * __useGetRecommendedTranslationFromSiteTextDefinitionIdQuery__
 *
 * To run a query within a React component, call `useGetRecommendedTranslationFromSiteTextDefinitionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedTranslationFromSiteTextDefinitionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedTranslationFromSiteTextDefinitionIdQuery({
 *   variables: {
 *      site_text_id: // value for 'site_text_id'
 *      site_text_type_is_word: // value for 'site_text_type_is_word'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetRecommendedTranslationFromSiteTextDefinitionIdQuery(baseOptions: Apollo.QueryHookOptions<GetRecommendedTranslationFromSiteTextDefinitionIdQuery, GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecommendedTranslationFromSiteTextDefinitionIdQuery, GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables>(GetRecommendedTranslationFromSiteTextDefinitionIdDocument, options);
      }
export function useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecommendedTranslationFromSiteTextDefinitionIdQuery, GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecommendedTranslationFromSiteTextDefinitionIdQuery, GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables>(GetRecommendedTranslationFromSiteTextDefinitionIdDocument, options);
        }
export type GetRecommendedTranslationFromSiteTextDefinitionIdQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromSiteTextDefinitionIdQuery>;
export type GetRecommendedTranslationFromSiteTextDefinitionIdLazyQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromSiteTextDefinitionIdLazyQuery>;
export type GetRecommendedTranslationFromSiteTextDefinitionIdQueryResult = Apollo.QueryResult<GetRecommendedTranslationFromSiteTextDefinitionIdQuery, GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables>;
export const GetAllRecommendedSiteTextTranslationListByLanguageDocument = gql`
    query GetAllRecommendedSiteTextTranslationListByLanguage($language_code: String!, $dialect_code: String, $geo_code: String) {
  getAllRecommendedSiteTextTranslationListByLanguage(
    language_code: $language_code
    dialect_code: $dialect_code
    geo_code: $geo_code
  ) {
    error
    site_text_translation_with_vote_list_by_language {
      ...SiteTextTranslationWithVoteListByLanguageFragment
    }
  }
}
    ${SiteTextTranslationWithVoteListByLanguageFragmentFragmentDoc}`;

/**
 * __useGetAllRecommendedSiteTextTranslationListByLanguageQuery__
 *
 * To run a query within a React component, call `useGetAllRecommendedSiteTextTranslationListByLanguageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRecommendedSiteTextTranslationListByLanguageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRecommendedSiteTextTranslationListByLanguageQuery({
 *   variables: {
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetAllRecommendedSiteTextTranslationListByLanguageQuery(baseOptions: Apollo.QueryHookOptions<GetAllRecommendedSiteTextTranslationListByLanguageQuery, GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRecommendedSiteTextTranslationListByLanguageQuery, GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables>(GetAllRecommendedSiteTextTranslationListByLanguageDocument, options);
      }
export function useGetAllRecommendedSiteTextTranslationListByLanguageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRecommendedSiteTextTranslationListByLanguageQuery, GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRecommendedSiteTextTranslationListByLanguageQuery, GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables>(GetAllRecommendedSiteTextTranslationListByLanguageDocument, options);
        }
export type GetAllRecommendedSiteTextTranslationListByLanguageQueryHookResult = ReturnType<typeof useGetAllRecommendedSiteTextTranslationListByLanguageQuery>;
export type GetAllRecommendedSiteTextTranslationListByLanguageLazyQueryHookResult = ReturnType<typeof useGetAllRecommendedSiteTextTranslationListByLanguageLazyQuery>;
export type GetAllRecommendedSiteTextTranslationListByLanguageQueryResult = Apollo.QueryResult<GetAllRecommendedSiteTextTranslationListByLanguageQuery, GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables>;
export const GetAllRecommendedSiteTextTranslationListDocument = gql`
    query GetAllRecommendedSiteTextTranslationList {
  getAllRecommendedSiteTextTranslationList {
    error
    site_text_translation_with_vote_list_by_language_list {
      ...SiteTextTranslationWithVoteListByLanguageFragment
    }
  }
}
    ${SiteTextTranslationWithVoteListByLanguageFragmentFragmentDoc}`;

/**
 * __useGetAllRecommendedSiteTextTranslationListQuery__
 *
 * To run a query within a React component, call `useGetAllRecommendedSiteTextTranslationListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRecommendedSiteTextTranslationListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRecommendedSiteTextTranslationListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRecommendedSiteTextTranslationListQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRecommendedSiteTextTranslationListQuery, GetAllRecommendedSiteTextTranslationListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRecommendedSiteTextTranslationListQuery, GetAllRecommendedSiteTextTranslationListQueryVariables>(GetAllRecommendedSiteTextTranslationListDocument, options);
      }
export function useGetAllRecommendedSiteTextTranslationListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRecommendedSiteTextTranslationListQuery, GetAllRecommendedSiteTextTranslationListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRecommendedSiteTextTranslationListQuery, GetAllRecommendedSiteTextTranslationListQueryVariables>(GetAllRecommendedSiteTextTranslationListDocument, options);
        }
export type GetAllRecommendedSiteTextTranslationListQueryHookResult = ReturnType<typeof useGetAllRecommendedSiteTextTranslationListQuery>;
export type GetAllRecommendedSiteTextTranslationListLazyQueryHookResult = ReturnType<typeof useGetAllRecommendedSiteTextTranslationListLazyQuery>;
export type GetAllRecommendedSiteTextTranslationListQueryResult = Apollo.QueryResult<GetAllRecommendedSiteTextTranslationListQuery, GetAllRecommendedSiteTextTranslationListQueryVariables>;
export const SiteTextUpsertDocument = gql`
    mutation SiteTextUpsert($siteTextlike_string: String!, $definitionlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  siteTextUpsert(
    input: {siteTextlike_string: $siteTextlike_string, definitionlike_string: $definitionlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    site_text_definition {
      ...SiteTextPhraseDefinitionFragment
      ...SiteTextWordDefinitionFragment
    }
  }
}
    ${SiteTextPhraseDefinitionFragmentFragmentDoc}
${SiteTextWordDefinitionFragmentFragmentDoc}`;
export type SiteTextUpsertMutationFn = Apollo.MutationFunction<SiteTextUpsertMutation, SiteTextUpsertMutationVariables>;

/**
 * __useSiteTextUpsertMutation__
 *
 * To run a mutation, you first call `useSiteTextUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSiteTextUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [siteTextUpsertMutation, { data, loading, error }] = useSiteTextUpsertMutation({
 *   variables: {
 *      siteTextlike_string: // value for 'siteTextlike_string'
 *      definitionlike_string: // value for 'definitionlike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useSiteTextUpsertMutation(baseOptions?: Apollo.MutationHookOptions<SiteTextUpsertMutation, SiteTextUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SiteTextUpsertMutation, SiteTextUpsertMutationVariables>(SiteTextUpsertDocument, options);
      }
export type SiteTextUpsertMutationHookResult = ReturnType<typeof useSiteTextUpsertMutation>;
export type SiteTextUpsertMutationResult = Apollo.MutationResult<SiteTextUpsertMutation>;
export type SiteTextUpsertMutationOptions = Apollo.BaseMutationOptions<SiteTextUpsertMutation, SiteTextUpsertMutationVariables>;
export const GetTranslationsByFromDefinitionIdDocument = gql`
    query GetTranslationsByFromDefinitionId($definition_id: ID!, $from_definition_type_is_word: Boolean!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  getTranslationsByFromDefinitionId(
    definition_id: $definition_id
    from_definition_type_is_word: $from_definition_type_is_word
    langInfo: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    translation_with_vote_list {
      ...WordToWordTranslationWithVoteFragment
      ...WordToPhraseTranslationWithVoteFragment
      ...PhraseToWordTranslationWithVoteFragment
      ...PhraseToPhraseTranslationWithVoteFragment
    }
  }
}
    ${WordToWordTranslationWithVoteFragmentFragmentDoc}
${WordToPhraseTranslationWithVoteFragmentFragmentDoc}
${PhraseToWordTranslationWithVoteFragmentFragmentDoc}
${PhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;

/**
 * __useGetTranslationsByFromDefinitionIdQuery__
 *
 * To run a query within a React component, call `useGetTranslationsByFromDefinitionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranslationsByFromDefinitionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranslationsByFromDefinitionIdQuery({
 *   variables: {
 *      definition_id: // value for 'definition_id'
 *      from_definition_type_is_word: // value for 'from_definition_type_is_word'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetTranslationsByFromDefinitionIdQuery(baseOptions: Apollo.QueryHookOptions<GetTranslationsByFromDefinitionIdQuery, GetTranslationsByFromDefinitionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranslationsByFromDefinitionIdQuery, GetTranslationsByFromDefinitionIdQueryVariables>(GetTranslationsByFromDefinitionIdDocument, options);
      }
export function useGetTranslationsByFromDefinitionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranslationsByFromDefinitionIdQuery, GetTranslationsByFromDefinitionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranslationsByFromDefinitionIdQuery, GetTranslationsByFromDefinitionIdQueryVariables>(GetTranslationsByFromDefinitionIdDocument, options);
        }
export type GetTranslationsByFromDefinitionIdQueryHookResult = ReturnType<typeof useGetTranslationsByFromDefinitionIdQuery>;
export type GetTranslationsByFromDefinitionIdLazyQueryHookResult = ReturnType<typeof useGetTranslationsByFromDefinitionIdLazyQuery>;
export type GetTranslationsByFromDefinitionIdQueryResult = Apollo.QueryResult<GetTranslationsByFromDefinitionIdQuery, GetTranslationsByFromDefinitionIdQueryVariables>;
export const GetRecommendedTranslationFromDefinitionIdDocument = gql`
    query GetRecommendedTranslationFromDefinitionID($from_definition_id: ID!, $from_type_is_word: Boolean!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  getRecommendedTranslationFromDefinitionID(
    from_definition_id: $from_definition_id
    from_type_is_word: $from_type_is_word
    langInfo: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    translation_with_vote {
      ...WordToWordTranslationWithVoteFragment
      ...WordToPhraseTranslationWithVoteFragment
      ...PhraseToWordTranslationWithVoteFragment
      ...PhraseToPhraseTranslationWithVoteFragment
    }
  }
}
    ${WordToWordTranslationWithVoteFragmentFragmentDoc}
${WordToPhraseTranslationWithVoteFragmentFragmentDoc}
${PhraseToWordTranslationWithVoteFragmentFragmentDoc}
${PhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;

/**
 * __useGetRecommendedTranslationFromDefinitionIdQuery__
 *
 * To run a query within a React component, call `useGetRecommendedTranslationFromDefinitionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedTranslationFromDefinitionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedTranslationFromDefinitionIdQuery({
 *   variables: {
 *      from_definition_id: // value for 'from_definition_id'
 *      from_type_is_word: // value for 'from_type_is_word'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetRecommendedTranslationFromDefinitionIdQuery(baseOptions: Apollo.QueryHookOptions<GetRecommendedTranslationFromDefinitionIdQuery, GetRecommendedTranslationFromDefinitionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecommendedTranslationFromDefinitionIdQuery, GetRecommendedTranslationFromDefinitionIdQueryVariables>(GetRecommendedTranslationFromDefinitionIdDocument, options);
      }
export function useGetRecommendedTranslationFromDefinitionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecommendedTranslationFromDefinitionIdQuery, GetRecommendedTranslationFromDefinitionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecommendedTranslationFromDefinitionIdQuery, GetRecommendedTranslationFromDefinitionIdQueryVariables>(GetRecommendedTranslationFromDefinitionIdDocument, options);
        }
export type GetRecommendedTranslationFromDefinitionIdQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromDefinitionIdQuery>;
export type GetRecommendedTranslationFromDefinitionIdLazyQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromDefinitionIdLazyQuery>;
export type GetRecommendedTranslationFromDefinitionIdQueryResult = Apollo.QueryResult<GetRecommendedTranslationFromDefinitionIdQuery, GetRecommendedTranslationFromDefinitionIdQueryVariables>;
export const ToggleTranslationVoteStatusDocument = gql`
    mutation ToggleTranslationVoteStatus($translation_id: ID!, $vote: Boolean!, $from_definition_type_is_word: Boolean!, $to_definition_type_is_word: Boolean!) {
  toggleTranslationVoteStatus(
    translation_id: $translation_id
    vote: $vote
    from_definition_type_is_word: $from_definition_type_is_word
    to_definition_type_is_word: $to_definition_type_is_word
  ) {
    error
    translation_vote_status {
      ...WordTrVoteStatusFragment
      ...WordToPhraseTranslationVoteStatusFragment
      ...PhraseToWordTranslationVoteStatusFragment
      ...PhraseToPhraseTranslationVoteStatusFragment
    }
  }
}
    ${WordTrVoteStatusFragmentFragmentDoc}
${WordToPhraseTranslationVoteStatusFragmentFragmentDoc}
${PhraseToWordTranslationVoteStatusFragmentFragmentDoc}
${PhraseToPhraseTranslationVoteStatusFragmentFragmentDoc}`;
export type ToggleTranslationVoteStatusMutationFn = Apollo.MutationFunction<ToggleTranslationVoteStatusMutation, ToggleTranslationVoteStatusMutationVariables>;

/**
 * __useToggleTranslationVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleTranslationVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTranslationVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTranslationVoteStatusMutation, { data, loading, error }] = useToggleTranslationVoteStatusMutation({
 *   variables: {
 *      translation_id: // value for 'translation_id'
 *      vote: // value for 'vote'
 *      from_definition_type_is_word: // value for 'from_definition_type_is_word'
 *      to_definition_type_is_word: // value for 'to_definition_type_is_word'
 *   },
 * });
 */
export function useToggleTranslationVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTranslationVoteStatusMutation, ToggleTranslationVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleTranslationVoteStatusMutation, ToggleTranslationVoteStatusMutationVariables>(ToggleTranslationVoteStatusDocument, options);
      }
export type ToggleTranslationVoteStatusMutationHookResult = ReturnType<typeof useToggleTranslationVoteStatusMutation>;
export type ToggleTranslationVoteStatusMutationResult = Apollo.MutationResult<ToggleTranslationVoteStatusMutation>;
export type ToggleTranslationVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleTranslationVoteStatusMutation, ToggleTranslationVoteStatusMutationVariables>;
export const UpsertTranslationDocument = gql`
    mutation UpsertTranslation($from_definition_id: ID!, $from_definition_type_is_word: Boolean!, $to_definition_id: ID!, $to_definition_type_is_word: Boolean!) {
  upsertTranslation(
    from_definition_id: $from_definition_id
    from_definition_type_is_word: $from_definition_type_is_word
    to_definition_id: $to_definition_id
    to_definition_type_is_word: $to_definition_type_is_word
  ) {
    error
    translation {
      ...WordToWordTranslationFragment
      ...WordToPhraseTranslationFragment
      ...PhraseToWordTranslationFragment
      ...PhraseToPhraseTranslationFragment
    }
  }
}
    ${WordToWordTranslationFragmentFragmentDoc}
${WordToPhraseTranslationFragmentFragmentDoc}
${PhraseToWordTranslationFragmentFragmentDoc}
${PhraseToPhraseTranslationFragmentFragmentDoc}`;
export type UpsertTranslationMutationFn = Apollo.MutationFunction<UpsertTranslationMutation, UpsertTranslationMutationVariables>;

/**
 * __useUpsertTranslationMutation__
 *
 * To run a mutation, you first call `useUpsertTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTranslationMutation, { data, loading, error }] = useUpsertTranslationMutation({
 *   variables: {
 *      from_definition_id: // value for 'from_definition_id'
 *      from_definition_type_is_word: // value for 'from_definition_type_is_word'
 *      to_definition_id: // value for 'to_definition_id'
 *      to_definition_type_is_word: // value for 'to_definition_type_is_word'
 *   },
 * });
 */
export function useUpsertTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTranslationMutation, UpsertTranslationMutationVariables>(UpsertTranslationDocument, options);
      }
export type UpsertTranslationMutationHookResult = ReturnType<typeof useUpsertTranslationMutation>;
export type UpsertTranslationMutationResult = Apollo.MutationResult<UpsertTranslationMutation>;
export type UpsertTranslationMutationOptions = Apollo.BaseMutationOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>;
export const UpsertTranslationFromWordAndDefinitionlikeStringDocument = gql`
    mutation UpsertTranslationFromWordAndDefinitionlikeString($from_definition_id: ID!, $from_definition_type_is_word: Boolean!, $word_or_phrase: String!, $definition: String!, $is_type_word: Boolean!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  upsertTranslationFromWordAndDefinitionlikeString(
    from_definition_id: $from_definition_id
    from_definition_type_is_word: $from_definition_type_is_word
    to_definition_input: {word_or_phrase: $word_or_phrase, definition: $definition, is_type_word: $is_type_word, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    translation {
      ...WordToWordTranslationFragment
      ...WordToPhraseTranslationFragment
      ...PhraseToWordTranslationFragment
      ...PhraseToPhraseTranslationFragment
    }
  }
}
    ${WordToWordTranslationFragmentFragmentDoc}
${WordToPhraseTranslationFragmentFragmentDoc}
${PhraseToWordTranslationFragmentFragmentDoc}
${PhraseToPhraseTranslationFragmentFragmentDoc}`;
export type UpsertTranslationFromWordAndDefinitionlikeStringMutationFn = Apollo.MutationFunction<UpsertTranslationFromWordAndDefinitionlikeStringMutation, UpsertTranslationFromWordAndDefinitionlikeStringMutationVariables>;

/**
 * __useUpsertTranslationFromWordAndDefinitionlikeStringMutation__
 *
 * To run a mutation, you first call `useUpsertTranslationFromWordAndDefinitionlikeStringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTranslationFromWordAndDefinitionlikeStringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTranslationFromWordAndDefinitionlikeStringMutation, { data, loading, error }] = useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
 *   variables: {
 *      from_definition_id: // value for 'from_definition_id'
 *      from_definition_type_is_word: // value for 'from_definition_type_is_word'
 *      word_or_phrase: // value for 'word_or_phrase'
 *      definition: // value for 'definition'
 *      is_type_word: // value for 'is_type_word'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useUpsertTranslationFromWordAndDefinitionlikeStringMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTranslationFromWordAndDefinitionlikeStringMutation, UpsertTranslationFromWordAndDefinitionlikeStringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTranslationFromWordAndDefinitionlikeStringMutation, UpsertTranslationFromWordAndDefinitionlikeStringMutationVariables>(UpsertTranslationFromWordAndDefinitionlikeStringDocument, options);
      }
export type UpsertTranslationFromWordAndDefinitionlikeStringMutationHookResult = ReturnType<typeof useUpsertTranslationFromWordAndDefinitionlikeStringMutation>;
export type UpsertTranslationFromWordAndDefinitionlikeStringMutationResult = Apollo.MutationResult<UpsertTranslationFromWordAndDefinitionlikeStringMutation>;
export type UpsertTranslationFromWordAndDefinitionlikeStringMutationOptions = Apollo.BaseMutationOptions<UpsertTranslationFromWordAndDefinitionlikeStringMutation, UpsertTranslationFromWordAndDefinitionlikeStringMutationVariables>;
export const UpsertWordDefinitionFromWordAndDefinitionlikeStringDocument = gql`
    mutation UpsertWordDefinitionFromWordAndDefinitionlikeString($wordlike_string: String!, $definitionlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  upsertWordDefinitionFromWordAndDefinitionlikeString(
    input: {wordlike_string: $wordlike_string, definitionlike_string: $definitionlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    word_definition {
      ...WordDefinitionFragment
    }
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationFn = Apollo.MutationFunction<UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation, UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables>;

/**
 * __useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation__
 *
 * To run a mutation, you first call `useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertWordDefinitionFromWordAndDefinitionlikeStringMutation, { data, loading, error }] = useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation({
 *   variables: {
 *      wordlike_string: // value for 'wordlike_string'
 *      definitionlike_string: // value for 'definitionlike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation(baseOptions?: Apollo.MutationHookOptions<UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation, UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation, UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables>(UpsertWordDefinitionFromWordAndDefinitionlikeStringDocument, options);
      }
export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationHookResult = ReturnType<typeof useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation>;
export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationResult = Apollo.MutationResult<UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation>;
export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationOptions = Apollo.BaseMutationOptions<UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation, UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables>;
export const UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringDocument = gql`
    mutation UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString($phraselike_string: String!, $definitionlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  upsertPhraseDefinitionFromPhraseAndDefinitionlikeString(
    input: {phraselike_string: $phraselike_string, definitionlike_string: $definitionlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    phrase_definition {
      ...PhraseDefinitionFragment
    }
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationFn = Apollo.MutationFunction<UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation, UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables>;

/**
 * __useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation__
 *
 * To run a mutation, you first call `useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation, { data, loading, error }] = useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation({
 *   variables: {
 *      phraselike_string: // value for 'phraselike_string'
 *      definitionlike_string: // value for 'definitionlike_string'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation, UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation, UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables>(UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringDocument, options);
      }
export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationHookResult = ReturnType<typeof useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation>;
export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationResult = Apollo.MutationResult<UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation>;
export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationOptions = Apollo.BaseMutationOptions<UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation, UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables>;
export const UserReadDocument = gql`
    query UserRead($userId: ID!) {
  userReadResolver(input: {user_id: $userId}) {
    error
    user {
      avatar
      avatar_url
      user_id
    }
  }
}
    `;

/**
 * __useUserReadQuery__
 *
 * To run a query within a React component, call `useUserReadQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReadQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserReadQuery(baseOptions: Apollo.QueryHookOptions<UserReadQuery, UserReadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserReadQuery, UserReadQueryVariables>(UserReadDocument, options);
      }
export function useUserReadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReadQuery, UserReadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserReadQuery, UserReadQueryVariables>(UserReadDocument, options);
        }
export type UserReadQueryHookResult = ReturnType<typeof useUserReadQuery>;
export type UserReadLazyQueryHookResult = ReturnType<typeof useUserReadLazyQuery>;
export type UserReadQueryResult = Apollo.QueryResult<UserReadQuery, UserReadQueryVariables>;
export const AvatarUpdateDocument = gql`
    mutation AvatarUpdate($avatar: String!) {
  avatarUpdateResolver(input: {avatar: $avatar}) {
    error
    user {
      avatar
      avatar_url
      user_id
    }
  }
}
    `;
export type AvatarUpdateMutationFn = Apollo.MutationFunction<AvatarUpdateMutation, AvatarUpdateMutationVariables>;

/**
 * __useAvatarUpdateMutation__
 *
 * To run a mutation, you first call `useAvatarUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAvatarUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [avatarUpdateMutation, { data, loading, error }] = useAvatarUpdateMutation({
 *   variables: {
 *      avatar: // value for 'avatar'
 *   },
 * });
 */
export function useAvatarUpdateMutation(baseOptions?: Apollo.MutationHookOptions<AvatarUpdateMutation, AvatarUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AvatarUpdateMutation, AvatarUpdateMutationVariables>(AvatarUpdateDocument, options);
      }
export type AvatarUpdateMutationHookResult = ReturnType<typeof useAvatarUpdateMutation>;
export type AvatarUpdateMutationResult = Apollo.MutationResult<AvatarUpdateMutation>;
export type AvatarUpdateMutationOptions = Apollo.BaseMutationOptions<AvatarUpdateMutation, AvatarUpdateMutationVariables>;
export const GetFileUploadUrlDocument = gql`
    query GetFileUploadUrl($userId: ID!) {
  fileUploadUrlRequest(input: {user_id: $userId}) {
    error
    url
    avatar_image_url
  }
}
    `;

/**
 * __useGetFileUploadUrlQuery__
 *
 * To run a query within a React component, call `useGetFileUploadUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileUploadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileUploadUrlQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFileUploadUrlQuery(baseOptions: Apollo.QueryHookOptions<GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables>(GetFileUploadUrlDocument, options);
      }
export function useGetFileUploadUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables>(GetFileUploadUrlDocument, options);
        }
export type GetFileUploadUrlQueryHookResult = ReturnType<typeof useGetFileUploadUrlQuery>;
export type GetFileUploadUrlLazyQueryHookResult = ReturnType<typeof useGetFileUploadUrlLazyQuery>;
export type GetFileUploadUrlQueryResult = Apollo.QueryResult<GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables>;
export const ToggleWordTranslationVoteStatusDocument = gql`
    mutation ToggleWordTranslationVoteStatus($word_to_word_translation_id: ID!, $vote: Boolean!) {
  toggleWordTrVoteStatus(
    input: {word_to_word_translation_id: $word_to_word_translation_id, vote: $vote}
  ) {
    vote_status {
      upvotes
      downvotes
      word_to_word_translation_id
    }
    error
  }
}
    `;
export type ToggleWordTranslationVoteStatusMutationFn = Apollo.MutationFunction<ToggleWordTranslationVoteStatusMutation, ToggleWordTranslationVoteStatusMutationVariables>;

/**
 * __useToggleWordTranslationVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleWordTranslationVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleWordTranslationVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleWordTranslationVoteStatusMutation, { data, loading, error }] = useToggleWordTranslationVoteStatusMutation({
 *   variables: {
 *      word_to_word_translation_id: // value for 'word_to_word_translation_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleWordTranslationVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleWordTranslationVoteStatusMutation, ToggleWordTranslationVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleWordTranslationVoteStatusMutation, ToggleWordTranslationVoteStatusMutationVariables>(ToggleWordTranslationVoteStatusDocument, options);
      }
export type ToggleWordTranslationVoteStatusMutationHookResult = ReturnType<typeof useToggleWordTranslationVoteStatusMutation>;
export type ToggleWordTranslationVoteStatusMutationResult = Apollo.MutationResult<ToggleWordTranslationVoteStatusMutation>;
export type ToggleWordTranslationVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleWordTranslationVoteStatusMutation, ToggleWordTranslationVoteStatusMutationVariables>;
export const AddWordAsTranslationForWordDocument = gql`
    mutation AddWordAsTranslationForWord($originalDefinitionId: String!, $translationDefinition: String!, $translationWord: WordUpsertInput!) {
  addWordAsTranslationForWord(
    input: {originalDefinitionId: $originalDefinitionId, translationDefinition: $translationDefinition, translationWord: $translationWord}
  ) {
    wordTranslationId
    error
  }
}
    `;
export type AddWordAsTranslationForWordMutationFn = Apollo.MutationFunction<AddWordAsTranslationForWordMutation, AddWordAsTranslationForWordMutationVariables>;

/**
 * __useAddWordAsTranslationForWordMutation__
 *
 * To run a mutation, you first call `useAddWordAsTranslationForWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddWordAsTranslationForWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addWordAsTranslationForWordMutation, { data, loading, error }] = useAddWordAsTranslationForWordMutation({
 *   variables: {
 *      originalDefinitionId: // value for 'originalDefinitionId'
 *      translationDefinition: // value for 'translationDefinition'
 *      translationWord: // value for 'translationWord'
 *   },
 * });
 */
export function useAddWordAsTranslationForWordMutation(baseOptions?: Apollo.MutationHookOptions<AddWordAsTranslationForWordMutation, AddWordAsTranslationForWordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddWordAsTranslationForWordMutation, AddWordAsTranslationForWordMutationVariables>(AddWordAsTranslationForWordDocument, options);
      }
export type AddWordAsTranslationForWordMutationHookResult = ReturnType<typeof useAddWordAsTranslationForWordMutation>;
export type AddWordAsTranslationForWordMutationResult = Apollo.MutationResult<AddWordAsTranslationForWordMutation>;
export type AddWordAsTranslationForWordMutationOptions = Apollo.BaseMutationOptions<AddWordAsTranslationForWordMutation, AddWordAsTranslationForWordMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "SiteTextDefinition": [
      "SiteTextPhraseDefinition",
      "SiteTextWordDefinition"
    ],
    "SiteTextTranslationWithVote": [
      "SiteTextPhraseToPhraseTranslationWithVote",
      "SiteTextPhraseToWordTranslationWithVote",
      "SiteTextWordToPhraseTranslationWithVote",
      "SiteTextWordToWordTranslationWithVote"
    ],
    "Translation": [
      "PhraseToPhraseTranslation",
      "PhraseToWordTranslation",
      "WordToPhraseTranslation",
      "WordToWordTranslation"
    ],
    "TranslationVoteStatus": [
      "PhraseToPhraseTranslationVoteStatus",
      "PhraseToWordTranslationVoteStatus",
      "WordToPhraseTranslationVoteStatus",
      "WordTrVoteStatus"
    ],
    "TranslationWithVote": [
      "PhraseToPhraseTranslationWithVote",
      "PhraseToWordTranslationWithVote",
      "WordToPhraseTranslationWithVote",
      "WordToWordTranslationWithVote"
    ]
  }
};
      export default result;
    
export const namedOperations = {
  Query: {
    WordDefinitionRead: 'WordDefinitionRead',
    GetWordsByLanguage: 'GetWordsByLanguage',
    GetWordDefinitionsByWordId: 'GetWordDefinitionsByWordId',
    GetWordWithVoteById: 'GetWordWithVoteById',
    GetOrigMapWords: 'GetOrigMapWords',
    GetAllMapsList: 'GetAllMapsList',
    GetTranslatedMapContent: 'GetTranslatedMapContent',
    IsAdminLoggedIn: 'IsAdminLoggedIn',
    GetOrigMapContent: 'GetOrigMapContent',
    PhraseDefinitionRead: 'PhraseDefinitionRead',
    GetPhrasesByLanguage: 'GetPhrasesByLanguage',
    GetPhraseDefinitionsByPhraseId: 'GetPhraseDefinitionsByPhraseId',
    GetPhraseWithVoteById: 'GetPhraseWithVoteById',
    PostRead: 'PostRead',
    GetAllSiteTextDefinitions: 'GetAllSiteTextDefinitions',
    GetAllTranslationFromSiteTextDefinitionID: 'GetAllTranslationFromSiteTextDefinitionID',
    SiteTextWordDefinitionRead: 'SiteTextWordDefinitionRead',
    SiteTextPhraseDefinitionRead: 'SiteTextPhraseDefinitionRead',
    GetAllSiteTextLanguageList: 'GetAllSiteTextLanguageList',
    GetRecommendedTranslationFromSiteTextDefinitionID: 'GetRecommendedTranslationFromSiteTextDefinitionID',
    GetAllRecommendedSiteTextTranslationListByLanguage: 'GetAllRecommendedSiteTextTranslationListByLanguage',
    GetAllRecommendedSiteTextTranslationList: 'GetAllRecommendedSiteTextTranslationList',
    GetTranslationsByFromDefinitionId: 'GetTranslationsByFromDefinitionId',
    GetRecommendedTranslationFromDefinitionID: 'GetRecommendedTranslationFromDefinitionID',
    UserRead: 'UserRead',
    GetFileUploadUrl: 'GetFileUploadUrl'
  },
  Mutation: {
    Register: 'Register',
    Login: 'Login',
    Logout: 'Logout',
    ResetEmailRequest: 'ResetEmailRequest',
    PasswordResetFormRequest: 'PasswordResetFormRequest',
    WordDefinitionUpsert: 'WordDefinitionUpsert',
    ToggleWordDefinitionVoteStatus: 'ToggleWordDefinitionVoteStatus',
    ToggleWordVoteStatus: 'ToggleWordVoteStatus',
    WordUpsert: 'WordUpsert',
    EmailResponse: 'EmailResponse',
    MapUpload: 'MapUpload',
    PhraseDefinitionUpsert: 'PhraseDefinitionUpsert',
    TogglePhraseDefinitionVoteStatus: 'TogglePhraseDefinitionVoteStatus',
    TogglePhraseVoteStatus: 'TogglePhraseVoteStatus',
    PhraseUpsert: 'PhraseUpsert',
    PostCreate: 'PostCreate',
    VersionCreate: 'VersionCreate',
    UpsertSiteTextTranslation: 'UpsertSiteTextTranslation',
    ToggleSiteTextTranslationVoteStatus: 'ToggleSiteTextTranslationVoteStatus',
    SiteTextUpsert: 'SiteTextUpsert',
    ToggleTranslationVoteStatus: 'ToggleTranslationVoteStatus',
    UpsertTranslation: 'UpsertTranslation',
    UpsertTranslationFromWordAndDefinitionlikeString: 'UpsertTranslationFromWordAndDefinitionlikeString',
    UpsertWordDefinitionFromWordAndDefinitionlikeString: 'UpsertWordDefinitionFromWordAndDefinitionlikeString',
    UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString: 'UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString',
    AvatarUpdate: 'AvatarUpdate',
    ToggleWordTranslationVoteStatus: 'ToggleWordTranslationVoteStatus',
    AddWordAsTranslationForWord: 'AddWordAsTranslationForWord'
  },
  Fragment: {
    SessionFields: 'SessionFields',
    WordFragment: 'WordFragment',
    WordDefinitionFragment: 'WordDefinitionFragment',
    WordWithDefinitionsFragment: 'WordWithDefinitionsFragment',
    WordDefinitionWithVoteFragment: 'WordDefinitionWithVoteFragment',
    WordWithVoteFragment: 'WordWithVoteFragment',
    DefinitionVoteStatusFragment: 'DefinitionVoteStatusFragment',
    WordVoteStatusFragment: 'WordVoteStatusFragment',
    PhraseFragment: 'PhraseFragment',
    PhraseDefinitionFragment: 'PhraseDefinitionFragment',
    PhraseWithDefinitionsFragment: 'PhraseWithDefinitionsFragment',
    PhraseDefinitionWithVoteFragment: 'PhraseDefinitionWithVoteFragment',
    PhraseWithVoteFragment: 'PhraseWithVoteFragment',
    PhraseVoteStatusFragment: 'PhraseVoteStatusFragment',
    VersionFields: 'VersionFields',
    PostFields: 'PostFields',
    SiteTextWordToWordTranslationWithVoteFragment: 'SiteTextWordToWordTranslationWithVoteFragment',
    SiteTextWordToPhraseTranslationWithVoteFragment: 'SiteTextWordToPhraseTranslationWithVoteFragment',
    SiteTextPhraseToWordTranslationWithVoteFragment: 'SiteTextPhraseToWordTranslationWithVoteFragment',
    SiteTextPhraseToPhraseTranslationWithVoteFragment: 'SiteTextPhraseToPhraseTranslationWithVoteFragment',
    SiteTextPhraseDefinitionFragment: 'SiteTextPhraseDefinitionFragment',
    SiteTextWordDefinitionFragment: 'SiteTextWordDefinitionFragment',
    SiteTextTranslationVoteStatusFragment: 'SiteTextTranslationVoteStatusFragment',
    SiteTextLanguageFragment: 'SiteTextLanguageFragment',
    SiteTextTranslationWithVoteListByLanguageFragment: 'SiteTextTranslationWithVoteListByLanguageFragment',
    WordToWordTranslationWithVoteFragment: 'WordToWordTranslationWithVoteFragment',
    WordToPhraseTranslationWithVoteFragment: 'WordToPhraseTranslationWithVoteFragment',
    PhraseToWordTranslationWithVoteFragment: 'PhraseToWordTranslationWithVoteFragment',
    PhraseToPhraseTranslationWithVoteFragment: 'PhraseToPhraseTranslationWithVoteFragment',
    WordToWordTranslationFragment: 'WordToWordTranslationFragment',
    WordToPhraseTranslationFragment: 'WordToPhraseTranslationFragment',
    PhraseToWordTranslationFragment: 'PhraseToWordTranslationFragment',
    PhraseToPhraseTranslationFragment: 'PhraseToPhraseTranslationFragment',
    WordTrVoteStatusFragment: 'WordTrVoteStatusFragment',
    WordToPhraseTranslationVoteStatusFragment: 'WordToPhraseTranslationVoteStatusFragment',
    PhraseToWordTranslationVoteStatusFragment: 'PhraseToWordTranslationVoteStatusFragment',
    PhraseToPhraseTranslationVoteStatusFragment: 'PhraseToPhraseTranslationVoteStatusFragment'
  }
}