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

export type Definition = PhraseDefinition | WordDefinition;

export type DefinitionUpdateOutput = {
  __typename?: 'DefinitionUpdateOutput';
  error: ErrorType;
  phrase_definition?: Maybe<PhraseDefinition>;
  word_definition?: Maybe<WordDefinition>;
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
  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseNotFound = 'PhraseNotFound',
  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',
  PrefixInvalid = 'PrefixInvalid',
  PrefixTooLong = 'PrefixTooLong',
  PrefixTooShort = 'PrefixTooShort',
  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',
  SiteTextTranslationNotFound = 'SiteTextTranslationNotFound',
  SiteTextWordDefinitionAlreadyExists = 'SiteTextWordDefinitionAlreadyExists',
  SiteTextWordDefinitionNotFound = 'SiteTextWordDefinitionNotFound',
  TokenInvalid = 'TokenInvalid',
  Unauthorized = 'Unauthorized',
  UnknownError = 'UnknownError',
  WordDefinitionNotFound = 'WordDefinitionNotFound',
  WordInsertFailed = 'WordInsertFailed',
  WordLikeStringInsertFailed = 'WordLikeStringInsertFailed',
  WordNotFound = 'WordNotFound'
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

export type GetOrigMapContentInput = {
  original_map_id: Scalars['ID']['input'];
};

export type GetOrigMapContentOutput = {
  __typename?: 'GetOrigMapContentOutput';
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  map_file_name: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
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

export type LanguageInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
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
  map_file_name: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addWordAsTranslationForWord: AddWordAsTranslationForWordOutput;
  avatarUpdateResolver: AvatarUpdateOutput;
  emailResponseResolver: EmailResponseOutput;
  getPhraseDefinitonToggleVoteStatus: DefinitionVoteStatusOutputRow;
  getWordDefinitonToggleVoteStatus: DefinitionVoteStatusOutputRow;
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
  siteTextPhraseDefinitionUpsert: SiteTextPhraseDefinitionUpsertOutput;
  siteTextTranslationUpsert: SiteTextTranslationUpsertOutput;
  siteTextTranslationVoteUpsert: SiteTextTranslationVoteUpsertOutput;
  siteTextUpsert: SiteTextUpsertOutput;
  siteTextWordDefinitionUpsert: SiteTextWordDefinitionUpsertOutput;
  togglePhraseVoteStatus: PhraseVoteStatusOutputRow;
  toggleVoteStatus: VoteStatusOutputRow;
  toggleWordTrVoteStatus: WordTrVoteStatusOutputRow;
  toggleWordVoteStatus: WordVoteStatusOutputRow;
  updateDefinition: PhraseDefinitionUpsertOutput;
  upsertFromTranslationlikeString: SiteTextTranslationUpsertOutput;
  upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: PhraseDefinitionUpsertOutput;
  upsertTranslation: SiteTextTranslationUpsertOutput;
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


export type MutationGetPhraseDefinitonToggleVoteStatusArgs = {
  phrase_definition_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationGetWordDefinitonToggleVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_definition_id: Scalars['ID']['input'];
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
  input: SiteTextPhraseDefinitionUpsertInput;
};


export type MutationSiteTextTranslationUpsertArgs = {
  input: SiteTextTranslationInput;
};


export type MutationSiteTextTranslationVoteUpsertArgs = {
  input: SiteTextTranslationVoteUpsertInput;
};


export type MutationSiteTextUpsertArgs = {
  input: SiteTextUpsertInput;
};


export type MutationSiteTextWordDefinitionUpsertArgs = {
  input: SiteTextWordDefinitionUpsertInput;
};


export type MutationTogglePhraseVoteStatusArgs = {
  phrase_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationToggleVoteStatusArgs = {
  site_text_translation_id: Scalars['String']['input'];
  vote: Scalars['Boolean']['input'];
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


export type MutationUpsertTranslationArgs = {
  input: SiteTextTranslationUpsertInput;
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
  getAllRecommendedTranslation: SiteTextTranslationWithVoteListOutput;
  getAllSiteTextDefinitions: SiteTextDefinitionListOutput;
  getAllTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteListOutput;
  getOrigMapContent: GetOrigMapContentOutput;
  getOrigMapWords: GetOrigMapWordsOutput;
  getOrigMapsList: GetOrigMapsListOutput;
  getPhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getPhraseDefinitionsByLanguage: PhraseDefinitionWithVoteListOutput;
  getPhraseVoteStatus: PhraseVoteStatusOutputRow;
  getRecommendedTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteOutput;
  getVoteStatus: SiteTextTranslationVoteReadOutput;
  getWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getWordDefinitionsByLanguage: WordDefinitionWithVoteListOutput;
  getWordVoteStatus: WordVoteStatusOutputRow;
  phraseDefinitionRead: PhraseDefinitionReadOutput;
  phraseRead: PhraseReadOutput;
  phraseToPhraseTranslationRead: PhraseToPhraseTranslationReadOutput;
  phraseVoteRead: PhraseVoteOutput;
  postReadResolver: PostReadOutput;
  siteTextPhraseDefinitionRead: SiteTextPhraseDefinitionReadOutput;
  siteTextTranslationRead: SiteTextTranslationReadOutput;
  siteTextTranslationVoteRead: SiteTextTranslationVoteReadOutput;
  siteTextWordDefinitionRead: SiteTextWordDefinitionReadOutput;
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


export type QueryGetAllRecommendedTranslationArgs = {
  dialect_code: Scalars['String']['input'];
  geo_code: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
};


export type QueryGetAllTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['String']['input'];
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


export type QueryGetPhraseVoteStatusArgs = {
  phrase_id: Scalars['ID']['input'];
};


export type QueryGetRecommendedTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code: Scalars['String']['input'];
  geo_code: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['String']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
};


export type QueryGetVoteStatusArgs = {
  site_text_translation_id: Scalars['String']['input'];
};


export type QueryGetWordDefinitionVoteStatusArgs = {
  word_definition_id: Scalars['ID']['input'];
};


export type QueryGetWordDefinitionsByLanguageArgs = {
  input: LanguageInput;
};


export type QueryGetWordVoteStatusArgs = {
  word_id: Scalars['ID']['input'];
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


export type QuerySiteTextTranslationReadArgs = {
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

export type SiteTextDefinitionListOutput = {
  __typename?: 'SiteTextDefinitionListOutput';
  error: ErrorType;
  site_text_phrase_definition_list: Array<Maybe<SiteTextPhraseDefinition>>;
  site_text_word_definition_list: Array<Maybe<SiteTextWordDefinition>>;
};

export type SiteTextPhraseDefinition = {
  __typename?: 'SiteTextPhraseDefinition';
  phrase_definition: PhraseDefinition;
  site_text_id: Scalars['ID']['output'];
};

export type SiteTextPhraseDefinitionReadOutput = {
  __typename?: 'SiteTextPhraseDefinitionReadOutput';
  error: ErrorType;
  site_text_phrase_definition?: Maybe<SiteTextPhraseDefinition>;
};

export type SiteTextPhraseDefinitionUpsertInput = {
  phrase_definition_id: Scalars['ID']['input'];
};

export type SiteTextPhraseDefinitionUpsertOutput = {
  __typename?: 'SiteTextPhraseDefinitionUpsertOutput';
  error: ErrorType;
  site_text_phrase_definition?: Maybe<SiteTextPhraseDefinition>;
};

export type SiteTextTranslation = {
  __typename?: 'SiteTextTranslation';
  from_definition: Definition;
  from_type_is_word: Scalars['Boolean']['output'];
  site_text_translation_id: Scalars['ID']['output'];
  to_definition: Definition;
  to_type_is_word: Scalars['Boolean']['output'];
};

export type SiteTextTranslationInput = {
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  to_definition_id: Scalars['ID']['input'];
  to_type_is_word: Scalars['Boolean']['input'];
};

export type SiteTextTranslationReadOutput = {
  __typename?: 'SiteTextTranslationReadOutput';
  error: ErrorType;
  site_text_translation?: Maybe<SiteTextTranslation>;
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

export type SiteTextTranslationUpsertOutput = {
  __typename?: 'SiteTextTranslationUpsertOutput';
  error: ErrorType;
  site_text_translation?: Maybe<SiteTextTranslation>;
};

export type SiteTextTranslationVote = {
  __typename?: 'SiteTextTranslationVote';
  last_updated_at: Scalars['DateTime']['output'];
  site_text_translation_id: Scalars['ID']['output'];
  site_text_translation_vote_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type SiteTextTranslationVoteReadOutput = {
  __typename?: 'SiteTextTranslationVoteReadOutput';
  error: ErrorType;
  site_text_translation_vote?: Maybe<SiteTextTranslationVote>;
};

export type SiteTextTranslationVoteUpsertInput = {
  site_text_translation_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};

export type SiteTextTranslationVoteUpsertOutput = {
  __typename?: 'SiteTextTranslationVoteUpsertOutput';
  error: ErrorType;
  site_text_translation_vote?: Maybe<SiteTextTranslationVote>;
};

export type SiteTextTranslationWithVote = {
  __typename?: 'SiteTextTranslationWithVote';
  created_at: Scalars['String']['output'];
  downvotes: Scalars['Int']['output'];
  from_definition: Definition;
  from_type_is_word: Scalars['Boolean']['output'];
  site_text_translation_id: Scalars['ID']['output'];
  to_definition: Definition;
  to_type_is_word: Scalars['Boolean']['output'];
  upvotes: Scalars['Int']['output'];
};

export type SiteTextTranslationWithVoteListOutput = {
  __typename?: 'SiteTextTranslationWithVoteListOutput';
  error: ErrorType;
  site_text_translation_with_vote_list: Array<Maybe<SiteTextTranslationWithVote>>;
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

export type SiteTextUpsertOutput = {
  __typename?: 'SiteTextUpsertOutput';
  error: ErrorType;
  site_text_phrase_definition?: Maybe<SiteTextPhraseDefinition>;
  site_text_word_definition?: Maybe<SiteTextWordDefinition>;
};

export type SiteTextWordDefinition = {
  __typename?: 'SiteTextWordDefinition';
  site_text_id: Scalars['ID']['output'];
  word_definition: WordDefinition;
};

export type SiteTextWordDefinitionReadOutput = {
  __typename?: 'SiteTextWordDefinitionReadOutput';
  error: ErrorType;
  site_text_word_definition?: Maybe<SiteTextWordDefinition>;
};

export type SiteTextWordDefinitionUpsertInput = {
  word_definition_id: Scalars['ID']['input'];
};

export type SiteTextWordDefinitionUpsertOutput = {
  __typename?: 'SiteTextWordDefinitionUpsertOutput';
  error: ErrorType;
  site_text_word_definition?: Maybe<SiteTextWordDefinition>;
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

export type VoteStatus = {
  __typename?: 'VoteStatus';
  downvotes: Scalars['Int']['output'];
  site_text_translation_id: Scalars['String']['output'];
  upvotes: Scalars['Int']['output'];
};

export type VoteStatusOutputRow = {
  __typename?: 'VoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<VoteStatus>;
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

export type PhraseFragmentFragment = { __typename?: 'Phrase', phrase_id: string, phrase: string };

export type WordFragmentFragment = { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type WordDefinitionFragmentFragment = { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type PhraseDefinitionFragmentFragment = { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } };

export type SiteTextPhraseDefinitionFragmentFragment = { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } };

export type SiteTextWordDefinitionFragmentFragment = { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextTranslationWithVote', site_text_translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, upvotes: number, downvotes: number, created_at: string, from_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextTranslationFragmentFragment = { __typename?: 'SiteTextTranslation', site_text_translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, from_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type VoteStatusFragmentFragment = { __typename?: 'VoteStatus', upvotes: number, downvotes: number, site_text_translation_id: string };

export type GetAllSiteTextDefinitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSiteTextDefinitionsQuery = { __typename?: 'Query', getAllSiteTextDefinitions: { __typename?: 'SiteTextDefinitionListOutput', error: ErrorType, site_text_phrase_definition_list: Array<{ __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } } | null>, site_text_word_definition_list: Array<{ __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } };

export type GetAllTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['String']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
}>;


export type GetAllTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getAllTranslationFromSiteTextDefinitionID: { __typename?: 'SiteTextTranslationWithVoteListOutput', error: ErrorType, site_text_translation_with_vote_list: Array<{ __typename?: 'SiteTextTranslationWithVote', site_text_translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, upvotes: number, downvotes: number, created_at: string, from_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } };

export type SiteTextWordDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextWordDefinitionReadQuery = { __typename?: 'Query', siteTextWordDefinitionRead: { __typename?: 'SiteTextWordDefinitionReadOutput', error: ErrorType, site_text_word_definition?: { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type SiteTextPhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextPhraseDefinitionReadQuery = { __typename?: 'Query', siteTextPhraseDefinitionRead: { __typename?: 'SiteTextPhraseDefinitionReadOutput', error: ErrorType, site_text_phrase_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } } | null } };

export type UpsertTranslationMutationVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
  translationlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertTranslationMutation = { __typename?: 'Mutation', upsertTranslation: { __typename?: 'SiteTextTranslationUpsertOutput', error: ErrorType, site_text_translation?: { __typename?: 'SiteTextTranslation', site_text_translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, from_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string } } | { __typename?: 'WordDefinition', word_definition_id: string, definition: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type ToggleVoteStatusMutationVariables = Exact<{
  site_text_translation_id: Scalars['String']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleVoteStatusMutation = { __typename?: 'Mutation', toggleVoteStatus: { __typename?: 'VoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'VoteStatus', upvotes: number, downvotes: number, site_text_translation_id: string } | null } };

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
export const PhraseFragmentFragmentDoc = gql`
    fragment PhraseFragment on Phrase {
  phrase_id
  phrase
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
export const SiteTextPhraseDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextPhraseDefinitionFragment on SiteTextPhraseDefinition {
  site_text_id
  phrase_definition {
    ...PhraseDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
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
export const SiteTextWordDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextWordDefinitionFragment on SiteTextWordDefinition {
  site_text_id
  word_definition {
    ...WordDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const SiteTextTranslationWithVoteFragmentFragmentDoc = gql`
    fragment SiteTextTranslationWithVoteFragment on SiteTextTranslationWithVote {
  site_text_translation_id
  from_definition {
    ...WordDefinitionFragment
    ...PhraseDefinitionFragment
  }
  to_definition {
    ...WordDefinitionFragment
    ...PhraseDefinitionFragment
  }
  from_type_is_word
  to_type_is_word
  upvotes
  downvotes
  created_at
}
    ${WordDefinitionFragmentFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextTranslationFragmentFragmentDoc = gql`
    fragment SiteTextTranslationFragment on SiteTextTranslation {
  site_text_translation_id
  from_definition {
    ...WordDefinitionFragment
    ...PhraseDefinitionFragment
  }
  to_definition {
    ...WordDefinitionFragment
    ...PhraseDefinitionFragment
  }
  from_type_is_word
  to_type_is_word
}
    ${WordDefinitionFragmentFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const VoteStatusFragmentFragmentDoc = gql`
    fragment VoteStatusFragment on VoteStatus {
  upvotes
  downvotes
  site_text_translation_id
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
    query GetAllSiteTextDefinitions {
  getAllSiteTextDefinitions {
    error
    site_text_phrase_definition_list {
      ...SiteTextPhraseDefinitionFragment
    }
    site_text_word_definition_list {
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
    query GetAllTranslationFromSiteTextDefinitionID($dialect_code: String, $geo_code: String, $language_code: String!, $site_text_id: String!, $site_text_type_is_word: Boolean!) {
  getAllTranslationFromSiteTextDefinitionID(
    dialect_code: $dialect_code
    geo_code: $geo_code
    language_code: $language_code
    site_text_id: $site_text_id
    site_text_type_is_word: $site_text_type_is_word
  ) {
    error
    site_text_translation_with_vote_list {
      ...SiteTextTranslationWithVoteFragment
    }
  }
}
    ${SiteTextTranslationWithVoteFragmentFragmentDoc}`;

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
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *      language_code: // value for 'language_code'
 *      site_text_id: // value for 'site_text_id'
 *      site_text_type_is_word: // value for 'site_text_type_is_word'
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
export const UpsertTranslationDocument = gql`
    mutation UpsertTranslation($site_text_id: ID!, $is_word_definition: Boolean!, $translationlike_string: String!, $definitionlike_string: String!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  upsertTranslation(
    input: {site_text_id: $site_text_id, is_word_definition: $is_word_definition, translationlike_string: $translationlike_string, definitionlike_string: $definitionlike_string, language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code}
  ) {
    error
    site_text_translation {
      ...SiteTextTranslationFragment
    }
  }
}
    ${SiteTextTranslationFragmentFragmentDoc}`;
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
export function useUpsertTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTranslationMutation, UpsertTranslationMutationVariables>(UpsertTranslationDocument, options);
      }
export type UpsertTranslationMutationHookResult = ReturnType<typeof useUpsertTranslationMutation>;
export type UpsertTranslationMutationResult = Apollo.MutationResult<UpsertTranslationMutation>;
export type UpsertTranslationMutationOptions = Apollo.BaseMutationOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>;
export const ToggleVoteStatusDocument = gql`
    mutation ToggleVoteStatus($site_text_translation_id: String!, $vote: Boolean!) {
  toggleVoteStatus(
    site_text_translation_id: $site_text_translation_id
    vote: $vote
  ) {
    error
    vote_status {
      ...VoteStatusFragment
    }
  }
}
    ${VoteStatusFragmentFragmentDoc}`;
export type ToggleVoteStatusMutationFn = Apollo.MutationFunction<ToggleVoteStatusMutation, ToggleVoteStatusMutationVariables>;

/**
 * __useToggleVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleVoteStatusMutation, { data, loading, error }] = useToggleVoteStatusMutation({
 *   variables: {
 *      site_text_translation_id: // value for 'site_text_translation_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleVoteStatusMutation, ToggleVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleVoteStatusMutation, ToggleVoteStatusMutationVariables>(ToggleVoteStatusDocument, options);
      }
export type ToggleVoteStatusMutationHookResult = ReturnType<typeof useToggleVoteStatusMutation>;
export type ToggleVoteStatusMutationResult = Apollo.MutationResult<ToggleVoteStatusMutation>;
export type ToggleVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleVoteStatusMutation, ToggleVoteStatusMutationVariables>;
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
    "Definition": [
      "PhraseDefinition",
      "WordDefinition"
    ]
  }
};
      export default result;
    
export const namedOperations = {
  Query: {
    GetOrigMapWords: 'GetOrigMapWords',
    PostRead: 'PostRead',
    GetAllSiteTextDefinitions: 'GetAllSiteTextDefinitions',
    GetAllTranslationFromSiteTextDefinitionID: 'GetAllTranslationFromSiteTextDefinitionID',
    SiteTextWordDefinitionRead: 'SiteTextWordDefinitionRead',
    SiteTextPhraseDefinitionRead: 'SiteTextPhraseDefinitionRead',
    UserRead: 'UserRead',
    GetFileUploadUrl: 'GetFileUploadUrl'
  },
  Mutation: {
    Register: 'Register',
    Login: 'Login',
    Logout: 'Logout',
    ResetEmailRequest: 'ResetEmailRequest',
    PasswordResetFormRequest: 'PasswordResetFormRequest',
    EmailResponse: 'EmailResponse',
    PostCreate: 'PostCreate',
    VersionCreate: 'VersionCreate',
    UpsertTranslation: 'UpsertTranslation',
    ToggleVoteStatus: 'ToggleVoteStatus',
    AvatarUpdate: 'AvatarUpdate',
    ToggleWordTranslationVoteStatus: 'ToggleWordTranslationVoteStatus',
    AddWordAsTranslationForWord: 'AddWordAsTranslationForWord'
  },
  Fragment: {
    SessionFields: 'SessionFields',
    VersionFields: 'VersionFields',
    PostFields: 'PostFields',
    PhraseFragment: 'PhraseFragment',
    WordFragment: 'WordFragment',
    WordDefinitionFragment: 'WordDefinitionFragment',
    PhraseDefinitionFragment: 'PhraseDefinitionFragment',
    SiteTextPhraseDefinitionFragment: 'SiteTextPhraseDefinitionFragment',
    SiteTextWordDefinitionFragment: 'SiteTextWordDefinitionFragment',
    SiteTextTranslationWithVoteFragment: 'SiteTextTranslationWithVoteFragment',
    SiteTextTranslationFragment: 'SiteTextTranslationFragment',
    VoteStatusFragment: 'VoteStatusFragment'
  }
}