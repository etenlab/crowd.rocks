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

export type AddNotificationInput = {
  text: Scalars['String']['input'];
  user_id: Scalars['ID']['input'];
};

export type AddNotificationOutput = {
  __typename?: 'AddNotificationOutput';
  error: ErrorType;
  notification?: Maybe<Notification>;
};

export type Answer = {
  __typename?: 'Answer';
  answer?: Maybe<Scalars['String']['output']>;
  answer_id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  question_id: Scalars['String']['output'];
  question_items: Array<QuestionItem>;
};

export type AnswerUpsertInput = {
  answer: Scalars['String']['input'];
  question_id: Scalars['ID']['input'];
  question_item_ids: Array<Scalars['String']['input']>;
};

export type AnswersOutput = {
  __typename?: 'AnswersOutput';
  answers: Array<Maybe<Answer>>;
  error: ErrorType;
};

export type AvatarUpdateInput = {
  avatar: Scalars['String']['input'];
};

export type AvatarUpdateOutput = {
  __typename?: 'AvatarUpdateOutput';
  error: ErrorType;
  user?: Maybe<User>;
};

export enum BotType {
  DeepL = 'DeepL',
  Gpt4 = 'GPT4',
  Gpt35 = 'GPT35',
  Google = 'Google',
  Lilt = 'Lilt',
  Smartcat = 'Smartcat'
}

export type CreateQuestionOnWordRangeUpsertInput = {
  begin_document_word_entry_id: Scalars['ID']['input'];
  end_document_word_entry_id: Scalars['ID']['input'];
  question: Scalars['String']['input'];
  question_items: Array<Scalars['String']['input']>;
  question_type_is_multiselect: Scalars['Boolean']['input'];
};

export type DataGenInput = {
  mapAmount?: InputMaybe<Scalars['Int']['input']>;
  mapsToLanguages?: InputMaybe<Array<LanguageInput>>;
  phraseAmount?: InputMaybe<Scalars['Int']['input']>;
  userAmount?: InputMaybe<Scalars['Int']['input']>;
  wordAmount?: InputMaybe<Scalars['Int']['input']>;
};

export type DataGenProgress = {
  __typename?: 'DataGenProgress';
  output: Scalars['String']['output'];
  overallStatus: SubscriptionStatus;
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

export type DocumentEdge = {
  __typename?: 'DocumentEdge';
  cursor: Scalars['ID']['output'];
  node: TextyDocument;
};

export type DocumentListConnection = {
  __typename?: 'DocumentListConnection';
  edges: Array<DocumentEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type DocumentUploadInput = {
  document: TextyDocumentInput;
};

export type DocumentUploadOutput = {
  __typename?: 'DocumentUploadOutput';
  document?: Maybe<TextyDocument>;
  error: ErrorType;
};

export type DocumentWordEntriesEdge = {
  __typename?: 'DocumentWordEntriesEdge';
  cursor: Scalars['ID']['output'];
  node: Array<DocumentWordEntry>;
};

export type DocumentWordEntriesListConnection = {
  __typename?: 'DocumentWordEntriesListConnection';
  edges: Array<DocumentWordEntriesEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type DocumentWordEntry = {
  __typename?: 'DocumentWordEntry';
  document_id: Scalars['String']['output'];
  document_word_entry_id: Scalars['ID']['output'];
  page: Scalars['Int']['output'];
  parent_document_word_entry_id?: Maybe<Scalars['String']['output']>;
  wordlike_string: WordlikeString;
};

export type EmailResponseInput = {
  token: Scalars['String']['input'];
};

export type EmailResponseOutput = {
  __typename?: 'EmailResponseOutput';
  error: ErrorType;
};

export enum ErrorType {
  AnswerInsertFailed = 'AnswerInsertFailed',
  AvatarNotFound = 'AvatarNotFound',
  AvatarTooLong = 'AvatarTooLong',
  AvatarTooShort = 'AvatarTooShort',
  AvatarUnavailable = 'AvatarUnavailable',
  BotTranslationBotNotFound = 'BotTranslationBotNotFound',
  BotTranslationError = 'BotTranslationError',
  BotTranslationLanguagesListError = 'BotTranslationLanguagesListError',
  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',
  DamagedDocumentWordEntryBlock = 'DamagedDocumentWordEntryBlock',
  DocumentEntryReadError = 'DocumentEntryReadError',
  DocumentIdNotProvided = 'DocumentIdNotProvided',
  DocumentNotFound = 'DocumentNotFound',
  DocumentWordEntryAlreadyExists = 'DocumentWordEntryAlreadyExists',
  DocumentWordEntryInsertFailed = 'DocumentWordEntryInsertFailed',
  DocumentWordEntryNotFound = 'DocumentWordEntryNotFound',
  ElectionNotFound = 'ElectionNotFound',
  EmailInvalid = 'EmailInvalid',
  EmailIsBlocked = 'EmailIsBlocked',
  EmailNotFound = 'EmailNotFound',
  EmailTooLong = 'EmailTooLong',
  EmailTooShort = 'EmailTooShort',
  EmailUnavailable = 'EmailUnavailable',
  FileDeleteFailed = 'FileDeleteFailed',
  FileNotExists = 'FileNotExists',
  FileSaveFailed = 'FileSaveFailed',
  FileWithFilenameAlreadyExists = 'FileWithFilenameAlreadyExists',
  FolderForThreadNotExists = 'FolderForThreadNotExists',
  FolderIdNotDefined = 'FolderIdNotDefined',
  ForumDeleteFailed = 'ForumDeleteFailed',
  ForumFolderDeleteFailed = 'ForumFolderDeleteFailed',
  ForumFolderUpsertFailed = 'ForumFolderUpsertFailed',
  ForumForFolderNotExists = 'ForumForFolderNotExists',
  ForumIdNotDefined = 'ForumIdNotDefined',
  ForumUpsertFailed = 'ForumUpsertFailed',
  InvalidEmailOrPassword = 'InvalidEmailOrPassword',
  InvalidInputs = 'InvalidInputs',
  LimitInvalid = 'LimitInvalid',
  MapDeletionError = 'MapDeletionError',
  MapFilenameAlreadyExists = 'MapFilenameAlreadyExists',
  MapInsertFailed = 'MapInsertFailed',
  MapNotFound = 'MapNotFound',
  MapParsingError = 'MapParsingError',
  MapSavingError = 'MapSavingError',
  MapTranslationError = 'MapTranslationError',
  MapVoteNotFound = 'MapVoteNotFound',
  MapWordsAndPhrasesSearchError = 'MapWordsAndPhrasesSearchError',
  MapZippingError = 'MapZippingError',
  NoError = 'NoError',
  NotificationDeleteFailed = 'NotificationDeleteFailed',
  NotificationInsertFailed = 'NotificationInsertFailed',
  OffsetInvalid = 'OffsetInvalid',
  PaginationError = 'PaginationError',
  ParentElectionNotFound = 'ParentElectionNotFound',
  PasswordInvalid = 'PasswordInvalid',
  PasswordTooLong = 'PasswordTooLong',
  PasswordTooShort = 'PasswordTooShort',
  PericopeInsertFailed = 'PericopeInsertFailed',
  PericopeNotFound = 'PericopeNotFound',
  PericopeVoteToggleFailed = 'PericopeVoteToggleFailed',
  PhraseDefinitionAlreadyExists = 'PhraseDefinitionAlreadyExists',
  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseDefinitionVoteNotFound = 'PhraseDefinitionVoteNotFound',
  PhraseNotFound = 'PhraseNotFound',
  PhraseToPhraseTranslationNotFound = 'PhraseToPhraseTranslationNotFound',
  PhraseToWordTranslationNotFound = 'PhraseToWordTranslationNotFound',
  PhraseVoteNotFound = 'PhraseVoteNotFound',
  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',
  PostDeleteFailed = 'PostDeleteFailed',
  PostNotFound = 'PostNotFound',
  PrefixInvalid = 'PrefixInvalid',
  PrefixTooLong = 'PrefixTooLong',
  PrefixTooShort = 'PrefixTooShort',
  ProvidedIdIsMalformed = 'ProvidedIdIsMalformed',
  QuestionInsertFailed = 'QuestionInsertFailed',
  QuestionItemInsertFailed = 'QuestionItemInsertFailed',
  RankInvalid = 'RankInvalid',
  RankUnchanged = 'RankUnchanged',
  SiteTextPhraseDefinitionAlreadyExists = 'SiteTextPhraseDefinitionAlreadyExists',
  SiteTextPhraseDefinitionNotFound = 'SiteTextPhraseDefinitionNotFound',
  SiteTextWordDefinitionAlreadyExists = 'SiteTextWordDefinitionAlreadyExists',
  SiteTextWordDefinitionNotFound = 'SiteTextWordDefinitionNotFound',
  ThreadUpsertFailed = 'ThreadUpsertFailed',
  TokenInvalid = 'TokenInvalid',
  Unauthorized = 'Unauthorized',
  UnknownError = 'UnknownError',
  WordDefinitionAlreadyExists = 'WordDefinitionAlreadyExists',
  WordDefinitionNotFound = 'WordDefinitionNotFound',
  WordDefinitionVoteNotFound = 'WordDefinitionVoteNotFound',
  WordInsertFailed = 'WordInsertFailed',
  WordLikeStringInsertFailed = 'WordLikeStringInsertFailed',
  WordNotFound = 'WordNotFound',
  WordRangeInsertFailed = 'WordRangeInsertFailed',
  WordToPhraseTranslationNotFound = 'WordToPhraseTranslationNotFound',
  WordToWordTranslationNotFound = 'WordToWordTranslationNotFound',
  WordVoteNotFound = 'WordVoteNotFound'
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

export type Flag = {
  __typename?: 'Flag';
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  flag_id: Scalars['ID']['output'];
  name: FlagType;
  parent_id: Scalars['ID']['output'];
  parent_table: Scalars['String']['output'];
};

export enum FlagType {
  FastTranslation = 'FastTranslation'
}

export type FlagsOutput = {
  __typename?: 'FlagsOutput';
  error: ErrorType;
  flags: Array<Flag>;
};

export type Forum = {
  __typename?: 'Forum';
  created_by: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  forum_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ForumDeleteOutput = {
  __typename?: 'ForumDeleteOutput';
  error: ErrorType;
  forum_id: Scalars['ID']['output'];
};

export type ForumEdge = {
  __typename?: 'ForumEdge';
  cursor: Scalars['ID']['output'];
  node: ForumNode;
};

export type ForumFolder = {
  __typename?: 'ForumFolder';
  created_by: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  forum_folder_id: Scalars['ID']['output'];
  forum_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ForumFolderDeleteOutput = {
  __typename?: 'ForumFolderDeleteOutput';
  error: ErrorType;
  forum_folder_id: Scalars['ID']['output'];
};

export type ForumFolderEdge = {
  __typename?: 'ForumFolderEdge';
  cursor: Scalars['ID']['output'];
  node: ForumFolderNode;
};

export type ForumFolderListConnection = {
  __typename?: 'ForumFolderListConnection';
  edges: Array<ForumFolderEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type ForumFolderNode = {
  __typename?: 'ForumFolderNode';
  created_by: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  forum_folder_id: Scalars['ID']['output'];
  forum_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  total_posts: Scalars['Int']['output'];
  total_threads: Scalars['Int']['output'];
};

export type ForumFolderOutput = {
  __typename?: 'ForumFolderOutput';
  error: ErrorType;
  folder?: Maybe<ForumFolder>;
};

export type ForumFolderUpsertInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  forum_folder_id?: InputMaybe<Scalars['ID']['input']>;
  forum_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ForumListConnection = {
  __typename?: 'ForumListConnection';
  edges: Array<ForumEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type ForumNode = {
  __typename?: 'ForumNode';
  created_by: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  forum_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  total_posts: Scalars['Int']['output'];
  total_threads: Scalars['Int']['output'];
  total_topics: Scalars['Int']['output'];
};

export type ForumOutput = {
  __typename?: 'ForumOutput';
  error: ErrorType;
  forum?: Maybe<Forum>;
};

export type ForumUpsertInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  forum_id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
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

export type GenericOutput = {
  __typename?: 'GenericOutput';
  error: ErrorType;
};

export type GetAllMapsListInput = {
  lang?: InputMaybe<LanguageInput>;
};

export type GetDocumentInput = {
  document_id: Scalars['String']['input'];
};

export type GetDocumentOutput = {
  __typename?: 'GetDocumentOutput';
  document?: Maybe<TextyDocument>;
  error: ErrorType;
};

export type GetMapDetailsInput = {
  is_original: Scalars['Boolean']['input'];
  map_id: Scalars['ID']['input'];
};

export type GetMapWordOrPhraseByDefinitionIdInput = {
  definition_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
};

export type GetOrigMapListInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetOrigMapWordsAndPhrasesInput = {
  filter?: InputMaybe<Scalars['String']['input']>;
  isSortDescending?: InputMaybe<Scalars['Boolean']['input']>;
  lang: LanguageInput;
  onlyNotTranslatedTo?: InputMaybe<LanguageInput>;
  onlyTranslatedTo?: InputMaybe<LanguageInput>;
  original_map_id?: InputMaybe<Scalars['String']['input']>;
  quickFilter?: InputMaybe<Scalars['String']['input']>;
};

export type GetOrigMapsListOutput = {
  __typename?: 'GetOrigMapsListOutput';
  mapList: Array<MapDetailsOutput>;
};

export type IFile = {
  __typename?: 'IFile';
  fileHash: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type IFileOutput = {
  __typename?: 'IFileOutput';
  error: ErrorType;
  file?: Maybe<IFile>;
};

export type IsAdminIdInput = {
  user_id: Scalars['ID']['input'];
};

export type IsAdminIdOutput = {
  __typename?: 'IsAdminIdOutput';
  isAdmin: Scalars['Boolean']['output'];
};

export type LanguageForBotTranslate = {
  __typename?: 'LanguageForBotTranslate';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type LanguageInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
};

export type LanguageListForBotTranslateOutput = {
  __typename?: 'LanguageListForBotTranslateOutput';
  error: ErrorType;
  languages?: Maybe<Array<LanguageForBotTranslate>>;
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

export type MapDeleteInput = {
  is_original: Scalars['Boolean']['input'];
  mapId: Scalars['String']['input'];
};

export type MapDeleteOutput = {
  __typename?: 'MapDeleteOutput';
  deletedMapId?: Maybe<Scalars['String']['output']>;
  error: ErrorType;
};

export type MapDetailsInfo = {
  __typename?: 'MapDetailsInfo';
  content_file_id: Scalars['ID']['output'];
  content_file_url: Scalars['ID']['output'];
  created_at: Scalars['String']['output'];
  created_by: Scalars['ID']['output'];
  is_original: Scalars['Boolean']['output'];
  language: LanguageOutput;
  map_file_name: Scalars['String']['output'];
  map_file_name_with_langs: Scalars['String']['output'];
  original_map_id: Scalars['ID']['output'];
  preview_file_id?: Maybe<Scalars['ID']['output']>;
  preview_file_url?: Maybe<Scalars['ID']['output']>;
  translated_map_id?: Maybe<Scalars['ID']['output']>;
  translated_percent?: Maybe<Scalars['String']['output']>;
};

export type MapDetailsOutput = {
  __typename?: 'MapDetailsOutput';
  error: ErrorType;
  mapDetails?: Maybe<MapDetailsInfo>;
};

export type MapDetailsOutputEdge = {
  __typename?: 'MapDetailsOutputEdge';
  cursor: Scalars['ID']['output'];
  node: MapDetailsOutput;
};

export type MapListConnection = {
  __typename?: 'MapListConnection';
  edges: Array<MapDetailsOutputEdge>;
  pageInfo: PageInfo;
};

export type MapUploadOutput = {
  __typename?: 'MapUploadOutput';
  error: ErrorType;
  mapDetailsOutput?: Maybe<MapDetailsOutput>;
};

export type MapVote = {
  __typename?: 'MapVote';
  is_original: Scalars['Boolean']['output'];
  last_updated_at: Scalars['DateTime']['output'];
  map_id: Scalars['ID']['output'];
  maps_vote_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type MapVoteOutput = {
  __typename?: 'MapVoteOutput';
  error: ErrorType;
  map_vote?: Maybe<MapVote>;
};

export type MapVoteStatus = {
  __typename?: 'MapVoteStatus';
  downvotes: Scalars['Int']['output'];
  is_original: Scalars['Boolean']['output'];
  map_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type MapVoteStatusOutputRow = {
  __typename?: 'MapVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<MapVoteStatus>;
};

export type MapVoteUpsertInput = {
  is_original: Scalars['Boolean']['input'];
  map_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};

export type MapWordOrPhrase = {
  __typename?: 'MapWordOrPhrase';
  id: Scalars['ID']['output'];
  o_created_at: Scalars['DateTime']['output'];
  o_created_by_user: User;
  o_definition: Scalars['String']['output'];
  o_definition_id: Scalars['String']['output'];
  o_dialect_code?: Maybe<Scalars['String']['output']>;
  o_geo_code?: Maybe<Scalars['String']['output']>;
  o_id: Scalars['String']['output'];
  o_language_code: Scalars['String']['output'];
  o_like_string: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type MapWordOrPhraseAsOrig = PhraseWithDefinition | WordWithDefinition;

export type MapWordOrPhraseAsOrigOutput = {
  __typename?: 'MapWordOrPhraseAsOrigOutput';
  error: ErrorType;
  wordOrPhrase?: Maybe<MapWordOrPhraseAsOrig>;
};

export type MapWordsAndPhrasesConnection = {
  __typename?: 'MapWordsAndPhrasesConnection';
  edges: Array<MapWordsAndPhrasesEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type MapWordsAndPhrasesCountOutput = {
  __typename?: 'MapWordsAndPhrasesCountOutput';
  count?: Maybe<Scalars['Float']['output']>;
  error: ErrorType;
};

export type MapWordsAndPhrasesEdge = {
  __typename?: 'MapWordsAndPhrasesEdge';
  cursor: Scalars['ID']['output'];
  node: MapWordOrPhrase;
};

export type MarkNotificationReadInput = {
  notification_id: Scalars['ID']['input'];
};

export type MarkNotificationReadOutput = {
  __typename?: 'MarkNotificationReadOutput';
  error: ErrorType;
  notification_id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addNotification: AddNotificationOutput;
  avatarUpdateResolver: AvatarUpdateOutput;
  createQuestionOnWordRange: QuestionOnWordRangesOutput;
  documentUpload: DocumentUploadOutput;
  emailResponseResolver: EmailResponseOutput;
  forceMarkAndRetranslateOriginalMapsIds: GenericOutput;
  forumDelete: ForumDeleteOutput;
  forumFolderDelete: ForumFolderDeleteOutput;
  forumFolderUpsert: ForumFolderOutput;
  forumUpsert: ForumOutput;
  generateData: GenericOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  mapDelete: MapDeleteOutput;
  mapUpload: MapUploadOutput;
  mapVoteUpsert: MapVoteOutput;
  mapsReTranslate: GenericOutput;
  mapsReTranslateToLangs: GenericOutput;
  mapsTranslationsReset: GenericOutput;
  markNotificationAsRead: MarkNotificationReadOutput;
  notificationDelete: NotificationDeleteOutput;
  notifyUsers: AddNotificationOutput;
  passwordResetFormResolver: LoginOutput;
  phraseDefinitionUpsert: PhraseDefinitionOutput;
  phraseToPhraseTranslationUpsert: PhraseToPhraseTranslationOutput;
  phraseUpsert: PhraseOutput;
  phraseVoteUpsert: PhraseVoteOutput;
  postCreateResolver: PostCreateOutput;
  register: RegisterOutput;
  resetEmailRequest: ResetEmailRequestOutput;
  siteTextPhraseDefinitionUpsert: SiteTextPhraseDefinitionOutput;
  siteTextUpsert: SiteTextDefinitionOutput;
  siteTextWordDefinitionUpsert: SiteTextWordDefinitionOutput;
  startZipMapDownload: StartZipMapOutput;
  stopBotTranslation: GenericOutput;
  stopDataGeneration: GenericOutput;
  threadDelete: ThreadDeleteOutput;
  threadUpsert: ThreadOutput;
  toggleFlagWithRef: FlagsOutput;
  toggleMapVoteStatus: MapVoteStatusOutputRow;
  togglePericopeVoteStatus: PericopeVoteStatusOutput;
  togglePhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  togglePhraseToPhraseTrVoteStatus: PhraseToPhraseTranslationVoteStatusOutputRow;
  togglePhraseToWordTrVoteStatus: PhraseToWordTranslationVoteStatusOutputRow;
  togglePhraseVoteStatus: PhraseVoteStatusOutputRow;
  toggleTranslationVoteStatus: TranslationVoteStatusOutputRow;
  toggleWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  toggleWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  toggleWordVoteStatus: WordVoteStatusOutputRow;
  translateAllWordsAndPhrasesByDeepL: GenericOutput;
  translateAllWordsAndPhrasesByGoogle: GenericOutput;
  translateAllWordsAndPhrasesByLilt: GenericOutput;
  translateAllWordsAndPhrasesBySmartcat: GenericOutput;
  translateMissingWordsAndPhrasesByChatGpt: TranslateAllWordsAndPhrasesByBotOutput;
  translateMissingWordsAndPhrasesByDeepL: TranslateAllWordsAndPhrasesByBotOutput;
  translateMissingWordsAndPhrasesByGoogle: TranslateAllWordsAndPhrasesByBotOutput;
  translateMissingWordsAndPhrasesByLilt: TranslateAllWordsAndPhrasesByBotOutput;
  translateMissingWordsAndPhrasesBySmartcat: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesByChatGPT4: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesByChatGPT35: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesByDeepL: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesByGoogle: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesByLilt: TranslateAllWordsAndPhrasesByBotOutput;
  translateWordsAndPhrasesBySmartcat: TranslateAllWordsAndPhrasesByBotOutput;
  updateDefinition: PhraseDefinitionOutput;
  updateFile: IFileOutput;
  uploadFile: IFileOutput;
  upsertAnswers: AnswersOutput;
  upsertFromTranslationlikeString: TranslationOutput;
  upsertPericopies: PericopiesOutput;
  upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: PhraseDefinitionOutput;
  upsertQuestionItems: QuestionItemsOutput;
  upsertQuestions: QuestionsOutput;
  upsertSiteTextTranslation: TranslationOutput;
  upsertTranslation: TranslationOutput;
  upsertTranslationFromWordAndDefinitionlikeString: TranslationOutput;
  upsertWordDefinitionFromWordAndDefinitionlikeString: WordDefinitionOutput;
  upsertWordRanges: WordRangesOutput;
  versionCreateResolver: VersionCreateOutput;
  wordDefinitionUpsert: WordDefinitionOutput;
  wordToPhraseTranslationUpsert: WordToPhraseTranslationOutput;
  wordToWordTranslationUpsert: WordToWordTranslationOutput;
  wordUpsert: WordOutput;
  wordVoteUpsert: WordVoteOutput;
};


export type MutationAddNotificationArgs = {
  input: AddNotificationInput;
};


export type MutationAvatarUpdateResolverArgs = {
  input: AvatarUpdateInput;
};


export type MutationCreateQuestionOnWordRangeArgs = {
  input: CreateQuestionOnWordRangeUpsertInput;
};


export type MutationDocumentUploadArgs = {
  input: DocumentUploadInput;
};


export type MutationEmailResponseResolverArgs = {
  input: EmailResponseInput;
};


export type MutationForceMarkAndRetranslateOriginalMapsIdsArgs = {
  originalMapsIds: Array<Scalars['String']['input']>;
};


export type MutationForumDeleteArgs = {
  forum_id: Scalars['ID']['input'];
};


export type MutationForumFolderDeleteArgs = {
  forum_folder_id: Scalars['ID']['input'];
};


export type MutationForumFolderUpsertArgs = {
  input: ForumFolderUpsertInput;
};


export type MutationForumUpsertArgs = {
  input: ForumUpsertInput;
};


export type MutationGenerateDataArgs = {
  input: DataGenInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  input: LogoutInput;
};


export type MutationMapDeleteArgs = {
  input: MapDeleteInput;
};


export type MutationMapUploadArgs = {
  file: Scalars['Upload']['input'];
  file_size: Scalars['Int']['input'];
  file_type: Scalars['String']['input'];
  previewFileId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMapVoteUpsertArgs = {
  input: MapVoteUpsertInput;
};


export type MutationMapsReTranslateArgs = {
  forLangTag?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMapsReTranslateToLangsArgs = {
  forLangTags: Array<Scalars['String']['input']>;
};


export type MutationMarkNotificationAsReadArgs = {
  input: MarkNotificationReadInput;
};


export type MutationNotificationDeleteArgs = {
  input: NotificationDeleteInput;
};


export type MutationNotifyUsersArgs = {
  input: NotifyUsersInput;
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


export type MutationSiteTextUpsertArgs = {
  input: SiteTextUpsertInput;
};


export type MutationSiteTextWordDefinitionUpsertArgs = {
  word_definition_id: Scalars['ID']['input'];
};


export type MutationStartZipMapDownloadArgs = {
  input: StartZipMapDownloadInput;
};


export type MutationThreadDeleteArgs = {
  thread_id: Scalars['ID']['input'];
};


export type MutationThreadUpsertArgs = {
  input: ThreadUpsertInput;
};


export type MutationToggleFlagWithRefArgs = {
  name: Scalars['String']['input'];
  parent_id: Scalars['String']['input'];
  parent_table: TableNameType;
};


export type MutationToggleMapVoteStatusArgs = {
  is_original: Scalars['Boolean']['input'];
  map_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
};


export type MutationTogglePericopeVoteStatusArgs = {
  pericope_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
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


export type MutationToggleWordVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_id: Scalars['ID']['input'];
};


export type MutationTranslateAllWordsAndPhrasesByDeepLArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateAllWordsAndPhrasesByGoogleArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateAllWordsAndPhrasesByLiltArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateAllWordsAndPhrasesBySmartcatArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateMissingWordsAndPhrasesByChatGptArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
  version: Scalars['String']['input'];
};


export type MutationTranslateMissingWordsAndPhrasesByDeepLArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateMissingWordsAndPhrasesByGoogleArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateMissingWordsAndPhrasesByLiltArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateMissingWordsAndPhrasesBySmartcatArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesByChatGpt4Args = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesByChatGpt35Args = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesByDeepLArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesByGoogleArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesByLiltArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationTranslateWordsAndPhrasesBySmartcatArgs = {
  from_language: LanguageInput;
  to_language: LanguageInput;
};


export type MutationUpdateDefinitionArgs = {
  input: DefinitionUpdateaInput;
};


export type MutationUpdateFileArgs = {
  file?: InputMaybe<Scalars['Upload']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  file_type?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload']['input'];
  file_size: Scalars['Int']['input'];
  file_type: Scalars['String']['input'];
};


export type MutationUpsertAnswersArgs = {
  input: Array<AnswerUpsertInput>;
};


export type MutationUpsertFromTranslationlikeStringArgs = {
  fromInput: SiteTextTranslationsFromInput;
  toInput: SiteTextTranslationsToInput;
};


export type MutationUpsertPericopiesArgs = {
  startWords: Array<Scalars['String']['input']>;
};


export type MutationUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringArgs = {
  input: FromPhraseAndDefintionlikeStringUpsertInput;
};


export type MutationUpsertQuestionItemsArgs = {
  items: Array<Scalars['String']['input']>;
};


export type MutationUpsertQuestionsArgs = {
  input: Array<QuestionUpsertInput>;
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


export type MutationUpsertWordRangesArgs = {
  input: Array<WordRangeInput>;
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

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID']['output'];
  isNotified: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type NotificationDeleteInput = {
  notification_id: Scalars['ID']['input'];
};

export type NotificationDeleteOutput = {
  __typename?: 'NotificationDeleteOutput';
  error: ErrorType;
  notification_id: Scalars['ID']['output'];
};

export type NotificationListOutput = {
  __typename?: 'NotificationListOutput';
  error: ErrorType;
  notifications: Array<Notification>;
};

export type NotifyUsersInput = {
  text: Scalars['String']['input'];
  user_ids: Array<Scalars['ID']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['ID']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['ID']['output']>;
  totalEdges?: Maybe<Scalars['Int']['output']>;
};

export type PasswordResetFormInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Pericope = {
  __typename?: 'Pericope';
  pericope_id: Scalars['ID']['output'];
  start_word: Scalars['String']['output'];
};

export type PericopeVote = {
  __typename?: 'PericopeVote';
  last_updated_at: Scalars['DateTime']['output'];
  pericope_id: Scalars['ID']['output'];
  pericope_vote_id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
  vote: Scalars['Boolean']['output'];
};

export type PericopeVoteStatus = {
  __typename?: 'PericopeVoteStatus';
  downvotes: Scalars['Int']['output'];
  pericope_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PericopeVoteStatusOutput = {
  __typename?: 'PericopeVoteStatusOutput';
  error: ErrorType;
  vote_status?: Maybe<PericopeVoteStatus>;
};

export type PericopeWithVote = {
  __typename?: 'PericopeWithVote';
  downvotes: Scalars['Int']['output'];
  pericope_id: Scalars['ID']['output'];
  start_word: Scalars['String']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PericopeWithVotesEdge = {
  __typename?: 'PericopeWithVotesEdge';
  cursor: Scalars['ID']['output'];
  node: Array<PericopeWithVote>;
};

export type PericopeWithVotesListConnection = {
  __typename?: 'PericopeWithVotesListConnection';
  edges: Array<PericopeWithVotesEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type PericopiesOutput = {
  __typename?: 'PericopiesOutput';
  error: ErrorType;
  pericopies: Array<Maybe<Pericope>>;
};

export type Phrase = {
  __typename?: 'Phrase';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
};

export type PhraseDefinition = {
  __typename?: 'PhraseDefinition';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  definition: Scalars['String']['output'];
  phrase: Phrase;
  phrase_definition_id: Scalars['ID']['output'];
};

export type PhraseDefinitionListConnection = {
  __typename?: 'PhraseDefinitionListConnection';
  edges: Array<PhraseDefinitionListEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type PhraseDefinitionListEdge = {
  __typename?: 'PhraseDefinitionListEdge';
  cursor: Scalars['ID']['output'];
  node: PhraseDefinition;
};

export type PhraseDefinitionOutput = {
  __typename?: 'PhraseDefinitionOutput';
  error: ErrorType;
  phrase_definition?: Maybe<PhraseDefinition>;
};

export type PhraseDefinitionUpsertInput = {
  definition: Scalars['String']['input'];
  phrase_id: Scalars['ID']['input'];
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
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
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

export type PhraseOutput = {
  __typename?: 'PhraseOutput';
  error: ErrorType;
  phrase?: Maybe<Phrase>;
};

export type PhraseReadInput = {
  phrase_id: Scalars['ID']['input'];
};

export type PhraseToPhraseTranslation = {
  __typename?: 'PhraseToPhraseTranslation';
  from_phrase_definition: PhraseDefinition;
  phrase_to_phrase_translation_id: Scalars['ID']['output'];
  to_phrase_definition: PhraseDefinition;
};

export type PhraseToPhraseTranslationOutput = {
  __typename?: 'PhraseToPhraseTranslationOutput';
  error: ErrorType;
  phrase_to_phrase_translation?: Maybe<PhraseToPhraseTranslation>;
};

export type PhraseToPhraseTranslationUpsertInput = {
  from_phrase_definition_id: Scalars['ID']['input'];
  to_phrase_definition_id: Scalars['ID']['input'];
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
  phrase_to_phrase_tr_with_vote_list: Array<Maybe<PhraseToPhraseTranslationWithVote>>;
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
  phrase_to_word_tr_with_vote_list: Array<Maybe<PhraseToWordTranslationWithVote>>;
};

export type PhraseUpsertInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  phraselike_string: Scalars['String']['input'];
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

export type PhraseWithDefinition = {
  __typename?: 'PhraseWithDefinition';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  definition?: Maybe<Scalars['String']['output']>;
  definition_id?: Maybe<Scalars['String']['output']>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
};

export type PhraseWithDefinitions = {
  __typename?: 'PhraseWithDefinitions';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
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
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  phrase: Scalars['String']['output'];
  phrase_id: Scalars['ID']['output'];
  upvotes: Scalars['Int']['output'];
};

export type PhraseWithVoteListConnection = {
  __typename?: 'PhraseWithVoteListConnection';
  edges: Array<PhraseWithVoteListEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type PhraseWithVoteListEdge = {
  __typename?: 'PhraseWithVoteListEdge';
  cursor: Scalars['ID']['output'];
  node: PhraseWithDefinitions;
};

export type PhraseWithVoteOutput = {
  __typename?: 'PhraseWithVoteOutput';
  error: ErrorType;
  phrase_with_vote?: Maybe<PhraseWithVote>;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  file_type?: Maybe<Scalars['String']['output']>;
  file_url?: Maybe<Scalars['ID']['output']>;
  post_id: Scalars['ID']['output'];
};

export type PostCountOutput = {
  __typename?: 'PostCountOutput';
  error: ErrorType;
  total: Scalars['Float']['output'];
};

export type PostCreateInput = {
  content: Scalars['String']['input'];
  file_id?: InputMaybe<Scalars['ID']['input']>;
  parent_id: Scalars['Int']['input'];
  parent_table: Scalars['String']['input'];
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

export type PostsByParentInput = {
  parent_id: Scalars['ID']['input'];
  parent_name: Scalars['String']['input'];
};

export type PostsByParentOutput = {
  __typename?: 'PostsByParentOutput';
  error: ErrorType;
  posts?: Maybe<Array<Post>>;
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  file: IFileOutput;
  fileList: Array<IFile>;
  fileUploadUrlRequest: FileUploadUrlResponse;
  forumFolderRead: ForumFolderOutput;
  forumRead: ForumOutput;
  getAllDocuments: DocumentListConnection;
  getAllMapsList: MapListConnection;
  getAllRecommendedSiteTextTranslationList: TranslationWithVoteListByLanguageListOutput;
  getAllRecommendedSiteTextTranslationListByLanguage: TranslationWithVoteListByLanguageOutput;
  getAllSiteTextDefinitions: SiteTextDefinitionListConnection;
  getAllSiteTextLanguageList: SiteTextLanguageListOutput;
  getAllSiteTextLanguageListWithRate: SiteTextLanguageWithTranslationInfoListOutput;
  getAllTranslationFromSiteTextDefinitionID: TranslationWithVoteListOutput;
  getAnswersByQuestionIds: AnswersOutput;
  getDocument: GetDocumentOutput;
  getDocumentTextFromRanges: TextFromRangesOutput;
  getDocumentWordEntriesByDocumentId: DocumentWordEntriesListConnection;
  getFlagsFromRef: FlagsOutput;
  getForumFoldersList: ForumFolderListConnection;
  getForumsList: ForumListConnection;
  getLanguageTranslationInfo: TranslatedLanguageInfoOutput;
  getMapDetails: MapDetailsOutput;
  getMapVoteStatus: MapVoteStatusOutputRow;
  getMapWordOrPhraseAsOrigByDefinitionId: MapWordOrPhraseAsOrigOutput;
  getOrigMapWordsAndPhrases: MapWordsAndPhrasesConnection;
  getOrigMapWordsAndPhrasesCount: MapWordsAndPhrasesCountOutput;
  getOrigMapsList: GetOrigMapsListOutput;
  getPericopeVoteStatus: PericopeVoteStatusOutput;
  getPericopiesByDocumentId: PericopeWithVotesListConnection;
  getPhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getPhraseDefinitionsByFlag: PhraseDefinitionListConnection;
  getPhraseDefinitionsByLanguage: PhraseDefinitionWithVoteListOutput;
  getPhraseDefinitionsByPhraseId: PhraseDefinitionWithVoteListOutput;
  getPhraseToPhraseTrVoteStatus: PhraseToPhraseTranslationVoteStatusOutputRow;
  getPhraseToPhraseTranslationsByFromPhraseDefinitionId: PhraseToPhraseTranslationWithVoteListOutput;
  getPhraseToWordTrVoteStatus: PhraseToWordTranslationVoteStatusOutputRow;
  getPhraseToWordTranslationsByFromPhraseDefinitionId: PhraseToWordTranslationWithVoteListOutput;
  getPhraseVoteStatus: PhraseVoteStatusOutputRow;
  getPhraseWithVoteById: PhraseWithVoteOutput;
  getPhrasesByLanguage: PhraseWithVoteListConnection;
  getQuestionOnWordRangesByDocumentId: QuestionOnWordRangesListConnection;
  getQuestionStatistic: QuestionWithStatisticOutput;
  getQuestionsByRefs: QuestionsOutput;
  getRecommendedTranslationFromDefinitionID: TranslationWithVoteOutput;
  getRecommendedTranslationFromDefinitionIDs: TranslationWithVoteListOutput;
  getRecommendedTranslationFromSiteTextDefinitionID: TranslationWithVoteOutput;
  getThreadsList: ThreadListConnection;
  getTotalPosts: PostCountOutput;
  getTranslationsByFromDefinitionId: TranslationWithVoteListOutput;
  getWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getWordDefinitionsByFlag: WordDefinitionListConnection;
  getWordDefinitionsByLanguage: WordDefinitionWithVoteListOutput;
  getWordDefinitionsByWordId: WordDefinitionWithVoteListOutput;
  getWordRangesByBeginIds: WordRangesOutput;
  getWordRangesByDocumentId: WordRangesListConnection;
  getWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  getWordToPhraseTranslationsByFromWordDefinitionId: WordToPhraseTranslationWithVoteListOutput;
  getWordToWordTrVoteStatus: WordTrVoteStatusOutputRow;
  getWordToWordTranslationsByFromWordDefinitionId: WordToWordTranslationWithVoteListOutput;
  getWordVoteStatus: WordVoteStatusOutputRow;
  getWordWithVoteById: WordWithVoteOutput;
  getWordsByLanguage: WordWithVoteListConnection;
  languagesForBotTranslate: LanguageListForBotTranslateOutput;
  loggedInIsAdmin: IsAdminIdOutput;
  notifications: NotificationListOutput;
  phraseDefinitionRead: PhraseDefinitionOutput;
  phraseRead: PhraseOutput;
  phraseToPhraseTranslationRead: PhraseToPhraseTranslationOutput;
  phraseVoteRead: PhraseVoteOutput;
  postReadResolver: PostReadOutput;
  postsByParent: PostsByParentOutput;
  readAnswers: AnswersOutput;
  readPericopies: PericopiesOutput;
  readQuestionItems: QuestionItemsOutput;
  readQuestions: QuestionsOutput;
  readWordRanges: WordRangesOutput;
  siteTextPhraseDefinitionRead: SiteTextPhraseDefinitionOutput;
  siteTextWordDefinitionRead: SiteTextWordDefinitionOutput;
  threadRead: ThreadOutput;
  userReadResolver: UserReadOutput;
  wordDefinitionRead: WordDefinitionOutput;
  wordRead: WordOutput;
  wordToPhraseTranslationRead: WordToPhraseTranslationOutput;
  wordToWordTranslationRead: WordToWordTranslationOutput;
  wordVoteRead: WordVoteOutput;
};


export type QueryFileArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFileUploadUrlRequestArgs = {
  input: FileUploadUrlRequest;
};


export type QueryForumFolderReadArgs = {
  forum_folder_id: Scalars['ID']['input'];
};


export type QueryForumReadArgs = {
  forum_id: Scalars['ID']['input'];
};


export type QueryGetAllDocumentsArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input?: InputMaybe<LanguageInput>;
};


export type QueryGetAllMapsListArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: GetAllMapsListInput;
};


export type QueryGetAllRecommendedSiteTextTranslationListByLanguageArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
};


export type QueryGetAllSiteTextDefinitionsArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<SiteTextDefinitionListFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetAllTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
};


export type QueryGetAnswersByQuestionIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryGetDocumentArgs = {
  input: GetDocumentInput;
};


export type QueryGetDocumentTextFromRangesArgs = {
  ranges: Array<WordRangeInput>;
};


export type QueryGetDocumentWordEntriesByDocumentIdArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  document_id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetFlagsFromRefArgs = {
  parent_id: Scalars['String']['input'];
  parent_table: TableNameType;
};


export type QueryGetForumFoldersListArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  forum_id: Scalars['ID']['input'];
};


export type QueryGetForumsListArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLanguageTranslationInfoArgs = {
  input: TranslatedLanguageInfoInput;
};


export type QueryGetMapDetailsArgs = {
  input: GetMapDetailsInput;
};


export type QueryGetMapVoteStatusArgs = {
  is_original: Scalars['Boolean']['input'];
  map_id: Scalars['ID']['input'];
};


export type QueryGetMapWordOrPhraseAsOrigByDefinitionIdArgs = {
  input: GetMapWordOrPhraseByDefinitionIdInput;
};


export type QueryGetOrigMapWordsAndPhrasesArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: GetOrigMapWordsAndPhrasesInput;
};


export type QueryGetOrigMapWordsAndPhrasesCountArgs = {
  input: GetOrigMapWordsAndPhrasesInput;
};


export type QueryGetOrigMapsListArgs = {
  input: GetOrigMapListInput;
};


export type QueryGetPericopeVoteStatusArgs = {
  pericope_id: Scalars['ID']['input'];
};


export type QueryGetPericopiesByDocumentIdArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  document_id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPhraseDefinitionVoteStatusArgs = {
  phrase_definition_id: Scalars['ID']['input'];
};


export type QueryGetPhraseDefinitionsByFlagArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  flag_name: FlagType;
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
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: LanguageInput;
};


export type QueryGetQuestionOnWordRangesByDocumentIdArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  document_id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetQuestionStatisticArgs = {
  question_id: Scalars['ID']['input'];
};


export type QueryGetQuestionsByRefsArgs = {
  parent_ids: Array<Scalars['ID']['input']>;
  parent_tables: Array<TableNameType>;
};


export type QueryGetRecommendedTranslationFromDefinitionIdArgs = {
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  langInfo: LanguageInput;
};


export type QueryGetRecommendedTranslationFromDefinitionIDsArgs = {
  from_definition_ids: Array<Scalars['ID']['input']>;
  from_type_is_words: Array<Scalars['Boolean']['input']>;
  langInfo: LanguageInput;
};


export type QueryGetRecommendedTranslationFromSiteTextDefinitionIdArgs = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
};


export type QueryGetThreadsListArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  forum_folder_id: Scalars['String']['input'];
};


export type QueryGetTotalPostsArgs = {
  input: PostsByParentInput;
};


export type QueryGetTranslationsByFromDefinitionIdArgs = {
  definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  langInfo: LanguageInput;
};


export type QueryGetWordDefinitionVoteStatusArgs = {
  word_definition_id: Scalars['ID']['input'];
};


export type QueryGetWordDefinitionsByFlagArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  flag_name: FlagType;
};


export type QueryGetWordDefinitionsByLanguageArgs = {
  input: LanguageInput;
};


export type QueryGetWordDefinitionsByWordIdArgs = {
  word_id: Scalars['ID']['input'];
};


export type QueryGetWordRangesByBeginIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryGetWordRangesByDocumentIdArgs = {
  after?: InputMaybe<Scalars['ID']['input']>;
  document_id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
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
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: LanguageInput;
};


export type QueryLanguagesForBotTranslateArgs = {
  botType: BotType;
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


export type QueryPostsByParentArgs = {
  input: PostsByParentInput;
};


export type QueryReadAnswersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryReadPericopiesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryReadQuestionItemsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryReadQuestionsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryReadWordRangesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QuerySiteTextPhraseDefinitionReadArgs = {
  id: Scalars['String']['input'];
};


export type QuerySiteTextWordDefinitionReadArgs = {
  id: Scalars['String']['input'];
};


export type QueryThreadReadArgs = {
  thread_id: Scalars['ID']['input'];
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

export type Question = {
  __typename?: 'Question';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  parent_id: Scalars['String']['output'];
  parent_table: TableNameType;
  question: Scalars['String']['output'];
  question_id: Scalars['ID']['output'];
  question_items: Array<QuestionItem>;
  question_type_is_multiselect: Scalars['Boolean']['output'];
};

export type QuestionItem = {
  __typename?: 'QuestionItem';
  item: Scalars['String']['output'];
  question_item_id: Scalars['ID']['output'];
};

export type QuestionItemWithStatistic = {
  __typename?: 'QuestionItemWithStatistic';
  item: Scalars['String']['output'];
  question_item_id: Scalars['ID']['output'];
  statistic: Scalars['Int']['output'];
};

export type QuestionItemsOutput = {
  __typename?: 'QuestionItemsOutput';
  error: ErrorType;
  question_items: Array<Maybe<QuestionItem>>;
};

export type QuestionOnWordRange = {
  __typename?: 'QuestionOnWordRange';
  begin: DocumentWordEntry;
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  end: DocumentWordEntry;
  parent_id: Scalars['String']['output'];
  parent_table: TableNameType;
  question: Scalars['String']['output'];
  question_id: Scalars['ID']['output'];
  question_items: Array<QuestionItem>;
  question_type_is_multiselect: Scalars['Boolean']['output'];
};

export type QuestionOnWordRangesEdge = {
  __typename?: 'QuestionOnWordRangesEdge';
  cursor: Scalars['ID']['output'];
  node: Array<QuestionOnWordRange>;
};

export type QuestionOnWordRangesListConnection = {
  __typename?: 'QuestionOnWordRangesListConnection';
  edges: Array<QuestionOnWordRangesEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type QuestionOnWordRangesOutput = {
  __typename?: 'QuestionOnWordRangesOutput';
  error: ErrorType;
  questions: Array<Maybe<QuestionOnWordRange>>;
};

export type QuestionUpsertInput = {
  parent_id: Scalars['Int']['input'];
  parent_table: TableNameType;
  question: Scalars['String']['input'];
  question_items: Array<Scalars['String']['input']>;
  question_type_is_multiselect: Scalars['Boolean']['input'];
};

export type QuestionWithStatistic = {
  __typename?: 'QuestionWithStatistic';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  parent_id: Scalars['String']['output'];
  parent_table: TableNameType;
  question: Scalars['String']['output'];
  question_id: Scalars['ID']['output'];
  question_items: Array<QuestionItemWithStatistic>;
  question_type_is_multiselect: Scalars['Boolean']['output'];
};

export type QuestionWithStatisticOutput = {
  __typename?: 'QuestionWithStatisticOutput';
  error: ErrorType;
  question_with_statistic: QuestionWithStatistic;
};

export type QuestionsOutput = {
  __typename?: 'QuestionsOutput';
  error: ErrorType;
  questions: Array<Maybe<Question>>;
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

export type SiteTextDefinitionEdge = {
  __typename?: 'SiteTextDefinitionEdge';
  cursor: Scalars['ID']['output'];
  node: SiteTextDefinition;
};

export type SiteTextDefinitionListConnection = {
  __typename?: 'SiteTextDefinitionListConnection';
  edges: Array<SiteTextDefinitionEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type SiteTextDefinitionListFilterInput = {
  filter?: InputMaybe<Scalars['String']['input']>;
  isSortDescending?: InputMaybe<Scalars['Boolean']['input']>;
  onlyNotTranslated?: InputMaybe<Scalars['Boolean']['input']>;
  onlyTranslated?: InputMaybe<Scalars['Boolean']['input']>;
  quickFilter?: InputMaybe<Scalars['String']['input']>;
  targetLanguage?: InputMaybe<LanguageInput>;
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

export type SiteTextLanguageWithTranslationInfo = {
  __typename?: 'SiteTextLanguageWithTranslationInfo';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  total_count: Scalars['Int']['output'];
  translated_count: Scalars['Int']['output'];
};

export type SiteTextLanguageWithTranslationInfoListOutput = {
  __typename?: 'SiteTextLanguageWithTranslationInfoListOutput';
  error: ErrorType;
  site_text_language_with_translation_info_list: Array<Maybe<SiteTextLanguageWithTranslationInfo>>;
};

export type SiteTextPhraseDefinition = {
  __typename?: 'SiteTextPhraseDefinition';
  phrase_definition: PhraseDefinition;
  site_text_id: Scalars['ID']['output'];
};

export type SiteTextPhraseDefinitionEdge = {
  __typename?: 'SiteTextPhraseDefinitionEdge';
  cursor: Scalars['ID']['output'];
  node: SiteTextPhraseDefinition;
};

export type SiteTextPhraseDefinitionOutput = {
  __typename?: 'SiteTextPhraseDefinitionOutput';
  error: ErrorType;
  site_text_phrase_definition?: Maybe<SiteTextPhraseDefinition>;
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

export type SiteTextWordDefinitionEdge = {
  __typename?: 'SiteTextWordDefinitionEdge';
  cursor: Scalars['ID']['output'];
  node: SiteTextWordDefinition;
};

export type SiteTextWordDefinitionOutput = {
  __typename?: 'SiteTextWordDefinitionOutput';
  error: ErrorType;
  site_text_word_definition?: Maybe<SiteTextWordDefinition>;
};

export type StartZipMapDownloadInput = {
  language: LanguageInput;
};

export type StartZipMapOutput = {
  __typename?: 'StartZipMapOutput';
  error: ErrorType;
};

export type Subscription = {
  __typename?: 'Subscription';
  DataGenerationReport: DataGenProgress;
  TranslationReport: TranslateAllWordsAndPhrasesByBotResult;
  ZipMapReport: ZipMapResult;
};

export enum SubscriptionStatus {
  Completed = 'Completed',
  Error = 'Error',
  NotStarted = 'NotStarted',
  Progressing = 'Progressing'
}

export enum TableNameType {
  DocumentWordEntries = 'document_word_entries',
  Documents = 'documents',
  OriginalMaps = 'original_maps',
  Pericopies = 'pericopies',
  PhraseDefinitions = 'phrase_definitions',
  PhraseToPhraseTranslations = 'phrase_to_phrase_translations',
  PhraseToWordTranslations = 'phrase_to_word_translations',
  Phrases = 'phrases',
  Threads = 'threads',
  TranslatedMaps = 'translated_maps',
  WordDefinitions = 'word_definitions',
  WordRanges = 'word_ranges',
  WordToPhraseTranslations = 'word_to_phrase_translations',
  WordToWordTranslations = 'word_to_word_translations',
  Words = 'words'
}

export type TextFromRange = {
  __typename?: 'TextFromRange';
  begin_document_word_entry_id: Scalars['ID']['output'];
  end_document_word_entry_id: Scalars['ID']['output'];
  piece_of_text: Scalars['String']['output'];
};

export type TextFromRangesOutput = {
  __typename?: 'TextFromRangesOutput';
  error: ErrorType;
  list: Array<TextFromRange>;
};

export type TextyDocument = {
  __typename?: 'TextyDocument';
  dialect_code?: Maybe<Scalars['String']['output']>;
  document_id: Scalars['ID']['output'];
  file_id: Scalars['String']['output'];
  file_name: Scalars['String']['output'];
  file_url: Scalars['String']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
};

export type TextyDocumentInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  file_id: Scalars['String']['input'];
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
};

export type Thread = {
  __typename?: 'Thread';
  created_by: Scalars['String']['output'];
  forum_folder_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  thread_id: Scalars['ID']['output'];
};

export type ThreadDeleteOutput = {
  __typename?: 'ThreadDeleteOutput';
  error: ErrorType;
  thread_id: Scalars['ID']['output'];
};

export type ThreadEdge = {
  __typename?: 'ThreadEdge';
  cursor: Scalars['ID']['output'];
  node: Thread;
};

export type ThreadListConnection = {
  __typename?: 'ThreadListConnection';
  edges: Array<ThreadEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type ThreadOutput = {
  __typename?: 'ThreadOutput';
  error: ErrorType;
  thread?: Maybe<Thread>;
};

export type ThreadUpsertInput = {
  forum_folder_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  thread_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ToDefinitionInput = {
  definition: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  is_type_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  word_or_phrase: Scalars['String']['input'];
};

export type TranslateAllWordsAndPhrasesByBotOutput = {
  __typename?: 'TranslateAllWordsAndPhrasesByBotOutput';
  error: ErrorType;
  result?: Maybe<TranslateAllWordsAndPhrasesByBotResult>;
};

export type TranslateAllWordsAndPhrasesByBotResult = {
  __typename?: 'TranslateAllWordsAndPhrasesByBotResult';
  completed?: Maybe<Scalars['Int']['output']>;
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message?: Maybe<Scalars['String']['output']>;
  requestedCharacters: Scalars['Int']['output'];
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPhraseCount: Scalars['Int']['output'];
  totalWordCount: Scalars['Int']['output'];
  translatedPhraseCount: Scalars['Int']['output'];
  translatedWordCount: Scalars['Int']['output'];
};

export type TranslatedLanguageInfoInput = {
  fromLanguageCode: Scalars['ID']['input'];
  toLanguageCode?: InputMaybe<Scalars['ID']['input']>;
};

export type TranslatedLanguageInfoOutput = {
  __typename?: 'TranslatedLanguageInfoOutput';
  deeplTranslateTotalLangCount: Scalars['Int']['output'];
  error: ErrorType;
  googleTranslateTotalLangCount: Scalars['Int']['output'];
  liltTranslateTotalLangCount: Scalars['Int']['output'];
  smartcatTranslateTotalLangCount: Scalars['Int']['output'];
  totalPhraseCount: Scalars['Int']['output'];
  totalWordCount: Scalars['Int']['output'];
  translatedMissingPhraseCount?: Maybe<Scalars['Int']['output']>;
  translatedMissingWordCount?: Maybe<Scalars['Int']['output']>;
};

export type Translation = PhraseToPhraseTranslation | PhraseToWordTranslation | WordToPhraseTranslation | WordToWordTranslation;

export type TranslationOutput = {
  __typename?: 'TranslationOutput';
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

export type TranslationWithVoteListByLanguage = {
  __typename?: 'TranslationWithVoteListByLanguage';
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  translation_with_vote_list: Array<Maybe<TranslationWithVote>>;
};

export type TranslationWithVoteListByLanguageListOutput = {
  __typename?: 'TranslationWithVoteListByLanguageListOutput';
  error: ErrorType;
  translation_with_vote_list_by_language_list?: Maybe<Array<TranslationWithVoteListByLanguage>>;
};

export type TranslationWithVoteListByLanguageOutput = {
  __typename?: 'TranslationWithVoteListByLanguageOutput';
  error: ErrorType;
  translation_with_vote_list_by_language: TranslationWithVoteListByLanguage;
};

export type TranslationWithVoteListOutput = {
  __typename?: 'TranslationWithVoteListOutput';
  error: ErrorType;
  translation_with_vote_list: Array<Maybe<TranslationWithVote>>;
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
  is_bot: Scalars['Boolean']['output'];
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
  created_at: Scalars['DateTime']['output'];
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
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordDefinition = {
  __typename?: 'WordDefinition';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  definition: Scalars['String']['output'];
  word: Word;
  word_definition_id: Scalars['ID']['output'];
};

export type WordDefinitionListConnection = {
  __typename?: 'WordDefinitionListConnection';
  edges: Array<WordDefinitionListEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type WordDefinitionListEdge = {
  __typename?: 'WordDefinitionListEdge';
  cursor: Scalars['ID']['output'];
  node: WordDefinition;
};

export type WordDefinitionOutput = {
  __typename?: 'WordDefinitionOutput';
  error: ErrorType;
  word_definition?: Maybe<WordDefinition>;
};

export type WordDefinitionUpsertInput = {
  definition: Scalars['String']['input'];
  word_id: Scalars['ID']['input'];
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
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
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

export type WordOutput = {
  __typename?: 'WordOutput';
  error: ErrorType;
  word?: Maybe<Word>;
};

export type WordRange = {
  __typename?: 'WordRange';
  begin: DocumentWordEntry;
  end: DocumentWordEntry;
  word_range_id: Scalars['ID']['output'];
};

export type WordRangeInput = {
  begin_document_word_entry_id: Scalars['String']['input'];
  end_document_word_entry_id: Scalars['String']['input'];
};

export type WordRangesEdge = {
  __typename?: 'WordRangesEdge';
  cursor: Scalars['ID']['output'];
  node: Array<WordRange>;
};

export type WordRangesListConnection = {
  __typename?: 'WordRangesListConnection';
  edges: Array<WordRangesEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type WordRangesOutput = {
  __typename?: 'WordRangesOutput';
  error: ErrorType;
  word_ranges: Array<Maybe<WordRange>>;
};

export type WordReadInput = {
  word_id: Scalars['ID']['input'];
};

export type WordToPhraseTranslation = {
  __typename?: 'WordToPhraseTranslation';
  from_word_definition: WordDefinition;
  to_phrase_definition: PhraseDefinition;
  word_to_phrase_translation_id: Scalars['ID']['output'];
};

export type WordToPhraseTranslationOutput = {
  __typename?: 'WordToPhraseTranslationOutput';
  error: ErrorType;
  word_to_phrase_translation?: Maybe<WordToPhraseTranslation>;
};

export type WordToPhraseTranslationUpsertInput = {
  from_word_definition_id: Scalars['ID']['input'];
  to_phrase_definition_id: Scalars['ID']['input'];
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
  word_to_phrase_tr_with_vote_list: Array<Maybe<WordToPhraseTranslationWithVote>>;
};

export type WordToWordTranslation = {
  __typename?: 'WordToWordTranslation';
  from_word_definition: WordDefinition;
  to_word_definition: WordDefinition;
  word_to_word_translation_id: Scalars['ID']['output'];
};

export type WordToWordTranslationOutput = {
  __typename?: 'WordToWordTranslationOutput';
  error: ErrorType;
  word_to_word_translation?: Maybe<WordToWordTranslation>;
};

export type WordToWordTranslationUpsertInput = {
  from_word_definition_id: Scalars['ID']['input'];
  to_word_definition_id: Scalars['ID']['input'];
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
  word_to_word_tr_with_vote_list: Array<Maybe<WordToWordTranslationWithVote>>;
};

export type WordTrVoteStatus = {
  __typename?: 'WordTrVoteStatus';
  downvotes: Scalars['Int']['output'];
  upvotes: Scalars['Int']['output'];
  word_to_word_translation_id: Scalars['String']['output'];
};

export type WordTrVoteStatusOutputRow = {
  __typename?: 'WordTrVoteStatusOutputRow';
  error: ErrorType;
  vote_status?: Maybe<WordTrVoteStatus>;
};

export type WordUpsertInput = {
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  language_code: Scalars['String']['input'];
  wordlike_string: Scalars['String']['input'];
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

export type WordWithDefinition = {
  __typename?: 'WordWithDefinition';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  definition?: Maybe<Scalars['String']['output']>;
  definition_id?: Maybe<Scalars['String']['output']>;
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordWithDefinitions = {
  __typename?: 'WordWithDefinitions';
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
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
  created_at: Scalars['DateTime']['output'];
  created_by_user: User;
  dialect_code?: Maybe<Scalars['String']['output']>;
  downvotes: Scalars['Int']['output'];
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  upvotes: Scalars['Int']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordWithVoteListConnection = {
  __typename?: 'WordWithVoteListConnection';
  edges: Array<WordWithVoteListEdge>;
  error: ErrorType;
  pageInfo: PageInfo;
};

export type WordWithVoteListEdge = {
  __typename?: 'WordWithVoteListEdge';
  cursor: Scalars['ID']['output'];
  node: WordWithDefinitions;
};

export type WordWithVoteOutput = {
  __typename?: 'WordWithVoteOutput';
  error: ErrorType;
  word_with_vote?: Maybe<WordWithVote>;
};

export type WordlikeString = {
  __typename?: 'WordlikeString';
  wordlike_string: Scalars['String']['output'];
  wordlike_string_id: Scalars['ID']['output'];
};

export type ZipMapResult = {
  __typename?: 'ZipMapResult';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message?: Maybe<Scalars['String']['output']>;
  resultZipUrl?: Maybe<Scalars['String']['output']>;
  status: SubscriptionStatus;
};

export type UserFieldsFragment = { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean };

export type PostFieldsFragment = { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type GetTotalPostsQueryVariables = Exact<{
  parent_id: Scalars['ID']['input'];
  parent_name: Scalars['String']['input'];
}>;


export type GetTotalPostsQuery = { __typename?: 'Query', getTotalPosts: { __typename?: 'PostCountOutput', error: ErrorType, total: number } };

export type PostsByParentQueryVariables = Exact<{
  parent_id: Scalars['ID']['input'];
  parent_name: Scalars['String']['input'];
}>;


export type PostsByParentQuery = { __typename?: 'Query', postsByParent: { __typename?: 'PostsByParentOutput', error: ErrorType, title: string, posts?: Array<{ __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }> | null } };

export type PostCreateMutationVariables = Exact<{
  content: Scalars['String']['input'];
  parentId: Scalars['Int']['input'];
  parentTable: Scalars['String']['input'];
  file_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type PostCreateMutation = { __typename?: 'Mutation', postCreateResolver: { __typename?: 'PostCreateOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

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

export type GenerateDataMutationVariables = Exact<{
  mapAmount?: InputMaybe<Scalars['Int']['input']>;
  mapsToLanguages?: InputMaybe<Array<LanguageInput> | LanguageInput>;
  userAmount?: InputMaybe<Scalars['Int']['input']>;
  wordAmount?: InputMaybe<Scalars['Int']['input']>;
  phraseAmount?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GenerateDataMutation = { __typename?: 'Mutation', generateData: { __typename?: 'GenericOutput', error: ErrorType } };

export type SubscribeToDataGenProgressSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToDataGenProgressSubscription = { __typename?: 'Subscription', DataGenerationReport: { __typename?: 'DataGenProgress', output: string, overallStatus: SubscriptionStatus } };

export type StopDataGenerationMutationVariables = Exact<{ [key: string]: never; }>;


export type StopDataGenerationMutation = { __typename?: 'Mutation', stopDataGeneration: { __typename?: 'GenericOutput', error: ErrorType } };

export type WordlikeStringFragmentFragment = { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string };

export type WordFragmentFragment = { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type WordDefinitionFragmentFragment = { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type WordWithDefinitionsFragmentFragment = { __typename?: 'WordWithDefinitions', word_id: string, word: string, created_at: any, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type WordDefinitionWithVoteFragmentFragment = { __typename?: 'WordDefinitionWithVote', word_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type WordWithVoteFragmentFragment = { __typename?: 'WordWithVote', dialect_code?: string | null, downvotes: number, geo_code?: string | null, language_code: string, upvotes: number, word: string, word_id: string, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type DefinitionVoteStatusFragmentFragment = { __typename?: 'DefinitionVoteStatus', definition_id: string, downvotes: number, upvotes: number };

export type WordVoteStatusFragmentFragment = { __typename?: 'WordVoteStatus', word_id: string, downvotes: number, upvotes: number };

export type WordWithVoteListEdgeFragmentFragment = { __typename?: 'WordWithVoteListEdge', cursor: string, node: { __typename?: 'WordWithDefinitions', word_id: string, word: string, created_at: any, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PageInfoFragmentFragment = { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null };

export type WordDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WordDefinitionReadQuery = { __typename?: 'Query', wordDefinitionRead: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type GetWordsByLanguageQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWordsByLanguageQuery = { __typename?: 'Query', getWordsByLanguage: { __typename?: 'WordWithVoteListConnection', error: ErrorType, edges: Array<{ __typename?: 'WordWithVoteListEdge', cursor: string, node: { __typename?: 'WordWithDefinitions', word_id: string, word: string, created_at: any, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetWordDefinitionsByWordIdQueryVariables = Exact<{
  word_id: Scalars['ID']['input'];
}>;


export type GetWordDefinitionsByWordIdQuery = { __typename?: 'Query', getWordDefinitionsByWordId: { __typename?: 'WordDefinitionWithVoteListOutput', error: ErrorType, word_definition_list: Array<{ __typename?: 'WordDefinitionWithVote', word_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } };

export type GetWordWithVoteByIdQueryVariables = Exact<{
  word_id: Scalars['ID']['input'];
}>;


export type GetWordWithVoteByIdQuery = { __typename?: 'Query', getWordWithVoteById: { __typename?: 'WordWithVoteOutput', error: ErrorType, word_with_vote?: { __typename?: 'WordWithVote', dialect_code?: string | null, downvotes: number, geo_code?: string | null, language_code: string, upvotes: number, word: string, word_id: string, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type WordDefinitionUpsertMutationVariables = Exact<{
  word_id: Scalars['ID']['input'];
  definition: Scalars['String']['input'];
}>;


export type WordDefinitionUpsertMutation = { __typename?: 'Mutation', wordDefinitionUpsert: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

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


export type WordUpsertMutation = { __typename?: 'Mutation', wordUpsert: { __typename?: 'WordOutput', error: ErrorType, word?: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type TextyDocumentFragmentFragment = { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type DocumentWordEntryFragmentFragment = { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } };

export type WordRangeFragmentFragment = { __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } };

export type WordRangesEdgeFragmentFragment = { __typename?: 'WordRangesEdge', cursor: string, node: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } }> };

export type DocumentEdgeFragmentFragment = { __typename?: 'DocumentEdge', cursor: string, node: { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type DocumentWordEntriesEdgeFragmentFragment = { __typename?: 'DocumentWordEntriesEdge', cursor: string, node: Array<{ __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }> };

export type DocumentUploadMutationVariables = Exact<{
  document: TextyDocumentInput;
}>;


export type DocumentUploadMutation = { __typename?: 'Mutation', documentUpload: { __typename?: 'DocumentUploadOutput', error: ErrorType, document?: { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type GetAllDocumentsQueryVariables = Exact<{
  input?: InputMaybe<LanguageInput>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllDocumentsQuery = { __typename?: 'Query', getAllDocuments: { __typename?: 'DocumentListConnection', error: ErrorType, edges: Array<{ __typename?: 'DocumentEdge', cursor: string, node: { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetDocumentQueryVariables = Exact<{
  document_id: Scalars['String']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', getDocument: { __typename?: 'GetDocumentOutput', error: ErrorType, document?: { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type GetDocumentWordEntriesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDocumentWordEntriesByDocumentIdQuery = { __typename?: 'Query', getDocumentWordEntriesByDocumentId: { __typename?: 'DocumentWordEntriesListConnection', error: ErrorType, edges: Array<{ __typename?: 'DocumentWordEntriesEdge', cursor: string, node: Array<{ __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }> }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetDocumentTextFromRangesQueryVariables = Exact<{
  ranges: Array<WordRangeInput> | WordRangeInput;
}>;


export type GetDocumentTextFromRangesQuery = { __typename?: 'Query', getDocumentTextFromRanges: { __typename?: 'TextFromRangesOutput', error: ErrorType, list: Array<{ __typename?: 'TextFromRange', begin_document_word_entry_id: string, end_document_word_entry_id: string, piece_of_text: string }> } };

export type GetWordRangesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetWordRangesByDocumentIdQuery = { __typename?: 'Query', getWordRangesByDocumentId: { __typename?: 'WordRangesListConnection', error: ErrorType, edges: Array<{ __typename?: 'WordRangesEdge', cursor: string, node: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } }> }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type ReadWordRangeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReadWordRangeQuery = { __typename?: 'Query', readWordRanges: { __typename?: 'WordRangesOutput', error: ErrorType, word_ranges: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

export type UpsertWordRangeMutationVariables = Exact<{
  begin_document_word_entry_id: Scalars['String']['input'];
  end_document_word_entry_id: Scalars['String']['input'];
}>;


export type UpsertWordRangeMutation = { __typename?: 'Mutation', upsertWordRanges: { __typename?: 'WordRangesOutput', error: ErrorType, word_ranges: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

export type EmailResponseMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type EmailResponseMutation = { __typename?: 'Mutation', emailResponseResolver: { __typename?: 'EmailResponseOutput', error: ErrorType } };

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  file_size: Scalars['Int']['input'];
  file_type: Scalars['String']['input'];
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'IFileOutput', error: ErrorType, file?: { __typename?: 'IFile', id: number } | null } };

export type FlagFragmentFragment = { __typename?: 'Flag', flag_id: string, parent_table: string, parent_id: string, name: FlagType, created_at: string, created_by: string };

export type WordDefinitionListEdgeFragmentFragment = { __typename?: 'WordDefinitionListEdge', cursor: string, node: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PhraseDefinitionListEdgeFragmentFragment = { __typename?: 'PhraseDefinitionListEdge', cursor: string, node: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type GetFlagsFromRefQueryVariables = Exact<{
  parent_table: TableNameType;
  parent_id: Scalars['String']['input'];
}>;


export type GetFlagsFromRefQuery = { __typename?: 'Query', getFlagsFromRef: { __typename?: 'FlagsOutput', error: ErrorType, flags: Array<{ __typename?: 'Flag', flag_id: string, parent_table: string, parent_id: string, name: FlagType, created_at: string, created_by: string }> } };

export type GetWordDefinitionsByFlagQueryVariables = Exact<{
  flag_name: FlagType;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetWordDefinitionsByFlagQuery = { __typename?: 'Query', getWordDefinitionsByFlag: { __typename?: 'WordDefinitionListConnection', error: ErrorType, edges: Array<{ __typename?: 'WordDefinitionListEdge', cursor: string, node: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetPhraseDefinitionsByFlagQueryVariables = Exact<{
  flag_name: FlagType;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetPhraseDefinitionsByFlagQuery = { __typename?: 'Query', getPhraseDefinitionsByFlag: { __typename?: 'PhraseDefinitionListConnection', error: ErrorType, edges: Array<{ __typename?: 'PhraseDefinitionListEdge', cursor: string, node: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type ToggleFlagWithRefMutationVariables = Exact<{
  parent_table: TableNameType;
  parent_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type ToggleFlagWithRefMutation = { __typename?: 'Mutation', toggleFlagWithRef: { __typename?: 'FlagsOutput', error: ErrorType, flags: Array<{ __typename?: 'Flag', flag_id: string, parent_table: string, parent_id: string, name: FlagType, created_at: string, created_by: string }> } };

export type ThreadFragmentFragment = { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string };

export type ForumFolderFragmentFragment = { __typename?: 'ForumFolder', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string };

export type ForumFolderNodeFragmentFragment = { __typename?: 'ForumFolderNode', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number };

export type ForumFragmentFragment = { __typename?: 'Forum', forum_id: string, name: string, description?: string | null, created_by: string };

export type ForumNodeFragmentFragment = { __typename?: 'ForumNode', forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number, total_topics: number };

export type ThreadEdgeFragmentFragment = { __typename?: 'ThreadEdge', cursor: string, node: { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string } };

export type ForumFolderEdgeFragmentFragment = { __typename?: 'ForumFolderEdge', cursor: string, node: { __typename?: 'ForumFolderNode', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number } };

export type ForumEdgeFragmentFragment = { __typename?: 'ForumEdge', cursor: string, node: { __typename?: 'ForumNode', forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number, total_topics: number } };

export type GetThreadByIdQueryVariables = Exact<{
  thread_id: Scalars['ID']['input'];
}>;


export type GetThreadByIdQuery = { __typename?: 'Query', threadRead: { __typename?: 'ThreadOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string } | null } };

export type GetThreadsListQueryVariables = Exact<{
  forum_folder_id: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetThreadsListQuery = { __typename?: 'Query', getThreadsList: { __typename?: 'ThreadListConnection', error: ErrorType, edges: Array<{ __typename?: 'ThreadEdge', cursor: string, node: { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type CreateThreadMutationVariables = Exact<{
  name: Scalars['String']['input'];
  forum_folder_id: Scalars['String']['input'];
}>;


export type CreateThreadMutation = { __typename?: 'Mutation', threadUpsert: { __typename?: 'ThreadOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string } | null } };

export type UpdateThreadMutationVariables = Exact<{
  thread_id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  forum_folder_id: Scalars['String']['input'];
}>;


export type UpdateThreadMutation = { __typename?: 'Mutation', threadUpsert: { __typename?: 'ThreadOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, forum_folder_id: string, name: string, created_by: string } | null } };

export type DeleteThreadMutationVariables = Exact<{
  thread_id: Scalars['ID']['input'];
}>;


export type DeleteThreadMutation = { __typename?: 'Mutation', threadDelete: { __typename?: 'ThreadDeleteOutput', error: ErrorType, thread_id: string } };

export type GetForumFolderByIdQueryVariables = Exact<{
  forum_folder_id: Scalars['ID']['input'];
}>;


export type GetForumFolderByIdQuery = { __typename?: 'Query', forumFolderRead: { __typename?: 'ForumFolderOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type GetForumFoldersListQueryVariables = Exact<{
  forum_id: Scalars['ID']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetForumFoldersListQuery = { __typename?: 'Query', getForumFoldersList: { __typename?: 'ForumFolderListConnection', error: ErrorType, edges: Array<{ __typename?: 'ForumFolderEdge', cursor: string, node: { __typename?: 'ForumFolderNode', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type CreateForumFolderMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  forum_id: Scalars['ID']['input'];
}>;


export type CreateForumFolderMutation = { __typename?: 'Mutation', forumFolderUpsert: { __typename?: 'ForumFolderOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type UpdateForumFolderMutationVariables = Exact<{
  forum_folder_id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  forum_id: Scalars['ID']['input'];
}>;


export type UpdateForumFolderMutation = { __typename?: 'Mutation', forumFolderUpsert: { __typename?: 'ForumFolderOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', forum_folder_id: string, forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type DeleteForumFolderMutationVariables = Exact<{
  forum_folder_id: Scalars['ID']['input'];
}>;


export type DeleteForumFolderMutation = { __typename?: 'Mutation', forumFolderDelete: { __typename?: 'ForumFolderDeleteOutput', error: ErrorType, forum_folder_id: string } };

export type GetForumByIdQueryVariables = Exact<{
  forum_id: Scalars['ID']['input'];
}>;


export type GetForumByIdQuery = { __typename?: 'Query', forumRead: { __typename?: 'ForumOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type GetForumsListQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetForumsListQuery = { __typename?: 'Query', getForumsList: { __typename?: 'ForumListConnection', error: ErrorType, edges: Array<{ __typename?: 'ForumEdge', cursor: string, node: { __typename?: 'ForumNode', forum_id: string, name: string, description?: string | null, created_by: string, total_posts: number, total_threads: number, total_topics: number } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type CreateForumMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateForumMutation = { __typename?: 'Mutation', forumUpsert: { __typename?: 'ForumOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type UpdateForumMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateForumMutation = { __typename?: 'Mutation', forumUpsert: { __typename?: 'ForumOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string, description?: string | null, created_by: string } | null } };

export type DeleteForumMutationVariables = Exact<{
  forum_id: Scalars['ID']['input'];
}>;


export type DeleteForumMutation = { __typename?: 'Mutation', forumDelete: { __typename?: 'ForumDeleteOutput', error: ErrorType, forum_id: string } };

export type MapDetailsOutputFragmentFragment = { __typename?: 'MapDetailsOutput', error: ErrorType, mapDetails?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, preview_file_id?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null };

export type MapDetailsOutputEdgeFragmentFragment = { __typename?: 'MapDetailsOutputEdge', cursor: string, node: { __typename?: 'MapDetailsOutput', error: ErrorType, mapDetails?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, preview_file_id?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type MapWordOrPhraseFragmentFragment = { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null, o_created_at: any, o_created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type MapWordsAndPhrasesEdgeFragmentFragment = { __typename?: 'MapWordsAndPhrasesEdge', cursor: string, node: { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null, o_created_at: any, o_created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type WordWithDefinitionFragmentFragment = { __typename?: 'WordWithDefinition', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type PhraseWithDefinitionFragmentFragment = { __typename?: 'PhraseWithDefinition', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type GetOrigMapWordsAndPhrasesQueryVariables = Exact<{
  original_map_id?: InputMaybe<Scalars['String']['input']>;
  lang: LanguageInput;
  filter?: InputMaybe<Scalars['String']['input']>;
  quickFilter?: InputMaybe<Scalars['String']['input']>;
  onlyNotTranslatedTo?: InputMaybe<LanguageInput>;
  onlyTranslatedTo?: InputMaybe<LanguageInput>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOrigMapWordsAndPhrasesQuery = { __typename?: 'Query', getOrigMapWordsAndPhrases: { __typename?: 'MapWordsAndPhrasesConnection', edges: Array<{ __typename?: 'MapWordsAndPhrasesEdge', cursor: string, node: { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null, o_created_at: any, o_created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetOrigMapWordsAndPhrasesCountQueryVariables = Exact<{
  original_map_id?: InputMaybe<Scalars['String']['input']>;
  lang: LanguageInput;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrigMapWordsAndPhrasesCountQuery = { __typename?: 'Query', getOrigMapWordsAndPhrasesCount: { __typename?: 'MapWordsAndPhrasesCountOutput', count?: number | null } };

export type GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables = Exact<{
  definition_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
}>;


export type GetMapWordOrPhraseAsOrigByDefinitionIdQuery = { __typename?: 'Query', getMapWordOrPhraseAsOrigByDefinitionId: { __typename?: 'MapWordOrPhraseAsOrigOutput', error: ErrorType, wordOrPhrase?: { __typename?: 'PhraseWithDefinition', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | { __typename?: 'WordWithDefinition', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type GetAllMapsListQueryVariables = Exact<{
  lang?: InputMaybe<LanguageInput>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllMapsListQuery = { __typename?: 'Query', getAllMapsList: { __typename?: 'MapListConnection', edges: Array<{ __typename?: 'MapDetailsOutputEdge', cursor: string, node: { __typename?: 'MapDetailsOutput', error: ErrorType, mapDetails?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, preview_file_id?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetMapDetailsQueryVariables = Exact<{
  map_id: Scalars['ID']['input'];
  is_original: Scalars['Boolean']['input'];
}>;


export type GetMapDetailsQuery = { __typename?: 'Query', getMapDetails: { __typename?: 'MapDetailsOutput', error: ErrorType, mapDetails?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, preview_file_id?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type IsAdminLoggedInQueryVariables = Exact<{
  input: IsAdminIdInput;
}>;


export type IsAdminLoggedInQuery = { __typename?: 'Query', loggedInIsAdmin: { __typename?: 'IsAdminIdOutput', isAdmin: boolean } };

export type StartZipMapDownloadMutationVariables = Exact<{
  language: LanguageInput;
}>;


export type StartZipMapDownloadMutation = { __typename?: 'Mutation', startZipMapDownload: { __typename?: 'StartZipMapOutput', error: ErrorType } };

export type SubscribeToZipMapSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToZipMapSubscription = { __typename?: 'Subscription', ZipMapReport: { __typename?: 'ZipMapResult', resultZipUrl?: string | null, status: SubscriptionStatus, message?: string | null, errors?: Array<string> | null } };

export type MapUploadMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  previewFileId?: InputMaybe<Scalars['String']['input']>;
  file_type: Scalars['String']['input'];
  file_size: Scalars['Int']['input'];
}>;


export type MapUploadMutation = { __typename?: 'Mutation', mapUpload: { __typename?: 'MapUploadOutput', error: ErrorType, mapDetailsOutput?: { __typename?: 'MapDetailsOutput', error: ErrorType, mapDetails?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, preview_file_id?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } | null } };

export type MapDeleteMutationVariables = Exact<{
  mapId: Scalars['String']['input'];
  is_original: Scalars['Boolean']['input'];
}>;


export type MapDeleteMutation = { __typename?: 'Mutation', mapDelete: { __typename?: 'MapDeleteOutput', error: ErrorType, deletedMapId?: string | null } };

export type MapsTranslationsResetMutationVariables = Exact<{ [key: string]: never; }>;


export type MapsTranslationsResetMutation = { __typename?: 'Mutation', mapsTranslationsReset: { __typename?: 'GenericOutput', error: ErrorType } };

export type MapsReTranslateMutationVariables = Exact<{
  forLangTag?: InputMaybe<Scalars['String']['input']>;
}>;


export type MapsReTranslateMutation = { __typename?: 'Mutation', mapsReTranslate: { __typename?: 'GenericOutput', error: ErrorType } };

export type MapVoteStatusFragmentFragment = { __typename?: 'MapVoteStatus', map_id: string, is_original: boolean, downvotes: number, upvotes: number };

export type ToggleMapVoteStatusMutationVariables = Exact<{
  map_id: Scalars['ID']['input'];
  is_original: Scalars['Boolean']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type ToggleMapVoteStatusMutation = { __typename?: 'Mutation', toggleMapVoteStatus: { __typename?: 'MapVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'MapVoteStatus', map_id: string, is_original: boolean, downvotes: number, upvotes: number } | null } };

export type ForceMarkAndRetranslateOriginalMapsIdsMutationVariables = Exact<{
  originalMapsIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ForceMarkAndRetranslateOriginalMapsIdsMutation = { __typename?: 'Mutation', forceMarkAndRetranslateOriginalMapsIds: { __typename?: 'GenericOutput', error: ErrorType } };

export type GetMapVoteStatusQueryVariables = Exact<{
  map_id: Scalars['ID']['input'];
  is_original: Scalars['Boolean']['input'];
}>;


export type GetMapVoteStatusQuery = { __typename?: 'Query', getMapVoteStatus: { __typename?: 'MapVoteStatusOutputRow', error: ErrorType, vote_status?: { __typename?: 'MapVoteStatus', map_id: string, is_original: boolean, downvotes: number, upvotes: number } | null } };

export type AddNotificationMutationVariables = Exact<{
  text: Scalars['String']['input'];
  user_id: Scalars['ID']['input'];
}>;


export type AddNotificationMutation = { __typename?: 'Mutation', addNotification: { __typename?: 'AddNotificationOutput', error: ErrorType, notification?: { __typename?: 'Notification', id: string, text: string, isNotified: boolean } | null } };

export type ListNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListNotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'NotificationListOutput', error: ErrorType, notifications: Array<{ __typename?: 'Notification', text: string, id: string, isNotified: boolean }> } };

export type DeleteNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', notificationDelete: { __typename?: 'NotificationDeleteOutput', error: ErrorType, notification_id: string } };

export type MarkNotificationReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'MarkNotificationReadOutput', error: ErrorType, notification_id: string } };

export type PericopeFragmentFragment = { __typename?: 'Pericope', pericope_id: string, start_word: string };

export type PericopeVoteStatusFragmentFragment = { __typename?: 'PericopeVoteStatus', pericope_id: string, upvotes: number, downvotes: number };

export type PericopeWithVoteFragmentFragment = { __typename?: 'PericopeWithVote', pericope_id: string, start_word: string, downvotes: number, upvotes: number };

export type PericopeWithVotesEdgeFragmentFragment = { __typename?: 'PericopeWithVotesEdge', cursor: string, node: Array<{ __typename?: 'PericopeWithVote', pericope_id: string, start_word: string, downvotes: number, upvotes: number }> };

export type GetPericopiesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetPericopiesByDocumentIdQuery = { __typename?: 'Query', getPericopiesByDocumentId: { __typename?: 'PericopeWithVotesListConnection', error: ErrorType, edges: Array<{ __typename?: 'PericopeWithVotesEdge', cursor: string, node: Array<{ __typename?: 'PericopeWithVote', pericope_id: string, start_word: string, downvotes: number, upvotes: number }> }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetPericopeVoteStatusQueryVariables = Exact<{
  pericope_id: Scalars['ID']['input'];
}>;


export type GetPericopeVoteStatusQuery = { __typename?: 'Query', getPericopeVoteStatus: { __typename?: 'PericopeVoteStatusOutput', error: ErrorType, vote_status?: { __typename?: 'PericopeVoteStatus', pericope_id: string, upvotes: number, downvotes: number } | null } };

export type TogglePericopeVoteStatusMutationVariables = Exact<{
  pericope_id: Scalars['ID']['input'];
  vote: Scalars['Boolean']['input'];
}>;


export type TogglePericopeVoteStatusMutation = { __typename?: 'Mutation', togglePericopeVoteStatus: { __typename?: 'PericopeVoteStatusOutput', error: ErrorType, vote_status?: { __typename?: 'PericopeVoteStatus', pericope_id: string, upvotes: number, downvotes: number } | null } };

export type UpsertPericopeMutationVariables = Exact<{
  startWord: Scalars['String']['input'];
}>;


export type UpsertPericopeMutation = { __typename?: 'Mutation', upsertPericopies: { __typename?: 'PericopiesOutput', error: ErrorType, pericopies: Array<{ __typename?: 'Pericope', pericope_id: string, start_word: string } | null> } };

export type PhraseFragmentFragment = { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type PhraseDefinitionFragmentFragment = { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type PhraseWithDefinitionsFragmentFragment = { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, downvotes: number, upvotes: number, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> };

export type PhraseDefinitionWithVoteFragmentFragment = { __typename?: 'PhraseDefinitionWithVote', phrase_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type PhraseWithVoteFragmentFragment = { __typename?: 'PhraseWithVote', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type PhraseVoteStatusFragmentFragment = { __typename?: 'PhraseVoteStatus', downvotes: number, phrase_id: string, upvotes: number };

export type PhraseWithVoteListEdgeFragmentFragment = { __typename?: 'PhraseWithVoteListEdge', cursor: string, node: { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, downvotes: number, upvotes: number, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } };

export type PhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PhraseDefinitionReadQuery = { __typename?: 'Query', phraseDefinitionRead: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type GetPhrasesByLanguageQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPhrasesByLanguageQuery = { __typename?: 'Query', getPhrasesByLanguage: { __typename?: 'PhraseWithVoteListConnection', error: ErrorType, edges: Array<{ __typename?: 'PhraseWithVoteListEdge', cursor: string, node: { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, downvotes: number, upvotes: number, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetPhraseDefinitionsByPhraseIdQueryVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
}>;


export type GetPhraseDefinitionsByPhraseIdQuery = { __typename?: 'Query', getPhraseDefinitionsByPhraseId: { __typename?: 'PhraseDefinitionWithVoteListOutput', error: ErrorType, phrase_definition_list: Array<{ __typename?: 'PhraseDefinitionWithVote', phrase_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } };

export type GetPhraseWithVoteByIdQueryVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
}>;


export type GetPhraseWithVoteByIdQuery = { __typename?: 'Query', getPhraseWithVoteById: { __typename?: 'PhraseWithVoteOutput', error: ErrorType, phrase_with_vote?: { __typename?: 'PhraseWithVote', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type PhraseDefinitionUpsertMutationVariables = Exact<{
  phrase_id: Scalars['ID']['input'];
  definition: Scalars['String']['input'];
}>;


export type PhraseDefinitionUpsertMutation = { __typename?: 'Mutation', phraseDefinitionUpsert: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

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


export type PhraseUpsertMutation = { __typename?: 'Mutation', phraseUpsert: { __typename?: 'PhraseOutput', error: ErrorType, phrase?: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type VersionFieldsFragment = { __typename?: 'Version', version_id: string, post_id: number, created_at: any, license_title: string, content: string };

export type VersionCreateMutationVariables = Exact<{
  postId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
  license_title: Scalars['String']['input'];
}>;


export type VersionCreateMutation = { __typename?: 'Mutation', versionCreateResolver: { __typename?: 'VersionCreateOutput', error: ErrorType, version?: { __typename?: 'Version', version_id: string, post_id: number, created_at: any, license_title: string, content: string } | null } };

export type PostReadQueryVariables = Exact<{
  postId: Scalars['ID']['input'];
}>;


export type PostReadQuery = { __typename?: 'Query', postReadResolver: { __typename?: 'PostReadOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type QuestionItemFragmentFragment = { __typename?: 'QuestionItem', question_item_id: string, item: string };

export type QuestionItemWithStatisticFragmentFragment = { __typename?: 'QuestionItemWithStatistic', question_item_id: string, item: string, statistic: number };

export type QuestionFragmentFragment = { __typename?: 'Question', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type QuestionWithStatisticFragmentFragment = { __typename?: 'QuestionWithStatistic', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItemWithStatistic', question_item_id: string, item: string, statistic: number }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type AnswerFragmentFragment = { __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } };

export type QuestionOnWordRangeFragmentFragment = { __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } };

export type QuestionOnWordRangesEdgeFragmentFragment = { __typename?: 'QuestionOnWordRangesEdge', cursor: string, node: Array<{ __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } }> };

export type GetQuestionOnWordRangesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetQuestionOnWordRangesByDocumentIdQuery = { __typename?: 'Query', getQuestionOnWordRangesByDocumentId: { __typename?: 'QuestionOnWordRangesListConnection', error: ErrorType, edges: Array<{ __typename?: 'QuestionOnWordRangesEdge', cursor: string, node: Array<{ __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } }> }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetAnswersByQuestionIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAnswersByQuestionIdQuery = { __typename?: 'Query', getAnswersByQuestionIds: { __typename?: 'AnswersOutput', error: ErrorType, answers: Array<{ __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } };

export type GetQuestionStatisticQueryVariables = Exact<{
  question_id: Scalars['ID']['input'];
}>;


export type GetQuestionStatisticQuery = { __typename?: 'Query', getQuestionStatistic: { __typename?: 'QuestionWithStatisticOutput', error: ErrorType, question_with_statistic: { __typename?: 'QuestionWithStatistic', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItemWithStatistic', question_item_id: string, item: string, statistic: number }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } };

export type CreateQuestionOnWordRangeMutationVariables = Exact<{
  begin_document_word_entry_id: Scalars['ID']['input'];
  end_document_word_entry_id: Scalars['ID']['input'];
  question: Scalars['String']['input'];
  question_items: Array<Scalars['String']['input']> | Scalars['String']['input'];
  question_type_is_multiselect: Scalars['Boolean']['input'];
}>;


export type CreateQuestionOnWordRangeMutation = { __typename?: 'Mutation', createQuestionOnWordRange: { __typename?: 'QuestionOnWordRangesOutput', error: ErrorType, questions: Array<{ __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean }, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, page: number, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

export type UpsertAnswerMutationVariables = Exact<{
  answer: Scalars['String']['input'];
  question_id: Scalars['ID']['input'];
  question_item_ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type UpsertAnswerMutation = { __typename?: 'Mutation', upsertAnswers: { __typename?: 'AnswersOutput', error: ErrorType, answers: Array<{ __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null> } };

export type SiteTextPhraseDefinitionFragmentFragment = { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type SiteTextWordDefinitionFragmentFragment = { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type SiteTextWordDefinitionEdgeFragmentFragment = { __typename?: 'SiteTextWordDefinitionEdge', cursor: string, node: { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } };

export type SiteTextPhraseDefinitionEdgeFragmentFragment = { __typename?: 'SiteTextPhraseDefinitionEdge', cursor: string, node: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } };

export type SiteTextDefinitionEdgeFragmentFragment = { __typename?: 'SiteTextDefinitionEdge', cursor: string, node: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } };

export type SiteTextLanguageFragmentFragment = { __typename?: 'SiteTextLanguage', language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type TranslationWithVoteListByLanguageFragmentFragment = { __typename?: 'TranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> };

export type SiteTextLanguageWithTranslationInfoFragmentFragment = { __typename?: 'SiteTextLanguageWithTranslationInfo', language_code: string, dialect_code?: string | null, geo_code?: string | null, total_count: number, translated_count: number };

export type GetAllSiteTextDefinitionsQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
  onlyNotTranslated?: InputMaybe<Scalars['Boolean']['input']>;
  onlyTranslated?: InputMaybe<Scalars['Boolean']['input']>;
  quickFilter?: InputMaybe<Scalars['String']['input']>;
  targetLanguage?: InputMaybe<LanguageInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAllSiteTextDefinitionsQuery = { __typename?: 'Query', getAllSiteTextDefinitions: { __typename?: 'SiteTextDefinitionListConnection', error: ErrorType, edges: Array<{ __typename?: 'SiteTextDefinitionEdge', cursor: string, node: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, totalEdges?: number | null } } };

export type GetAllTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getAllTranslationFromSiteTextDefinitionID: { __typename?: 'TranslationWithVoteListOutput', error: ErrorType, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> } };

export type SiteTextWordDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextWordDefinitionReadQuery = { __typename?: 'Query', siteTextWordDefinitionRead: { __typename?: 'SiteTextWordDefinitionOutput', error: ErrorType, site_text_word_definition?: { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type SiteTextPhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextPhraseDefinitionReadQuery = { __typename?: 'Query', siteTextPhraseDefinitionRead: { __typename?: 'SiteTextPhraseDefinitionOutput', error: ErrorType, site_text_phrase_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type UpsertSiteTextTranslationMutationVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
  translationlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertSiteTextTranslationMutation = { __typename?: 'Mutation', upsertSiteTextTranslation: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type GetAllSiteTextLanguageListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSiteTextLanguageListQuery = { __typename?: 'Query', getAllSiteTextLanguageList: { __typename?: 'SiteTextLanguageListOutput', error: ErrorType, site_text_language_list?: Array<{ __typename?: 'SiteTextLanguage', language_code: string, dialect_code?: string | null, geo_code?: string | null }> | null } };

export type GetRecommendedTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromSiteTextDefinitionID: { __typename?: 'TranslationWithVoteOutput', error: ErrorType, translation_with_vote?: { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables = Exact<{
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllRecommendedSiteTextTranslationListByLanguageQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationListByLanguage: { __typename?: 'TranslationWithVoteListByLanguageOutput', error: ErrorType, translation_with_vote_list_by_language: { __typename?: 'TranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> } } };

export type GetAllRecommendedSiteTextTranslationListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRecommendedSiteTextTranslationListQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationList: { __typename?: 'TranslationWithVoteListByLanguageListOutput', error: ErrorType, translation_with_vote_list_by_language_list?: Array<{ __typename?: 'TranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> }> | null } };

export type GetAllSiteTextLanguageListWithRateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSiteTextLanguageListWithRateQuery = { __typename?: 'Query', getAllSiteTextLanguageListWithRate: { __typename?: 'SiteTextLanguageWithTranslationInfoListOutput', error: ErrorType, site_text_language_with_translation_info_list: Array<{ __typename?: 'SiteTextLanguageWithTranslationInfo', language_code: string, dialect_code?: string | null, geo_code?: string | null, total_count: number, translated_count: number } | null> } };

export type SiteTextUpsertMutationVariables = Exact<{
  siteTextlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type SiteTextUpsertMutation = { __typename?: 'Mutation', siteTextUpsert: { __typename?: 'SiteTextDefinitionOutput', error: ErrorType, site_text_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type WordToWordTranslationWithVoteFragmentFragment = { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type WordToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PhraseToWordTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PhraseToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type WordToWordTranslationFragmentFragment = { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type WordToPhraseTranslationFragmentFragment = { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PhraseToWordTranslationFragmentFragment = { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type PhraseToPhraseTranslationFragmentFragment = { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } };

export type WordTrVoteStatusFragmentFragment = { __typename?: 'WordTrVoteStatus', word_to_word_translation_id: string, upvotes: number, downvotes: number };

export type WordToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'WordToPhraseTranslationVoteStatus', word_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToWordTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToWordTranslationVoteStatus', phrase_to_word_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToPhraseTranslationVoteStatus', phrase_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type GetTranslationLanguageInfoQueryVariables = Exact<{
  from_language_code: Scalars['ID']['input'];
  to_language_code?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetTranslationLanguageInfoQuery = { __typename?: 'Query', getLanguageTranslationInfo: { __typename?: 'TranslatedLanguageInfoOutput', error: ErrorType, googleTranslateTotalLangCount: number, liltTranslateTotalLangCount: number, smartcatTranslateTotalLangCount: number, deeplTranslateTotalLangCount: number, totalPhraseCount: number, totalWordCount: number, translatedMissingPhraseCount?: number | null, translatedMissingWordCount?: number | null } };

export type GetTranslationsByFromDefinitionIdQueryVariables = Exact<{
  definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTranslationsByFromDefinitionIdQuery = { __typename?: 'Query', getTranslationsByFromDefinitionId: { __typename?: 'TranslationWithVoteListOutput', error: ErrorType, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> } };

export type GetRecommendedTranslationFromDefinitionIdQueryVariables = Exact<{
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromDefinitionID: { __typename?: 'TranslationWithVoteOutput', error: ErrorType, translation_with_vote?: { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type GetRecommendedTranslationFromDefinitionIDsQueryVariables = Exact<{
  from_definition_ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  from_type_is_words: Array<Scalars['Boolean']['input']> | Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromDefinitionIDsQuery = { __typename?: 'Query', getRecommendedTranslationFromDefinitionIDs: { __typename?: 'TranslationWithVoteListOutput', error: ErrorType, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null> } };

export type LanguagesForBotTranslateQueryVariables = Exact<{
  botType: BotType;
}>;


export type LanguagesForBotTranslateQuery = { __typename?: 'Query', languagesForBotTranslate: { __typename?: 'LanguageListForBotTranslateOutput', error: ErrorType, languages?: Array<{ __typename?: 'LanguageForBotTranslate', code: string, name: string }> | null } };

export type TranslateWordsAndPhrasesByGoogleMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByGoogleMutation = { __typename?: 'Mutation', translateWordsAndPhrasesByGoogle: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesByChatGpt35MutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByChatGpt35Mutation = { __typename?: 'Mutation', translateWordsAndPhrasesByChatGPT35: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesByChatGpt4MutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByChatGpt4Mutation = { __typename?: 'Mutation', translateWordsAndPhrasesByChatGPT4: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateMissingWordsAndPhrasesByChatGptMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['String']['input'];
}>;


export type TranslateMissingWordsAndPhrasesByChatGptMutation = { __typename?: 'Mutation', translateMissingWordsAndPhrasesByChatGpt: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateMissingWordsAndPhrasesByGoogleMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  to_language_code: Scalars['String']['input'];
}>;


export type TranslateMissingWordsAndPhrasesByGoogleMutation = { __typename?: 'Mutation', translateMissingWordsAndPhrasesByGoogle: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateMissingWordsAndPhrasesByDeepLMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  to_language_code: Scalars['String']['input'];
}>;


export type TranslateMissingWordsAndPhrasesByDeepLMutation = { __typename?: 'Mutation', translateMissingWordsAndPhrasesByDeepL: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateMissingWordsAndPhrasesByLiltMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  to_language_code: Scalars['String']['input'];
}>;


export type TranslateMissingWordsAndPhrasesByLiltMutation = { __typename?: 'Mutation', translateMissingWordsAndPhrasesByLilt: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateMissingWordsAndPhrasesBySmartcatMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  to_language_code: Scalars['String']['input'];
}>;


export type TranslateMissingWordsAndPhrasesBySmartcatMutation = { __typename?: 'Mutation', translateMissingWordsAndPhrasesBySmartcat: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesByLiltMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByLiltMutation = { __typename?: 'Mutation', translateWordsAndPhrasesByLilt: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesBySmartcatMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesBySmartcatMutation = { __typename?: 'Mutation', translateWordsAndPhrasesBySmartcat: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesByDeepLMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByDeepLMutation = { __typename?: 'Mutation', translateWordsAndPhrasesByDeepL: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateAllWordsAndPhrasesByGoogleMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateAllWordsAndPhrasesByGoogleMutation = { __typename?: 'Mutation', translateAllWordsAndPhrasesByGoogle: { __typename?: 'GenericOutput', error: ErrorType } };

export type TranslateAllWordsAndPhrasesByLiltMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateAllWordsAndPhrasesByLiltMutation = { __typename?: 'Mutation', translateAllWordsAndPhrasesByLilt: { __typename?: 'GenericOutput', error: ErrorType } };

export type TranslateAllWordsAndPhrasesBySmartcatMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateAllWordsAndPhrasesBySmartcatMutation = { __typename?: 'Mutation', translateAllWordsAndPhrasesBySmartcat: { __typename?: 'GenericOutput', error: ErrorType } };

export type TranslateAllWordsAndPhrasesByDeepLMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateAllWordsAndPhrasesByDeepLMutation = { __typename?: 'Mutation', translateAllWordsAndPhrasesByDeepL: { __typename?: 'GenericOutput', error: ErrorType } };

export type StopBotTranslationMutationVariables = Exact<{ [key: string]: never; }>;


export type StopBotTranslationMutation = { __typename?: 'Mutation', stopBotTranslation: { __typename?: 'GenericOutput', error: ErrorType } };

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


export type UpsertTranslationMutation = { __typename?: 'Mutation', upsertTranslation: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

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


export type UpsertTranslationFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertTranslationFromWordAndDefinitionlikeString: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } } | null } };

export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables = Exact<{
  wordlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertWordDefinitionFromWordAndDefinitionlikeString: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: any, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables = Exact<{
  phraselike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: any, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, created_at: any, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } }, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null, is_bot: boolean } } | null } };

export type SubscribeToTranslationReportSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToTranslationReportSubscription = { __typename?: 'Subscription', TranslationReport: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number, status?: string | null, message?: string | null, errors?: Array<string> | null, total?: number | null, completed?: number | null } };

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

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  user_id
  avatar
  avatar_url
  is_bot
}
    `;
export const PostFieldsFragmentDoc = gql`
    fragment PostFields on Post {
  post_id
  content
  created_at
  file_url
  file_type
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
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
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const WordDefinitionWithVoteFragmentFragmentDoc = gql`
    fragment WordDefinitionWithVoteFragment on WordDefinitionWithVote {
  word_definition_id
  word {
    ...WordFragment
  }
  definition
  downvotes
  upvotes
  created_by_user {
    ...UserFields
  }
  created_at
}
    ${WordFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const WordWithVoteFragmentFragmentDoc = gql`
    fragment WordWithVoteFragment on WordWithVote {
  dialect_code
  downvotes
  geo_code
  language_code
  upvotes
  word
  word_id
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
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
export const WordDefinitionFragmentFragmentDoc = gql`
    fragment WordDefinitionFragment on WordDefinition {
  word_definition_id
  word {
    ...WordFragment
  }
  definition
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${WordFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const WordWithDefinitionsFragmentFragmentDoc = gql`
    fragment WordWithDefinitionsFragment on WordWithDefinitions {
  word_id
  word
  definitions {
    ...WordDefinitionFragment
  }
  created_at
  created_by_user {
    ...UserFields
  }
  downvotes
  upvotes
  language_code
  dialect_code
  geo_code
}
    ${WordDefinitionFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const WordWithVoteListEdgeFragmentFragmentDoc = gql`
    fragment WordWithVoteListEdgeFragment on WordWithVoteListEdge {
  cursor
  node {
    ...WordWithDefinitionsFragment
  }
}
    ${WordWithDefinitionsFragmentFragmentDoc}`;
export const PageInfoFragmentFragmentDoc = gql`
    fragment PageInfoFragment on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  totalEdges
}
    `;
export const WordlikeStringFragmentFragmentDoc = gql`
    fragment WordlikeStringFragment on WordlikeString {
  wordlike_string_id
  wordlike_string
}
    `;
export const DocumentWordEntryFragmentFragmentDoc = gql`
    fragment DocumentWordEntryFragment on DocumentWordEntry {
  document_word_entry_id
  document_id
  wordlike_string {
    ...WordlikeStringFragment
  }
  parent_document_word_entry_id
  page
}
    ${WordlikeStringFragmentFragmentDoc}`;
export const WordRangeFragmentFragmentDoc = gql`
    fragment WordRangeFragment on WordRange {
  word_range_id
  begin {
    ...DocumentWordEntryFragment
  }
  end {
    ...DocumentWordEntryFragment
  }
}
    ${DocumentWordEntryFragmentFragmentDoc}`;
export const WordRangesEdgeFragmentFragmentDoc = gql`
    fragment WordRangesEdgeFragment on WordRangesEdge {
  cursor
  node {
    ...WordRangeFragment
  }
}
    ${WordRangeFragmentFragmentDoc}`;
export const TextyDocumentFragmentFragmentDoc = gql`
    fragment TextyDocumentFragment on TextyDocument {
  document_id
  file_id
  file_name
  file_url
  language_code
  dialect_code
  geo_code
}
    `;
export const DocumentEdgeFragmentFragmentDoc = gql`
    fragment DocumentEdgeFragment on DocumentEdge {
  cursor
  node {
    ...TextyDocumentFragment
  }
}
    ${TextyDocumentFragmentFragmentDoc}`;
export const DocumentWordEntriesEdgeFragmentFragmentDoc = gql`
    fragment DocumentWordEntriesEdgeFragment on DocumentWordEntriesEdge {
  cursor
  node {
    ...DocumentWordEntryFragment
  }
}
    ${DocumentWordEntryFragmentFragmentDoc}`;
export const FlagFragmentFragmentDoc = gql`
    fragment FlagFragment on Flag {
  flag_id
  parent_table
  parent_id
  name
  created_at
  created_by
}
    `;
export const WordDefinitionListEdgeFragmentFragmentDoc = gql`
    fragment WordDefinitionListEdgeFragment on WordDefinitionListEdge {
  cursor
  node {
    ...WordDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const PhraseFragmentFragmentDoc = gql`
    fragment PhraseFragment on Phrase {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const PhraseDefinitionFragmentFragmentDoc = gql`
    fragment PhraseDefinitionFragment on PhraseDefinition {
  phrase_definition_id
  definition
  phrase {
    ...PhraseFragment
  }
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${PhraseFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const PhraseDefinitionListEdgeFragmentFragmentDoc = gql`
    fragment PhraseDefinitionListEdgeFragment on PhraseDefinitionListEdge {
  cursor
  node {
    ...PhraseDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const ForumFolderFragmentFragmentDoc = gql`
    fragment ForumFolderFragment on ForumFolder {
  forum_folder_id
  forum_id
  name
  description
  created_by
}
    `;
export const ForumFragmentFragmentDoc = gql`
    fragment ForumFragment on Forum {
  forum_id
  name
  description
  created_by
}
    `;
export const ThreadFragmentFragmentDoc = gql`
    fragment ThreadFragment on Thread {
  thread_id
  forum_folder_id
  name
  created_by
}
    `;
export const ThreadEdgeFragmentFragmentDoc = gql`
    fragment ThreadEdgeFragment on ThreadEdge {
  cursor
  node {
    ...ThreadFragment
  }
}
    ${ThreadFragmentFragmentDoc}`;
export const ForumFolderNodeFragmentFragmentDoc = gql`
    fragment ForumFolderNodeFragment on ForumFolderNode {
  forum_folder_id
  forum_id
  name
  description
  created_by
  total_posts
  total_threads
}
    `;
export const ForumFolderEdgeFragmentFragmentDoc = gql`
    fragment ForumFolderEdgeFragment on ForumFolderEdge {
  cursor
  node {
    ...ForumFolderNodeFragment
  }
}
    ${ForumFolderNodeFragmentFragmentDoc}`;
export const ForumNodeFragmentFragmentDoc = gql`
    fragment ForumNodeFragment on ForumNode {
  forum_id
  name
  description
  created_by
  total_posts
  total_threads
  total_topics
}
    `;
export const ForumEdgeFragmentFragmentDoc = gql`
    fragment ForumEdgeFragment on ForumEdge {
  cursor
  node {
    ...ForumNodeFragment
  }
}
    ${ForumNodeFragmentFragmentDoc}`;
export const MapDetailsOutputFragmentFragmentDoc = gql`
    fragment MapDetailsOutputFragment on MapDetailsOutput {
  error
  mapDetails {
    is_original
    original_map_id
    translated_map_id
    map_file_name
    translated_percent
    language {
      language_code
      dialect_code
      geo_code
    }
    created_at
    created_by
    map_file_name_with_langs
    preview_file_url
    preview_file_id
    content_file_url
    content_file_id
  }
}
    `;
export const MapDetailsOutputEdgeFragmentFragmentDoc = gql`
    fragment MapDetailsOutputEdgeFragment on MapDetailsOutputEdge {
  cursor
  node {
    ...MapDetailsOutputFragment
  }
}
    ${MapDetailsOutputFragmentFragmentDoc}`;
export const MapWordOrPhraseFragmentFragmentDoc = gql`
    fragment MapWordOrPhraseFragment on MapWordOrPhrase {
  id
  type
  o_id
  o_like_string
  o_definition
  o_definition_id
  o_language_code
  o_dialect_code
  o_geo_code
  o_created_at
  o_created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const MapWordsAndPhrasesEdgeFragmentFragmentDoc = gql`
    fragment MapWordsAndPhrasesEdgeFragment on MapWordsAndPhrasesEdge {
  cursor
  node {
    ...MapWordOrPhraseFragment
  }
}
    ${MapWordOrPhraseFragmentFragmentDoc}`;
export const WordWithDefinitionFragmentFragmentDoc = gql`
    fragment WordWithDefinitionFragment on WordWithDefinition {
  word_id
  word
  language_code
  dialect_code
  geo_code
  definition
  definition_id
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const PhraseWithDefinitionFragmentFragmentDoc = gql`
    fragment PhraseWithDefinitionFragment on PhraseWithDefinition {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  definition
  definition_id
  created_at
  created_by_user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const MapVoteStatusFragmentFragmentDoc = gql`
    fragment MapVoteStatusFragment on MapVoteStatus {
  map_id
  is_original
  downvotes
  upvotes
}
    `;
export const PericopeFragmentFragmentDoc = gql`
    fragment PericopeFragment on Pericope {
  pericope_id
  start_word
}
    `;
export const PericopeVoteStatusFragmentFragmentDoc = gql`
    fragment PericopeVoteStatusFragment on PericopeVoteStatus {
  pericope_id
  upvotes
  downvotes
}
    `;
export const PericopeWithVoteFragmentFragmentDoc = gql`
    fragment PericopeWithVoteFragment on PericopeWithVote {
  pericope_id
  start_word
  downvotes
  upvotes
}
    `;
export const PericopeWithVotesEdgeFragmentFragmentDoc = gql`
    fragment PericopeWithVotesEdgeFragment on PericopeWithVotesEdge {
  cursor
  node {
    ...PericopeWithVoteFragment
  }
}
    ${PericopeWithVoteFragmentFragmentDoc}`;
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
  created_by_user {
    ...UserFields
  }
}
    ${PhraseFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const PhraseWithVoteFragmentFragmentDoc = gql`
    fragment PhraseWithVoteFragment on PhraseWithVote {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  downvotes
  upvotes
  created_by_user {
    ...UserFields
  }
  created_at
}
    ${UserFieldsFragmentDoc}`;
export const PhraseVoteStatusFragmentFragmentDoc = gql`
    fragment PhraseVoteStatusFragment on PhraseVoteStatus {
  downvotes
  phrase_id
  upvotes
}
    `;
export const PhraseWithDefinitionsFragmentFragmentDoc = gql`
    fragment PhraseWithDefinitionsFragment on PhraseWithDefinitions {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  created_by_user {
    ...UserFields
  }
  created_at
  definitions {
    ...PhraseDefinitionFragment
  }
  downvotes
  upvotes
}
    ${UserFieldsFragmentDoc}
${PhraseDefinitionFragmentFragmentDoc}`;
export const PhraseWithVoteListEdgeFragmentFragmentDoc = gql`
    fragment PhraseWithVoteListEdgeFragment on PhraseWithVoteListEdge {
  cursor
  node {
    ...PhraseWithDefinitionsFragment
  }
}
    ${PhraseWithDefinitionsFragmentFragmentDoc}`;
export const VersionFieldsFragmentDoc = gql`
    fragment VersionFields on Version {
  version_id
  post_id
  created_at
  license_title
  content
}
    `;
export const QuestionItemFragmentFragmentDoc = gql`
    fragment QuestionItemFragment on QuestionItem {
  question_item_id
  item
}
    `;
export const QuestionFragmentFragmentDoc = gql`
    fragment QuestionFragment on Question {
  question_id
  parent_table
  parent_id
  question
  question_type_is_multiselect
  question_items {
    ...QuestionItemFragment
  }
  created_by_user {
    ...UserFields
  }
  created_at
}
    ${QuestionItemFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const QuestionItemWithStatisticFragmentFragmentDoc = gql`
    fragment QuestionItemWithStatisticFragment on QuestionItemWithStatistic {
  question_item_id
  item
  statistic
}
    `;
export const QuestionWithStatisticFragmentFragmentDoc = gql`
    fragment QuestionWithStatisticFragment on QuestionWithStatistic {
  question_id
  parent_table
  parent_id
  question
  question_type_is_multiselect
  question_items {
    ...QuestionItemWithStatisticFragment
  }
  created_by_user {
    ...UserFields
  }
  created_at
}
    ${QuestionItemWithStatisticFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const AnswerFragmentFragmentDoc = gql`
    fragment AnswerFragment on Answer {
  answer_id
  question_id
  answer
  question_items {
    ...QuestionItemFragment
  }
  created_by_user {
    ...UserFields
  }
  created_at
}
    ${QuestionItemFragmentFragmentDoc}
${UserFieldsFragmentDoc}`;
export const QuestionOnWordRangeFragmentFragmentDoc = gql`
    fragment QuestionOnWordRangeFragment on QuestionOnWordRange {
  question_id
  parent_table
  parent_id
  question
  question_type_is_multiselect
  question_items {
    ...QuestionItemFragment
  }
  created_by_user {
    ...UserFields
  }
  created_at
  begin {
    ...DocumentWordEntryFragment
  }
  end {
    ...DocumentWordEntryFragment
  }
}
    ${QuestionItemFragmentFragmentDoc}
${UserFieldsFragmentDoc}
${DocumentWordEntryFragmentFragmentDoc}`;
export const QuestionOnWordRangesEdgeFragmentFragmentDoc = gql`
    fragment QuestionOnWordRangesEdgeFragment on QuestionOnWordRangesEdge {
  cursor
  node {
    ...QuestionOnWordRangeFragment
  }
}
    ${QuestionOnWordRangeFragmentFragmentDoc}`;
export const SiteTextWordDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextWordDefinitionFragment on SiteTextWordDefinition {
  site_text_id
  word_definition {
    ...WordDefinitionFragment
  }
}
    ${WordDefinitionFragmentFragmentDoc}`;
export const SiteTextWordDefinitionEdgeFragmentFragmentDoc = gql`
    fragment SiteTextWordDefinitionEdgeFragment on SiteTextWordDefinitionEdge {
  cursor
  node {
    ...SiteTextWordDefinitionFragment
  }
}
    ${SiteTextWordDefinitionFragmentFragmentDoc}`;
export const SiteTextPhraseDefinitionFragmentFragmentDoc = gql`
    fragment SiteTextPhraseDefinitionFragment on SiteTextPhraseDefinition {
  site_text_id
  phrase_definition {
    ...PhraseDefinitionFragment
  }
}
    ${PhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextPhraseDefinitionEdgeFragmentFragmentDoc = gql`
    fragment SiteTextPhraseDefinitionEdgeFragment on SiteTextPhraseDefinitionEdge {
  cursor
  node {
    ...SiteTextPhraseDefinitionFragment
  }
}
    ${SiteTextPhraseDefinitionFragmentFragmentDoc}`;
export const SiteTextDefinitionEdgeFragmentFragmentDoc = gql`
    fragment SiteTextDefinitionEdgeFragment on SiteTextDefinitionEdge {
  cursor
  node {
    ...SiteTextPhraseDefinitionFragment
    ...SiteTextWordDefinitionFragment
  }
}
    ${SiteTextPhraseDefinitionFragmentFragmentDoc}
${SiteTextWordDefinitionFragmentFragmentDoc}`;
export const SiteTextLanguageFragmentFragmentDoc = gql`
    fragment SiteTextLanguageFragment on SiteTextLanguage {
  language_code
  dialect_code
  geo_code
}
    `;
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
export const TranslationWithVoteListByLanguageFragmentFragmentDoc = gql`
    fragment TranslationWithVoteListByLanguageFragment on TranslationWithVoteListByLanguage {
  dialect_code
  geo_code
  language_code
  translation_with_vote_list {
    ...WordToWordTranslationWithVoteFragment
    ...WordToPhraseTranslationWithVoteFragment
    ...PhraseToWordTranslationWithVoteFragment
    ...PhraseToPhraseTranslationWithVoteFragment
  }
}
    ${WordToWordTranslationWithVoteFragmentFragmentDoc}
${WordToPhraseTranslationWithVoteFragmentFragmentDoc}
${PhraseToWordTranslationWithVoteFragmentFragmentDoc}
${PhraseToPhraseTranslationWithVoteFragmentFragmentDoc}`;
export const SiteTextLanguageWithTranslationInfoFragmentFragmentDoc = gql`
    fragment SiteTextLanguageWithTranslationInfoFragment on SiteTextLanguageWithTranslationInfo {
  language_code
  dialect_code
  geo_code
  total_count
  translated_count
}
    `;
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
export const GetTotalPostsDocument = gql`
    query GetTotalPosts($parent_id: ID!, $parent_name: String!) {
  getTotalPosts(input: {parent_name: $parent_name, parent_id: $parent_id}) {
    error
    total
  }
}
    `;

/**
 * __useGetTotalPostsQuery__
 *
 * To run a query within a React component, call `useGetTotalPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTotalPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTotalPostsQuery({
 *   variables: {
 *      parent_id: // value for 'parent_id'
 *      parent_name: // value for 'parent_name'
 *   },
 * });
 */
export function useGetTotalPostsQuery(baseOptions: Apollo.QueryHookOptions<GetTotalPostsQuery, GetTotalPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTotalPostsQuery, GetTotalPostsQueryVariables>(GetTotalPostsDocument, options);
      }
export function useGetTotalPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTotalPostsQuery, GetTotalPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTotalPostsQuery, GetTotalPostsQueryVariables>(GetTotalPostsDocument, options);
        }
export type GetTotalPostsQueryHookResult = ReturnType<typeof useGetTotalPostsQuery>;
export type GetTotalPostsLazyQueryHookResult = ReturnType<typeof useGetTotalPostsLazyQuery>;
export type GetTotalPostsQueryResult = Apollo.QueryResult<GetTotalPostsQuery, GetTotalPostsQueryVariables>;
export const PostsByParentDocument = gql`
    query PostsByParent($parent_id: ID!, $parent_name: String!) {
  postsByParent(input: {parent_id: $parent_id, parent_name: $parent_name}) {
    error
    title
    posts {
      ...PostFields
    }
  }
}
    ${PostFieldsFragmentDoc}`;

/**
 * __usePostsByParentQuery__
 *
 * To run a query within a React component, call `usePostsByParentQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsByParentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsByParentQuery({
 *   variables: {
 *      parent_id: // value for 'parent_id'
 *      parent_name: // value for 'parent_name'
 *   },
 * });
 */
export function usePostsByParentQuery(baseOptions: Apollo.QueryHookOptions<PostsByParentQuery, PostsByParentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsByParentQuery, PostsByParentQueryVariables>(PostsByParentDocument, options);
      }
export function usePostsByParentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsByParentQuery, PostsByParentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsByParentQuery, PostsByParentQueryVariables>(PostsByParentDocument, options);
        }
export type PostsByParentQueryHookResult = ReturnType<typeof usePostsByParentQuery>;
export type PostsByParentLazyQueryHookResult = ReturnType<typeof usePostsByParentLazyQuery>;
export type PostsByParentQueryResult = Apollo.QueryResult<PostsByParentQuery, PostsByParentQueryVariables>;
export const PostCreateDocument = gql`
    mutation PostCreate($content: String!, $parentId: Int!, $parentTable: String!, $file_id: ID) {
  postCreateResolver(
    input: {content: $content, parent_id: $parentId, parent_table: $parentTable, file_id: $file_id}
  ) {
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
 *      parentTable: // value for 'parentTable'
 *      file_id: // value for 'file_id'
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
export const GenerateDataDocument = gql`
    mutation GenerateData($mapAmount: Int, $mapsToLanguages: [LanguageInput!], $userAmount: Int, $wordAmount: Int, $phraseAmount: Int) {
  generateData(
    input: {mapAmount: $mapAmount, mapsToLanguages: $mapsToLanguages, userAmount: $userAmount, wordAmount: $wordAmount, phraseAmount: $phraseAmount}
  ) {
    error
  }
}
    `;
export type GenerateDataMutationFn = Apollo.MutationFunction<GenerateDataMutation, GenerateDataMutationVariables>;

/**
 * __useGenerateDataMutation__
 *
 * To run a mutation, you first call `useGenerateDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateDataMutation, { data, loading, error }] = useGenerateDataMutation({
 *   variables: {
 *      mapAmount: // value for 'mapAmount'
 *      mapsToLanguages: // value for 'mapsToLanguages'
 *      userAmount: // value for 'userAmount'
 *      wordAmount: // value for 'wordAmount'
 *      phraseAmount: // value for 'phraseAmount'
 *   },
 * });
 */
export function useGenerateDataMutation(baseOptions?: Apollo.MutationHookOptions<GenerateDataMutation, GenerateDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateDataMutation, GenerateDataMutationVariables>(GenerateDataDocument, options);
      }
export type GenerateDataMutationHookResult = ReturnType<typeof useGenerateDataMutation>;
export type GenerateDataMutationResult = Apollo.MutationResult<GenerateDataMutation>;
export type GenerateDataMutationOptions = Apollo.BaseMutationOptions<GenerateDataMutation, GenerateDataMutationVariables>;
export const SubscribeToDataGenProgressDocument = gql`
    subscription SubscribeToDataGenProgress {
  DataGenerationReport {
    output
    overallStatus
  }
}
    `;

/**
 * __useSubscribeToDataGenProgressSubscription__
 *
 * To run a query within a React component, call `useSubscribeToDataGenProgressSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToDataGenProgressSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToDataGenProgressSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToDataGenProgressSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToDataGenProgressSubscription, SubscribeToDataGenProgressSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToDataGenProgressSubscription, SubscribeToDataGenProgressSubscriptionVariables>(SubscribeToDataGenProgressDocument, options);
      }
export type SubscribeToDataGenProgressSubscriptionHookResult = ReturnType<typeof useSubscribeToDataGenProgressSubscription>;
export type SubscribeToDataGenProgressSubscriptionResult = Apollo.SubscriptionResult<SubscribeToDataGenProgressSubscription>;
export const StopDataGenerationDocument = gql`
    mutation StopDataGeneration {
  stopDataGeneration {
    error
  }
}
    `;
export type StopDataGenerationMutationFn = Apollo.MutationFunction<StopDataGenerationMutation, StopDataGenerationMutationVariables>;

/**
 * __useStopDataGenerationMutation__
 *
 * To run a mutation, you first call `useStopDataGenerationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopDataGenerationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopDataGenerationMutation, { data, loading, error }] = useStopDataGenerationMutation({
 *   variables: {
 *   },
 * });
 */
export function useStopDataGenerationMutation(baseOptions?: Apollo.MutationHookOptions<StopDataGenerationMutation, StopDataGenerationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopDataGenerationMutation, StopDataGenerationMutationVariables>(StopDataGenerationDocument, options);
      }
export type StopDataGenerationMutationHookResult = ReturnType<typeof useStopDataGenerationMutation>;
export type StopDataGenerationMutationResult = Apollo.MutationResult<StopDataGenerationMutation>;
export type StopDataGenerationMutationOptions = Apollo.BaseMutationOptions<StopDataGenerationMutation, StopDataGenerationMutationVariables>;
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
    query GetWordsByLanguage($first: Int!, $after: ID, $language_code: String!, $dialect_code: String, $geo_code: String, $filter: String) {
  getWordsByLanguage(
    first: $first
    after: $after
    input: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code, filter: $filter}
  ) {
    error
    edges {
      ...WordWithVoteListEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${WordWithVoteListEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

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
 *      first: // value for 'first'
 *      after: // value for 'after'
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
export const DocumentUploadDocument = gql`
    mutation DocumentUpload($document: TextyDocumentInput!) {
  documentUpload(input: {document: $document}) {
    error
    document {
      ...TextyDocumentFragment
    }
  }
}
    ${TextyDocumentFragmentFragmentDoc}`;
export type DocumentUploadMutationFn = Apollo.MutationFunction<DocumentUploadMutation, DocumentUploadMutationVariables>;

/**
 * __useDocumentUploadMutation__
 *
 * To run a mutation, you first call `useDocumentUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDocumentUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [documentUploadMutation, { data, loading, error }] = useDocumentUploadMutation({
 *   variables: {
 *      document: // value for 'document'
 *   },
 * });
 */
export function useDocumentUploadMutation(baseOptions?: Apollo.MutationHookOptions<DocumentUploadMutation, DocumentUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DocumentUploadMutation, DocumentUploadMutationVariables>(DocumentUploadDocument, options);
      }
export type DocumentUploadMutationHookResult = ReturnType<typeof useDocumentUploadMutation>;
export type DocumentUploadMutationResult = Apollo.MutationResult<DocumentUploadMutation>;
export type DocumentUploadMutationOptions = Apollo.BaseMutationOptions<DocumentUploadMutation, DocumentUploadMutationVariables>;
export const GetAllDocumentsDocument = gql`
    query GetAllDocuments($input: LanguageInput, $after: ID, $first: Int) {
  getAllDocuments(input: $input, after: $after, first: $first) {
    error
    edges {
      ...DocumentEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${DocumentEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetAllDocumentsQuery__
 *
 * To run a query within a React component, call `useGetAllDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllDocumentsQuery({
 *   variables: {
 *      input: // value for 'input'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetAllDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllDocumentsQuery, GetAllDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllDocumentsQuery, GetAllDocumentsQueryVariables>(GetAllDocumentsDocument, options);
      }
export function useGetAllDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllDocumentsQuery, GetAllDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllDocumentsQuery, GetAllDocumentsQueryVariables>(GetAllDocumentsDocument, options);
        }
export type GetAllDocumentsQueryHookResult = ReturnType<typeof useGetAllDocumentsQuery>;
export type GetAllDocumentsLazyQueryHookResult = ReturnType<typeof useGetAllDocumentsLazyQuery>;
export type GetAllDocumentsQueryResult = Apollo.QueryResult<GetAllDocumentsQuery, GetAllDocumentsQueryVariables>;
export const GetDocumentDocument = gql`
    query GetDocument($document_id: String!) {
  getDocument(input: {document_id: $document_id}) {
    error
    document {
      ...TextyDocumentFragment
    }
  }
}
    ${TextyDocumentFragmentFragmentDoc}`;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      document_id: // value for 'document_id'
 *   },
 * });
 */
export function useGetDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
      }
export function useGetDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export const GetDocumentWordEntriesByDocumentIdDocument = gql`
    query GetDocumentWordEntriesByDocumentId($document_id: ID!, $after: ID, $first: Int) {
  getDocumentWordEntriesByDocumentId(
    document_id: $document_id
    after: $after
    first: $first
  ) {
    error
    edges {
      ...DocumentWordEntriesEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${DocumentWordEntriesEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetDocumentWordEntriesByDocumentIdQuery__
 *
 * To run a query within a React component, call `useGetDocumentWordEntriesByDocumentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentWordEntriesByDocumentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentWordEntriesByDocumentIdQuery({
 *   variables: {
 *      document_id: // value for 'document_id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetDocumentWordEntriesByDocumentIdQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentWordEntriesByDocumentIdQuery, GetDocumentWordEntriesByDocumentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentWordEntriesByDocumentIdQuery, GetDocumentWordEntriesByDocumentIdQueryVariables>(GetDocumentWordEntriesByDocumentIdDocument, options);
      }
export function useGetDocumentWordEntriesByDocumentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentWordEntriesByDocumentIdQuery, GetDocumentWordEntriesByDocumentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentWordEntriesByDocumentIdQuery, GetDocumentWordEntriesByDocumentIdQueryVariables>(GetDocumentWordEntriesByDocumentIdDocument, options);
        }
export type GetDocumentWordEntriesByDocumentIdQueryHookResult = ReturnType<typeof useGetDocumentWordEntriesByDocumentIdQuery>;
export type GetDocumentWordEntriesByDocumentIdLazyQueryHookResult = ReturnType<typeof useGetDocumentWordEntriesByDocumentIdLazyQuery>;
export type GetDocumentWordEntriesByDocumentIdQueryResult = Apollo.QueryResult<GetDocumentWordEntriesByDocumentIdQuery, GetDocumentWordEntriesByDocumentIdQueryVariables>;
export const GetDocumentTextFromRangesDocument = gql`
    query GetDocumentTextFromRanges($ranges: [WordRangeInput!]!) {
  getDocumentTextFromRanges(ranges: $ranges) {
    error
    list {
      begin_document_word_entry_id
      end_document_word_entry_id
      piece_of_text
    }
  }
}
    `;

/**
 * __useGetDocumentTextFromRangesQuery__
 *
 * To run a query within a React component, call `useGetDocumentTextFromRangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentTextFromRangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentTextFromRangesQuery({
 *   variables: {
 *      ranges: // value for 'ranges'
 *   },
 * });
 */
export function useGetDocumentTextFromRangesQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentTextFromRangesQuery, GetDocumentTextFromRangesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentTextFromRangesQuery, GetDocumentTextFromRangesQueryVariables>(GetDocumentTextFromRangesDocument, options);
      }
export function useGetDocumentTextFromRangesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentTextFromRangesQuery, GetDocumentTextFromRangesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentTextFromRangesQuery, GetDocumentTextFromRangesQueryVariables>(GetDocumentTextFromRangesDocument, options);
        }
export type GetDocumentTextFromRangesQueryHookResult = ReturnType<typeof useGetDocumentTextFromRangesQuery>;
export type GetDocumentTextFromRangesLazyQueryHookResult = ReturnType<typeof useGetDocumentTextFromRangesLazyQuery>;
export type GetDocumentTextFromRangesQueryResult = Apollo.QueryResult<GetDocumentTextFromRangesQuery, GetDocumentTextFromRangesQueryVariables>;
export const GetWordRangesByDocumentIdDocument = gql`
    query GetWordRangesByDocumentId($document_id: ID!, $after: ID, $first: Int) {
  getWordRangesByDocumentId(
    document_id: $document_id
    after: $after
    first: $first
  ) {
    error
    edges {
      ...WordRangesEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${WordRangesEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetWordRangesByDocumentIdQuery__
 *
 * To run a query within a React component, call `useGetWordRangesByDocumentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWordRangesByDocumentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWordRangesByDocumentIdQuery({
 *   variables: {
 *      document_id: // value for 'document_id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetWordRangesByDocumentIdQuery(baseOptions: Apollo.QueryHookOptions<GetWordRangesByDocumentIdQuery, GetWordRangesByDocumentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWordRangesByDocumentIdQuery, GetWordRangesByDocumentIdQueryVariables>(GetWordRangesByDocumentIdDocument, options);
      }
export function useGetWordRangesByDocumentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWordRangesByDocumentIdQuery, GetWordRangesByDocumentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWordRangesByDocumentIdQuery, GetWordRangesByDocumentIdQueryVariables>(GetWordRangesByDocumentIdDocument, options);
        }
export type GetWordRangesByDocumentIdQueryHookResult = ReturnType<typeof useGetWordRangesByDocumentIdQuery>;
export type GetWordRangesByDocumentIdLazyQueryHookResult = ReturnType<typeof useGetWordRangesByDocumentIdLazyQuery>;
export type GetWordRangesByDocumentIdQueryResult = Apollo.QueryResult<GetWordRangesByDocumentIdQuery, GetWordRangesByDocumentIdQueryVariables>;
export const ReadWordRangeDocument = gql`
    query ReadWordRange($id: ID!) {
  readWordRanges(ids: [$id]) {
    error
    word_ranges {
      ...WordRangeFragment
    }
  }
}
    ${WordRangeFragmentFragmentDoc}`;

/**
 * __useReadWordRangeQuery__
 *
 * To run a query within a React component, call `useReadWordRangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadWordRangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadWordRangeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReadWordRangeQuery(baseOptions: Apollo.QueryHookOptions<ReadWordRangeQuery, ReadWordRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReadWordRangeQuery, ReadWordRangeQueryVariables>(ReadWordRangeDocument, options);
      }
export function useReadWordRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReadWordRangeQuery, ReadWordRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReadWordRangeQuery, ReadWordRangeQueryVariables>(ReadWordRangeDocument, options);
        }
export type ReadWordRangeQueryHookResult = ReturnType<typeof useReadWordRangeQuery>;
export type ReadWordRangeLazyQueryHookResult = ReturnType<typeof useReadWordRangeLazyQuery>;
export type ReadWordRangeQueryResult = Apollo.QueryResult<ReadWordRangeQuery, ReadWordRangeQueryVariables>;
export const UpsertWordRangeDocument = gql`
    mutation UpsertWordRange($begin_document_word_entry_id: String!, $end_document_word_entry_id: String!) {
  upsertWordRanges(
    input: [{begin_document_word_entry_id: $begin_document_word_entry_id, end_document_word_entry_id: $end_document_word_entry_id}]
  ) {
    error
    word_ranges {
      ...WordRangeFragment
    }
  }
}
    ${WordRangeFragmentFragmentDoc}`;
export type UpsertWordRangeMutationFn = Apollo.MutationFunction<UpsertWordRangeMutation, UpsertWordRangeMutationVariables>;

/**
 * __useUpsertWordRangeMutation__
 *
 * To run a mutation, you first call `useUpsertWordRangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertWordRangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertWordRangeMutation, { data, loading, error }] = useUpsertWordRangeMutation({
 *   variables: {
 *      begin_document_word_entry_id: // value for 'begin_document_word_entry_id'
 *      end_document_word_entry_id: // value for 'end_document_word_entry_id'
 *   },
 * });
 */
export function useUpsertWordRangeMutation(baseOptions?: Apollo.MutationHookOptions<UpsertWordRangeMutation, UpsertWordRangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertWordRangeMutation, UpsertWordRangeMutationVariables>(UpsertWordRangeDocument, options);
      }
export type UpsertWordRangeMutationHookResult = ReturnType<typeof useUpsertWordRangeMutation>;
export type UpsertWordRangeMutationResult = Apollo.MutationResult<UpsertWordRangeMutation>;
export type UpsertWordRangeMutationOptions = Apollo.BaseMutationOptions<UpsertWordRangeMutation, UpsertWordRangeMutationVariables>;
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
export const UploadFileDocument = gql`
    mutation UploadFile($file: Upload!, $file_size: Int!, $file_type: String!) {
  uploadFile(file: $file, file_size: $file_size, file_type: $file_type) {
    error
    file {
      id
    }
  }
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *      file_size: // value for 'file_size'
 *      file_type: // value for 'file_type'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const GetFlagsFromRefDocument = gql`
    query GetFlagsFromRef($parent_table: TableNameType!, $parent_id: String!) {
  getFlagsFromRef(parent_table: $parent_table, parent_id: $parent_id) {
    error
    flags {
      ...FlagFragment
    }
  }
}
    ${FlagFragmentFragmentDoc}`;

/**
 * __useGetFlagsFromRefQuery__
 *
 * To run a query within a React component, call `useGetFlagsFromRefQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFlagsFromRefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFlagsFromRefQuery({
 *   variables: {
 *      parent_table: // value for 'parent_table'
 *      parent_id: // value for 'parent_id'
 *   },
 * });
 */
export function useGetFlagsFromRefQuery(baseOptions: Apollo.QueryHookOptions<GetFlagsFromRefQuery, GetFlagsFromRefQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFlagsFromRefQuery, GetFlagsFromRefQueryVariables>(GetFlagsFromRefDocument, options);
      }
export function useGetFlagsFromRefLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFlagsFromRefQuery, GetFlagsFromRefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFlagsFromRefQuery, GetFlagsFromRefQueryVariables>(GetFlagsFromRefDocument, options);
        }
export type GetFlagsFromRefQueryHookResult = ReturnType<typeof useGetFlagsFromRefQuery>;
export type GetFlagsFromRefLazyQueryHookResult = ReturnType<typeof useGetFlagsFromRefLazyQuery>;
export type GetFlagsFromRefQueryResult = Apollo.QueryResult<GetFlagsFromRefQuery, GetFlagsFromRefQueryVariables>;
export const GetWordDefinitionsByFlagDocument = gql`
    query GetWordDefinitionsByFlag($flag_name: FlagType!, $first: Int, $after: ID) {
  getWordDefinitionsByFlag(flag_name: $flag_name, first: $first, after: $after) {
    error
    edges {
      ...WordDefinitionListEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${WordDefinitionListEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetWordDefinitionsByFlagQuery__
 *
 * To run a query within a React component, call `useGetWordDefinitionsByFlagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWordDefinitionsByFlagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWordDefinitionsByFlagQuery({
 *   variables: {
 *      flag_name: // value for 'flag_name'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetWordDefinitionsByFlagQuery(baseOptions: Apollo.QueryHookOptions<GetWordDefinitionsByFlagQuery, GetWordDefinitionsByFlagQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWordDefinitionsByFlagQuery, GetWordDefinitionsByFlagQueryVariables>(GetWordDefinitionsByFlagDocument, options);
      }
export function useGetWordDefinitionsByFlagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWordDefinitionsByFlagQuery, GetWordDefinitionsByFlagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWordDefinitionsByFlagQuery, GetWordDefinitionsByFlagQueryVariables>(GetWordDefinitionsByFlagDocument, options);
        }
export type GetWordDefinitionsByFlagQueryHookResult = ReturnType<typeof useGetWordDefinitionsByFlagQuery>;
export type GetWordDefinitionsByFlagLazyQueryHookResult = ReturnType<typeof useGetWordDefinitionsByFlagLazyQuery>;
export type GetWordDefinitionsByFlagQueryResult = Apollo.QueryResult<GetWordDefinitionsByFlagQuery, GetWordDefinitionsByFlagQueryVariables>;
export const GetPhraseDefinitionsByFlagDocument = gql`
    query GetPhraseDefinitionsByFlag($flag_name: FlagType!, $first: Int, $after: ID) {
  getPhraseDefinitionsByFlag(flag_name: $flag_name, first: $first, after: $after) {
    error
    edges {
      ...PhraseDefinitionListEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${PhraseDefinitionListEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetPhraseDefinitionsByFlagQuery__
 *
 * To run a query within a React component, call `useGetPhraseDefinitionsByFlagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPhraseDefinitionsByFlagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPhraseDefinitionsByFlagQuery({
 *   variables: {
 *      flag_name: // value for 'flag_name'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetPhraseDefinitionsByFlagQuery(baseOptions: Apollo.QueryHookOptions<GetPhraseDefinitionsByFlagQuery, GetPhraseDefinitionsByFlagQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPhraseDefinitionsByFlagQuery, GetPhraseDefinitionsByFlagQueryVariables>(GetPhraseDefinitionsByFlagDocument, options);
      }
export function useGetPhraseDefinitionsByFlagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPhraseDefinitionsByFlagQuery, GetPhraseDefinitionsByFlagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPhraseDefinitionsByFlagQuery, GetPhraseDefinitionsByFlagQueryVariables>(GetPhraseDefinitionsByFlagDocument, options);
        }
export type GetPhraseDefinitionsByFlagQueryHookResult = ReturnType<typeof useGetPhraseDefinitionsByFlagQuery>;
export type GetPhraseDefinitionsByFlagLazyQueryHookResult = ReturnType<typeof useGetPhraseDefinitionsByFlagLazyQuery>;
export type GetPhraseDefinitionsByFlagQueryResult = Apollo.QueryResult<GetPhraseDefinitionsByFlagQuery, GetPhraseDefinitionsByFlagQueryVariables>;
export const ToggleFlagWithRefDocument = gql`
    mutation ToggleFlagWithRef($parent_table: TableNameType!, $parent_id: String!, $name: String!) {
  toggleFlagWithRef(
    parent_table: $parent_table
    parent_id: $parent_id
    name: $name
  ) {
    error
    flags {
      ...FlagFragment
    }
  }
}
    ${FlagFragmentFragmentDoc}`;
export type ToggleFlagWithRefMutationFn = Apollo.MutationFunction<ToggleFlagWithRefMutation, ToggleFlagWithRefMutationVariables>;

/**
 * __useToggleFlagWithRefMutation__
 *
 * To run a mutation, you first call `useToggleFlagWithRefMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleFlagWithRefMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleFlagWithRefMutation, { data, loading, error }] = useToggleFlagWithRefMutation({
 *   variables: {
 *      parent_table: // value for 'parent_table'
 *      parent_id: // value for 'parent_id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useToggleFlagWithRefMutation(baseOptions?: Apollo.MutationHookOptions<ToggleFlagWithRefMutation, ToggleFlagWithRefMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleFlagWithRefMutation, ToggleFlagWithRefMutationVariables>(ToggleFlagWithRefDocument, options);
      }
export type ToggleFlagWithRefMutationHookResult = ReturnType<typeof useToggleFlagWithRefMutation>;
export type ToggleFlagWithRefMutationResult = Apollo.MutationResult<ToggleFlagWithRefMutation>;
export type ToggleFlagWithRefMutationOptions = Apollo.BaseMutationOptions<ToggleFlagWithRefMutation, ToggleFlagWithRefMutationVariables>;
export const GetThreadByIdDocument = gql`
    query GetThreadById($thread_id: ID!) {
  threadRead(thread_id: $thread_id) {
    error
    thread {
      ...ThreadFragment
    }
  }
}
    ${ThreadFragmentFragmentDoc}`;

/**
 * __useGetThreadByIdQuery__
 *
 * To run a query within a React component, call `useGetThreadByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadByIdQuery({
 *   variables: {
 *      thread_id: // value for 'thread_id'
 *   },
 * });
 */
export function useGetThreadByIdQuery(baseOptions: Apollo.QueryHookOptions<GetThreadByIdQuery, GetThreadByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GetThreadByIdDocument, options);
      }
export function useGetThreadByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadByIdQuery, GetThreadByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GetThreadByIdDocument, options);
        }
export type GetThreadByIdQueryHookResult = ReturnType<typeof useGetThreadByIdQuery>;
export type GetThreadByIdLazyQueryHookResult = ReturnType<typeof useGetThreadByIdLazyQuery>;
export type GetThreadByIdQueryResult = Apollo.QueryResult<GetThreadByIdQuery, GetThreadByIdQueryVariables>;
export const GetThreadsListDocument = gql`
    query GetThreadsList($forum_folder_id: String!, $filter: String, $after: ID, $first: Int) {
  getThreadsList(
    forum_folder_id: $forum_folder_id
    filter: $filter
    after: $after
    first: $first
  ) {
    error
    edges {
      ...ThreadEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${ThreadEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetThreadsListQuery__
 *
 * To run a query within a React component, call `useGetThreadsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadsListQuery({
 *   variables: {
 *      forum_folder_id: // value for 'forum_folder_id'
 *      filter: // value for 'filter'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetThreadsListQuery(baseOptions: Apollo.QueryHookOptions<GetThreadsListQuery, GetThreadsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadsListQuery, GetThreadsListQueryVariables>(GetThreadsListDocument, options);
      }
export function useGetThreadsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadsListQuery, GetThreadsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadsListQuery, GetThreadsListQueryVariables>(GetThreadsListDocument, options);
        }
export type GetThreadsListQueryHookResult = ReturnType<typeof useGetThreadsListQuery>;
export type GetThreadsListLazyQueryHookResult = ReturnType<typeof useGetThreadsListLazyQuery>;
export type GetThreadsListQueryResult = Apollo.QueryResult<GetThreadsListQuery, GetThreadsListQueryVariables>;
export const CreateThreadDocument = gql`
    mutation CreateThread($name: String!, $forum_folder_id: String!) {
  threadUpsert(input: {name: $name, forum_folder_id: $forum_folder_id}) {
    error
    thread {
      ...ThreadFragment
    }
  }
}
    ${ThreadFragmentFragmentDoc}`;
export type CreateThreadMutationFn = Apollo.MutationFunction<CreateThreadMutation, CreateThreadMutationVariables>;

/**
 * __useCreateThreadMutation__
 *
 * To run a mutation, you first call `useCreateThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadMutation, { data, loading, error }] = useCreateThreadMutation({
 *   variables: {
 *      name: // value for 'name'
 *      forum_folder_id: // value for 'forum_folder_id'
 *   },
 * });
 */
export function useCreateThreadMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadMutation, CreateThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CreateThreadDocument, options);
      }
export type CreateThreadMutationHookResult = ReturnType<typeof useCreateThreadMutation>;
export type CreateThreadMutationResult = Apollo.MutationResult<CreateThreadMutation>;
export type CreateThreadMutationOptions = Apollo.BaseMutationOptions<CreateThreadMutation, CreateThreadMutationVariables>;
export const UpdateThreadDocument = gql`
    mutation UpdateThread($thread_id: ID, $name: String!, $forum_folder_id: String!) {
  threadUpsert(
    input: {forum_folder_id: $forum_folder_id, name: $name, thread_id: $thread_id}
  ) {
    error
    thread {
      ...ThreadFragment
    }
  }
}
    ${ThreadFragmentFragmentDoc}`;
export type UpdateThreadMutationFn = Apollo.MutationFunction<UpdateThreadMutation, UpdateThreadMutationVariables>;

/**
 * __useUpdateThreadMutation__
 *
 * To run a mutation, you first call `useUpdateThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadMutation, { data, loading, error }] = useUpdateThreadMutation({
 *   variables: {
 *      thread_id: // value for 'thread_id'
 *      name: // value for 'name'
 *      forum_folder_id: // value for 'forum_folder_id'
 *   },
 * });
 */
export function useUpdateThreadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadMutation, UpdateThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadMutation, UpdateThreadMutationVariables>(UpdateThreadDocument, options);
      }
export type UpdateThreadMutationHookResult = ReturnType<typeof useUpdateThreadMutation>;
export type UpdateThreadMutationResult = Apollo.MutationResult<UpdateThreadMutation>;
export type UpdateThreadMutationOptions = Apollo.BaseMutationOptions<UpdateThreadMutation, UpdateThreadMutationVariables>;
export const DeleteThreadDocument = gql`
    mutation DeleteThread($thread_id: ID!) {
  threadDelete(thread_id: $thread_id) {
    error
    thread_id
  }
}
    `;
export type DeleteThreadMutationFn = Apollo.MutationFunction<DeleteThreadMutation, DeleteThreadMutationVariables>;

/**
 * __useDeleteThreadMutation__
 *
 * To run a mutation, you first call `useDeleteThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadMutation, { data, loading, error }] = useDeleteThreadMutation({
 *   variables: {
 *      thread_id: // value for 'thread_id'
 *   },
 * });
 */
export function useDeleteThreadMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadMutation, DeleteThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadMutation, DeleteThreadMutationVariables>(DeleteThreadDocument, options);
      }
export type DeleteThreadMutationHookResult = ReturnType<typeof useDeleteThreadMutation>;
export type DeleteThreadMutationResult = Apollo.MutationResult<DeleteThreadMutation>;
export type DeleteThreadMutationOptions = Apollo.BaseMutationOptions<DeleteThreadMutation, DeleteThreadMutationVariables>;
export const GetForumFolderByIdDocument = gql`
    query GetForumFolderById($forum_folder_id: ID!) {
  forumFolderRead(forum_folder_id: $forum_folder_id) {
    error
    folder {
      ...ForumFolderFragment
    }
  }
}
    ${ForumFolderFragmentFragmentDoc}`;

/**
 * __useGetForumFolderByIdQuery__
 *
 * To run a query within a React component, call `useGetForumFolderByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumFolderByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumFolderByIdQuery({
 *   variables: {
 *      forum_folder_id: // value for 'forum_folder_id'
 *   },
 * });
 */
export function useGetForumFolderByIdQuery(baseOptions: Apollo.QueryHookOptions<GetForumFolderByIdQuery, GetForumFolderByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumFolderByIdQuery, GetForumFolderByIdQueryVariables>(GetForumFolderByIdDocument, options);
      }
export function useGetForumFolderByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumFolderByIdQuery, GetForumFolderByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumFolderByIdQuery, GetForumFolderByIdQueryVariables>(GetForumFolderByIdDocument, options);
        }
export type GetForumFolderByIdQueryHookResult = ReturnType<typeof useGetForumFolderByIdQuery>;
export type GetForumFolderByIdLazyQueryHookResult = ReturnType<typeof useGetForumFolderByIdLazyQuery>;
export type GetForumFolderByIdQueryResult = Apollo.QueryResult<GetForumFolderByIdQuery, GetForumFolderByIdQueryVariables>;
export const GetForumFoldersListDocument = gql`
    query GetForumFoldersList($forum_id: ID!, $filter: String, $after: ID, $first: Int) {
  getForumFoldersList(
    forum_id: $forum_id
    filter: $filter
    after: $after
    first: $first
  ) {
    error
    edges {
      ...ForumFolderEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${ForumFolderEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetForumFoldersListQuery__
 *
 * To run a query within a React component, call `useGetForumFoldersListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumFoldersListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumFoldersListQuery({
 *   variables: {
 *      forum_id: // value for 'forum_id'
 *      filter: // value for 'filter'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetForumFoldersListQuery(baseOptions: Apollo.QueryHookOptions<GetForumFoldersListQuery, GetForumFoldersListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumFoldersListQuery, GetForumFoldersListQueryVariables>(GetForumFoldersListDocument, options);
      }
export function useGetForumFoldersListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumFoldersListQuery, GetForumFoldersListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumFoldersListQuery, GetForumFoldersListQueryVariables>(GetForumFoldersListDocument, options);
        }
export type GetForumFoldersListQueryHookResult = ReturnType<typeof useGetForumFoldersListQuery>;
export type GetForumFoldersListLazyQueryHookResult = ReturnType<typeof useGetForumFoldersListLazyQuery>;
export type GetForumFoldersListQueryResult = Apollo.QueryResult<GetForumFoldersListQuery, GetForumFoldersListQueryVariables>;
export const CreateForumFolderDocument = gql`
    mutation CreateForumFolder($name: String!, $description: String, $forum_id: ID!) {
  forumFolderUpsert(
    input: {name: $name, description: $description, forum_id: $forum_id}
  ) {
    error
    folder {
      ...ForumFolderFragment
    }
  }
}
    ${ForumFolderFragmentFragmentDoc}`;
export type CreateForumFolderMutationFn = Apollo.MutationFunction<CreateForumFolderMutation, CreateForumFolderMutationVariables>;

/**
 * __useCreateForumFolderMutation__
 *
 * To run a mutation, you first call `useCreateForumFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateForumFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createForumFolderMutation, { data, loading, error }] = useCreateForumFolderMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      forum_id: // value for 'forum_id'
 *   },
 * });
 */
export function useCreateForumFolderMutation(baseOptions?: Apollo.MutationHookOptions<CreateForumFolderMutation, CreateForumFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateForumFolderMutation, CreateForumFolderMutationVariables>(CreateForumFolderDocument, options);
      }
export type CreateForumFolderMutationHookResult = ReturnType<typeof useCreateForumFolderMutation>;
export type CreateForumFolderMutationResult = Apollo.MutationResult<CreateForumFolderMutation>;
export type CreateForumFolderMutationOptions = Apollo.BaseMutationOptions<CreateForumFolderMutation, CreateForumFolderMutationVariables>;
export const UpdateForumFolderDocument = gql`
    mutation UpdateForumFolder($forum_folder_id: ID, $name: String!, $description: String, $forum_id: ID!) {
  forumFolderUpsert(
    input: {forum_id: $forum_id, name: $name, description: $description, forum_folder_id: $forum_folder_id}
  ) {
    error
    folder {
      ...ForumFolderFragment
    }
  }
}
    ${ForumFolderFragmentFragmentDoc}`;
export type UpdateForumFolderMutationFn = Apollo.MutationFunction<UpdateForumFolderMutation, UpdateForumFolderMutationVariables>;

/**
 * __useUpdateForumFolderMutation__
 *
 * To run a mutation, you first call `useUpdateForumFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateForumFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateForumFolderMutation, { data, loading, error }] = useUpdateForumFolderMutation({
 *   variables: {
 *      forum_folder_id: // value for 'forum_folder_id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      forum_id: // value for 'forum_id'
 *   },
 * });
 */
export function useUpdateForumFolderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateForumFolderMutation, UpdateForumFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateForumFolderMutation, UpdateForumFolderMutationVariables>(UpdateForumFolderDocument, options);
      }
export type UpdateForumFolderMutationHookResult = ReturnType<typeof useUpdateForumFolderMutation>;
export type UpdateForumFolderMutationResult = Apollo.MutationResult<UpdateForumFolderMutation>;
export type UpdateForumFolderMutationOptions = Apollo.BaseMutationOptions<UpdateForumFolderMutation, UpdateForumFolderMutationVariables>;
export const DeleteForumFolderDocument = gql`
    mutation DeleteForumFolder($forum_folder_id: ID!) {
  forumFolderDelete(forum_folder_id: $forum_folder_id) {
    error
    forum_folder_id
  }
}
    `;
export type DeleteForumFolderMutationFn = Apollo.MutationFunction<DeleteForumFolderMutation, DeleteForumFolderMutationVariables>;

/**
 * __useDeleteForumFolderMutation__
 *
 * To run a mutation, you first call `useDeleteForumFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteForumFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteForumFolderMutation, { data, loading, error }] = useDeleteForumFolderMutation({
 *   variables: {
 *      forum_folder_id: // value for 'forum_folder_id'
 *   },
 * });
 */
export function useDeleteForumFolderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteForumFolderMutation, DeleteForumFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteForumFolderMutation, DeleteForumFolderMutationVariables>(DeleteForumFolderDocument, options);
      }
export type DeleteForumFolderMutationHookResult = ReturnType<typeof useDeleteForumFolderMutation>;
export type DeleteForumFolderMutationResult = Apollo.MutationResult<DeleteForumFolderMutation>;
export type DeleteForumFolderMutationOptions = Apollo.BaseMutationOptions<DeleteForumFolderMutation, DeleteForumFolderMutationVariables>;
export const GetForumByIdDocument = gql`
    query GetForumById($forum_id: ID!) {
  forumRead(forum_id: $forum_id) {
    error
    forum {
      ...ForumFragment
    }
  }
}
    ${ForumFragmentFragmentDoc}`;

/**
 * __useGetForumByIdQuery__
 *
 * To run a query within a React component, call `useGetForumByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumByIdQuery({
 *   variables: {
 *      forum_id: // value for 'forum_id'
 *   },
 * });
 */
export function useGetForumByIdQuery(baseOptions: Apollo.QueryHookOptions<GetForumByIdQuery, GetForumByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumByIdQuery, GetForumByIdQueryVariables>(GetForumByIdDocument, options);
      }
export function useGetForumByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumByIdQuery, GetForumByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumByIdQuery, GetForumByIdQueryVariables>(GetForumByIdDocument, options);
        }
export type GetForumByIdQueryHookResult = ReturnType<typeof useGetForumByIdQuery>;
export type GetForumByIdLazyQueryHookResult = ReturnType<typeof useGetForumByIdLazyQuery>;
export type GetForumByIdQueryResult = Apollo.QueryResult<GetForumByIdQuery, GetForumByIdQueryVariables>;
export const GetForumsListDocument = gql`
    query GetForumsList($filter: String, $first: Int, $after: ID) {
  getForumsList(filter: $filter, after: $after, first: $first) {
    error
    edges {
      ...ForumEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${ForumEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetForumsListQuery__
 *
 * To run a query within a React component, call `useGetForumsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumsListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetForumsListQuery(baseOptions?: Apollo.QueryHookOptions<GetForumsListQuery, GetForumsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumsListQuery, GetForumsListQueryVariables>(GetForumsListDocument, options);
      }
export function useGetForumsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumsListQuery, GetForumsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumsListQuery, GetForumsListQueryVariables>(GetForumsListDocument, options);
        }
export type GetForumsListQueryHookResult = ReturnType<typeof useGetForumsListQuery>;
export type GetForumsListLazyQueryHookResult = ReturnType<typeof useGetForumsListLazyQuery>;
export type GetForumsListQueryResult = Apollo.QueryResult<GetForumsListQuery, GetForumsListQueryVariables>;
export const CreateForumDocument = gql`
    mutation CreateForum($name: String!, $description: String) {
  forumUpsert(input: {name: $name, description: $description}) {
    error
    forum {
      ...ForumFragment
    }
  }
}
    ${ForumFragmentFragmentDoc}`;
export type CreateForumMutationFn = Apollo.MutationFunction<CreateForumMutation, CreateForumMutationVariables>;

/**
 * __useCreateForumMutation__
 *
 * To run a mutation, you first call `useCreateForumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateForumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createForumMutation, { data, loading, error }] = useCreateForumMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateForumMutation(baseOptions?: Apollo.MutationHookOptions<CreateForumMutation, CreateForumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateForumMutation, CreateForumMutationVariables>(CreateForumDocument, options);
      }
export type CreateForumMutationHookResult = ReturnType<typeof useCreateForumMutation>;
export type CreateForumMutationResult = Apollo.MutationResult<CreateForumMutation>;
export type CreateForumMutationOptions = Apollo.BaseMutationOptions<CreateForumMutation, CreateForumMutationVariables>;
export const UpdateForumDocument = gql`
    mutation UpdateForum($id: ID, $name: String!, $description: String) {
  forumUpsert(input: {forum_id: $id, name: $name, description: $description}) {
    error
    forum {
      ...ForumFragment
    }
  }
}
    ${ForumFragmentFragmentDoc}`;
export type UpdateForumMutationFn = Apollo.MutationFunction<UpdateForumMutation, UpdateForumMutationVariables>;

/**
 * __useUpdateForumMutation__
 *
 * To run a mutation, you first call `useUpdateForumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateForumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateForumMutation, { data, loading, error }] = useUpdateForumMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateForumMutation(baseOptions?: Apollo.MutationHookOptions<UpdateForumMutation, UpdateForumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateForumMutation, UpdateForumMutationVariables>(UpdateForumDocument, options);
      }
export type UpdateForumMutationHookResult = ReturnType<typeof useUpdateForumMutation>;
export type UpdateForumMutationResult = Apollo.MutationResult<UpdateForumMutation>;
export type UpdateForumMutationOptions = Apollo.BaseMutationOptions<UpdateForumMutation, UpdateForumMutationVariables>;
export const DeleteForumDocument = gql`
    mutation DeleteForum($forum_id: ID!) {
  forumDelete(forum_id: $forum_id) {
    error
    forum_id
  }
}
    `;
export type DeleteForumMutationFn = Apollo.MutationFunction<DeleteForumMutation, DeleteForumMutationVariables>;

/**
 * __useDeleteForumMutation__
 *
 * To run a mutation, you first call `useDeleteForumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteForumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteForumMutation, { data, loading, error }] = useDeleteForumMutation({
 *   variables: {
 *      forum_id: // value for 'forum_id'
 *   },
 * });
 */
export function useDeleteForumMutation(baseOptions?: Apollo.MutationHookOptions<DeleteForumMutation, DeleteForumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteForumMutation, DeleteForumMutationVariables>(DeleteForumDocument, options);
      }
export type DeleteForumMutationHookResult = ReturnType<typeof useDeleteForumMutation>;
export type DeleteForumMutationResult = Apollo.MutationResult<DeleteForumMutation>;
export type DeleteForumMutationOptions = Apollo.BaseMutationOptions<DeleteForumMutation, DeleteForumMutationVariables>;
export const GetOrigMapWordsAndPhrasesDocument = gql`
    query GetOrigMapWordsAndPhrases($original_map_id: String, $lang: LanguageInput!, $filter: String, $quickFilter: String, $onlyNotTranslatedTo: LanguageInput, $onlyTranslatedTo: LanguageInput, $after: ID, $first: Int) {
  getOrigMapWordsAndPhrases(
    input: {lang: $lang, filter: $filter, quickFilter: $quickFilter, original_map_id: $original_map_id, onlyNotTranslatedTo: $onlyNotTranslatedTo, onlyTranslatedTo: $onlyTranslatedTo}
    after: $after
    first: $first
  ) {
    edges {
      ...MapWordsAndPhrasesEdgeFragment
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${MapWordsAndPhrasesEdgeFragmentFragmentDoc}`;

/**
 * __useGetOrigMapWordsAndPhrasesQuery__
 *
 * To run a query within a React component, call `useGetOrigMapWordsAndPhrasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrigMapWordsAndPhrasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrigMapWordsAndPhrasesQuery({
 *   variables: {
 *      original_map_id: // value for 'original_map_id'
 *      lang: // value for 'lang'
 *      filter: // value for 'filter'
 *      quickFilter: // value for 'quickFilter'
 *      onlyNotTranslatedTo: // value for 'onlyNotTranslatedTo'
 *      onlyTranslatedTo: // value for 'onlyTranslatedTo'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetOrigMapWordsAndPhrasesQuery(baseOptions: Apollo.QueryHookOptions<GetOrigMapWordsAndPhrasesQuery, GetOrigMapWordsAndPhrasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrigMapWordsAndPhrasesQuery, GetOrigMapWordsAndPhrasesQueryVariables>(GetOrigMapWordsAndPhrasesDocument, options);
      }
export function useGetOrigMapWordsAndPhrasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrigMapWordsAndPhrasesQuery, GetOrigMapWordsAndPhrasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrigMapWordsAndPhrasesQuery, GetOrigMapWordsAndPhrasesQueryVariables>(GetOrigMapWordsAndPhrasesDocument, options);
        }
export type GetOrigMapWordsAndPhrasesQueryHookResult = ReturnType<typeof useGetOrigMapWordsAndPhrasesQuery>;
export type GetOrigMapWordsAndPhrasesLazyQueryHookResult = ReturnType<typeof useGetOrigMapWordsAndPhrasesLazyQuery>;
export type GetOrigMapWordsAndPhrasesQueryResult = Apollo.QueryResult<GetOrigMapWordsAndPhrasesQuery, GetOrigMapWordsAndPhrasesQueryVariables>;
export const GetOrigMapWordsAndPhrasesCountDocument = gql`
    query GetOrigMapWordsAndPhrasesCount($original_map_id: String, $lang: LanguageInput!, $filter: String) {
  getOrigMapWordsAndPhrasesCount(
    input: {lang: $lang, filter: $filter, original_map_id: $original_map_id}
  ) {
    count
  }
}
    `;

/**
 * __useGetOrigMapWordsAndPhrasesCountQuery__
 *
 * To run a query within a React component, call `useGetOrigMapWordsAndPhrasesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrigMapWordsAndPhrasesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrigMapWordsAndPhrasesCountQuery({
 *   variables: {
 *      original_map_id: // value for 'original_map_id'
 *      lang: // value for 'lang'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetOrigMapWordsAndPhrasesCountQuery(baseOptions: Apollo.QueryHookOptions<GetOrigMapWordsAndPhrasesCountQuery, GetOrigMapWordsAndPhrasesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrigMapWordsAndPhrasesCountQuery, GetOrigMapWordsAndPhrasesCountQueryVariables>(GetOrigMapWordsAndPhrasesCountDocument, options);
      }
export function useGetOrigMapWordsAndPhrasesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrigMapWordsAndPhrasesCountQuery, GetOrigMapWordsAndPhrasesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrigMapWordsAndPhrasesCountQuery, GetOrigMapWordsAndPhrasesCountQueryVariables>(GetOrigMapWordsAndPhrasesCountDocument, options);
        }
export type GetOrigMapWordsAndPhrasesCountQueryHookResult = ReturnType<typeof useGetOrigMapWordsAndPhrasesCountQuery>;
export type GetOrigMapWordsAndPhrasesCountLazyQueryHookResult = ReturnType<typeof useGetOrigMapWordsAndPhrasesCountLazyQuery>;
export type GetOrigMapWordsAndPhrasesCountQueryResult = Apollo.QueryResult<GetOrigMapWordsAndPhrasesCountQuery, GetOrigMapWordsAndPhrasesCountQueryVariables>;
export const GetMapWordOrPhraseAsOrigByDefinitionIdDocument = gql`
    query GetMapWordOrPhraseAsOrigByDefinitionId($definition_id: ID!, $is_word_definition: Boolean!) {
  getMapWordOrPhraseAsOrigByDefinitionId(
    input: {definition_id: $definition_id, is_word_definition: $is_word_definition}
  ) {
    error
    wordOrPhrase {
      ...WordWithDefinitionFragment
      ...PhraseWithDefinitionFragment
    }
  }
}
    ${WordWithDefinitionFragmentFragmentDoc}
${PhraseWithDefinitionFragmentFragmentDoc}`;

/**
 * __useGetMapWordOrPhraseAsOrigByDefinitionIdQuery__
 *
 * To run a query within a React component, call `useGetMapWordOrPhraseAsOrigByDefinitionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMapWordOrPhraseAsOrigByDefinitionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
 *   variables: {
 *      definition_id: // value for 'definition_id'
 *      is_word_definition: // value for 'is_word_definition'
 *   },
 * });
 */
export function useGetMapWordOrPhraseAsOrigByDefinitionIdQuery(baseOptions: Apollo.QueryHookOptions<GetMapWordOrPhraseAsOrigByDefinitionIdQuery, GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMapWordOrPhraseAsOrigByDefinitionIdQuery, GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables>(GetMapWordOrPhraseAsOrigByDefinitionIdDocument, options);
      }
export function useGetMapWordOrPhraseAsOrigByDefinitionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMapWordOrPhraseAsOrigByDefinitionIdQuery, GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMapWordOrPhraseAsOrigByDefinitionIdQuery, GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables>(GetMapWordOrPhraseAsOrigByDefinitionIdDocument, options);
        }
export type GetMapWordOrPhraseAsOrigByDefinitionIdQueryHookResult = ReturnType<typeof useGetMapWordOrPhraseAsOrigByDefinitionIdQuery>;
export type GetMapWordOrPhraseAsOrigByDefinitionIdLazyQueryHookResult = ReturnType<typeof useGetMapWordOrPhraseAsOrigByDefinitionIdLazyQuery>;
export type GetMapWordOrPhraseAsOrigByDefinitionIdQueryResult = Apollo.QueryResult<GetMapWordOrPhraseAsOrigByDefinitionIdQuery, GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables>;
export const GetAllMapsListDocument = gql`
    query GetAllMapsList($lang: LanguageInput, $after: ID, $first: Int) {
  getAllMapsList(input: {lang: $lang}, after: $after, first: $first) {
    edges {
      ...MapDetailsOutputEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${MapDetailsOutputEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

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
 *      after: // value for 'after'
 *      first: // value for 'first'
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
export const GetMapDetailsDocument = gql`
    query GetMapDetails($map_id: ID!, $is_original: Boolean!) {
  getMapDetails(input: {map_id: $map_id, is_original: $is_original}) {
    ...MapDetailsOutputFragment
  }
}
    ${MapDetailsOutputFragmentFragmentDoc}`;

/**
 * __useGetMapDetailsQuery__
 *
 * To run a query within a React component, call `useGetMapDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMapDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapDetailsQuery({
 *   variables: {
 *      map_id: // value for 'map_id'
 *      is_original: // value for 'is_original'
 *   },
 * });
 */
export function useGetMapDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetMapDetailsQuery, GetMapDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMapDetailsQuery, GetMapDetailsQueryVariables>(GetMapDetailsDocument, options);
      }
export function useGetMapDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMapDetailsQuery, GetMapDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMapDetailsQuery, GetMapDetailsQueryVariables>(GetMapDetailsDocument, options);
        }
export type GetMapDetailsQueryHookResult = ReturnType<typeof useGetMapDetailsQuery>;
export type GetMapDetailsLazyQueryHookResult = ReturnType<typeof useGetMapDetailsLazyQuery>;
export type GetMapDetailsQueryResult = Apollo.QueryResult<GetMapDetailsQuery, GetMapDetailsQueryVariables>;
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
export const StartZipMapDownloadDocument = gql`
    mutation StartZipMapDownload($language: LanguageInput!) {
  startZipMapDownload(input: {language: $language}) {
    error
  }
}
    `;
export type StartZipMapDownloadMutationFn = Apollo.MutationFunction<StartZipMapDownloadMutation, StartZipMapDownloadMutationVariables>;

/**
 * __useStartZipMapDownloadMutation__
 *
 * To run a mutation, you first call `useStartZipMapDownloadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartZipMapDownloadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startZipMapDownloadMutation, { data, loading, error }] = useStartZipMapDownloadMutation({
 *   variables: {
 *      language: // value for 'language'
 *   },
 * });
 */
export function useStartZipMapDownloadMutation(baseOptions?: Apollo.MutationHookOptions<StartZipMapDownloadMutation, StartZipMapDownloadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartZipMapDownloadMutation, StartZipMapDownloadMutationVariables>(StartZipMapDownloadDocument, options);
      }
export type StartZipMapDownloadMutationHookResult = ReturnType<typeof useStartZipMapDownloadMutation>;
export type StartZipMapDownloadMutationResult = Apollo.MutationResult<StartZipMapDownloadMutation>;
export type StartZipMapDownloadMutationOptions = Apollo.BaseMutationOptions<StartZipMapDownloadMutation, StartZipMapDownloadMutationVariables>;
export const SubscribeToZipMapDocument = gql`
    subscription SubscribeToZipMap {
  ZipMapReport {
    resultZipUrl
    status
    message
    errors
  }
}
    `;

/**
 * __useSubscribeToZipMapSubscription__
 *
 * To run a query within a React component, call `useSubscribeToZipMapSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToZipMapSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToZipMapSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToZipMapSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToZipMapSubscription, SubscribeToZipMapSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToZipMapSubscription, SubscribeToZipMapSubscriptionVariables>(SubscribeToZipMapDocument, options);
      }
export type SubscribeToZipMapSubscriptionHookResult = ReturnType<typeof useSubscribeToZipMapSubscription>;
export type SubscribeToZipMapSubscriptionResult = Apollo.SubscriptionResult<SubscribeToZipMapSubscription>;
export const MapUploadDocument = gql`
    mutation MapUpload($file: Upload!, $previewFileId: String, $file_type: String!, $file_size: Int!) {
  mapUpload(
    file: $file
    previewFileId: $previewFileId
    file_type: $file_type
    file_size: $file_size
  ) {
    error
    mapDetailsOutput {
      ...MapDetailsOutputFragment
    }
  }
}
    ${MapDetailsOutputFragmentFragmentDoc}`;
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
 *      previewFileId: // value for 'previewFileId'
 *      file_type: // value for 'file_type'
 *      file_size: // value for 'file_size'
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
export const MapDeleteDocument = gql`
    mutation MapDelete($mapId: String!, $is_original: Boolean!) {
  mapDelete(input: {mapId: $mapId, is_original: $is_original}) {
    error
    deletedMapId
  }
}
    `;
export type MapDeleteMutationFn = Apollo.MutationFunction<MapDeleteMutation, MapDeleteMutationVariables>;

/**
 * __useMapDeleteMutation__
 *
 * To run a mutation, you first call `useMapDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMapDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mapDeleteMutation, { data, loading, error }] = useMapDeleteMutation({
 *   variables: {
 *      mapId: // value for 'mapId'
 *      is_original: // value for 'is_original'
 *   },
 * });
 */
export function useMapDeleteMutation(baseOptions?: Apollo.MutationHookOptions<MapDeleteMutation, MapDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MapDeleteMutation, MapDeleteMutationVariables>(MapDeleteDocument, options);
      }
export type MapDeleteMutationHookResult = ReturnType<typeof useMapDeleteMutation>;
export type MapDeleteMutationResult = Apollo.MutationResult<MapDeleteMutation>;
export type MapDeleteMutationOptions = Apollo.BaseMutationOptions<MapDeleteMutation, MapDeleteMutationVariables>;
export const MapsTranslationsResetDocument = gql`
    mutation MapsTranslationsReset {
  mapsTranslationsReset {
    error
  }
}
    `;
export type MapsTranslationsResetMutationFn = Apollo.MutationFunction<MapsTranslationsResetMutation, MapsTranslationsResetMutationVariables>;

/**
 * __useMapsTranslationsResetMutation__
 *
 * To run a mutation, you first call `useMapsTranslationsResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMapsTranslationsResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mapsTranslationsResetMutation, { data, loading, error }] = useMapsTranslationsResetMutation({
 *   variables: {
 *   },
 * });
 */
export function useMapsTranslationsResetMutation(baseOptions?: Apollo.MutationHookOptions<MapsTranslationsResetMutation, MapsTranslationsResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MapsTranslationsResetMutation, MapsTranslationsResetMutationVariables>(MapsTranslationsResetDocument, options);
      }
export type MapsTranslationsResetMutationHookResult = ReturnType<typeof useMapsTranslationsResetMutation>;
export type MapsTranslationsResetMutationResult = Apollo.MutationResult<MapsTranslationsResetMutation>;
export type MapsTranslationsResetMutationOptions = Apollo.BaseMutationOptions<MapsTranslationsResetMutation, MapsTranslationsResetMutationVariables>;
export const MapsReTranslateDocument = gql`
    mutation MapsReTranslate($forLangTag: String) {
  mapsReTranslate(forLangTag: $forLangTag) {
    error
  }
}
    `;
export type MapsReTranslateMutationFn = Apollo.MutationFunction<MapsReTranslateMutation, MapsReTranslateMutationVariables>;

/**
 * __useMapsReTranslateMutation__
 *
 * To run a mutation, you first call `useMapsReTranslateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMapsReTranslateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mapsReTranslateMutation, { data, loading, error }] = useMapsReTranslateMutation({
 *   variables: {
 *      forLangTag: // value for 'forLangTag'
 *   },
 * });
 */
export function useMapsReTranslateMutation(baseOptions?: Apollo.MutationHookOptions<MapsReTranslateMutation, MapsReTranslateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MapsReTranslateMutation, MapsReTranslateMutationVariables>(MapsReTranslateDocument, options);
      }
export type MapsReTranslateMutationHookResult = ReturnType<typeof useMapsReTranslateMutation>;
export type MapsReTranslateMutationResult = Apollo.MutationResult<MapsReTranslateMutation>;
export type MapsReTranslateMutationOptions = Apollo.BaseMutationOptions<MapsReTranslateMutation, MapsReTranslateMutationVariables>;
export const ToggleMapVoteStatusDocument = gql`
    mutation ToggleMapVoteStatus($map_id: ID!, $is_original: Boolean!, $vote: Boolean!) {
  toggleMapVoteStatus(map_id: $map_id, is_original: $is_original, vote: $vote) {
    error
    vote_status {
      ...MapVoteStatusFragment
    }
  }
}
    ${MapVoteStatusFragmentFragmentDoc}`;
export type ToggleMapVoteStatusMutationFn = Apollo.MutationFunction<ToggleMapVoteStatusMutation, ToggleMapVoteStatusMutationVariables>;

/**
 * __useToggleMapVoteStatusMutation__
 *
 * To run a mutation, you first call `useToggleMapVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleMapVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleMapVoteStatusMutation, { data, loading, error }] = useToggleMapVoteStatusMutation({
 *   variables: {
 *      map_id: // value for 'map_id'
 *      is_original: // value for 'is_original'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useToggleMapVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleMapVoteStatusMutation, ToggleMapVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleMapVoteStatusMutation, ToggleMapVoteStatusMutationVariables>(ToggleMapVoteStatusDocument, options);
      }
export type ToggleMapVoteStatusMutationHookResult = ReturnType<typeof useToggleMapVoteStatusMutation>;
export type ToggleMapVoteStatusMutationResult = Apollo.MutationResult<ToggleMapVoteStatusMutation>;
export type ToggleMapVoteStatusMutationOptions = Apollo.BaseMutationOptions<ToggleMapVoteStatusMutation, ToggleMapVoteStatusMutationVariables>;
export const ForceMarkAndRetranslateOriginalMapsIdsDocument = gql`
    mutation ForceMarkAndRetranslateOriginalMapsIds($originalMapsIds: [String!]!) {
  forceMarkAndRetranslateOriginalMapsIds(originalMapsIds: $originalMapsIds) {
    error
  }
}
    `;
export type ForceMarkAndRetranslateOriginalMapsIdsMutationFn = Apollo.MutationFunction<ForceMarkAndRetranslateOriginalMapsIdsMutation, ForceMarkAndRetranslateOriginalMapsIdsMutationVariables>;

/**
 * __useForceMarkAndRetranslateOriginalMapsIdsMutation__
 *
 * To run a mutation, you first call `useForceMarkAndRetranslateOriginalMapsIdsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForceMarkAndRetranslateOriginalMapsIdsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forceMarkAndRetranslateOriginalMapsIdsMutation, { data, loading, error }] = useForceMarkAndRetranslateOriginalMapsIdsMutation({
 *   variables: {
 *      originalMapsIds: // value for 'originalMapsIds'
 *   },
 * });
 */
export function useForceMarkAndRetranslateOriginalMapsIdsMutation(baseOptions?: Apollo.MutationHookOptions<ForceMarkAndRetranslateOriginalMapsIdsMutation, ForceMarkAndRetranslateOriginalMapsIdsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForceMarkAndRetranslateOriginalMapsIdsMutation, ForceMarkAndRetranslateOriginalMapsIdsMutationVariables>(ForceMarkAndRetranslateOriginalMapsIdsDocument, options);
      }
export type ForceMarkAndRetranslateOriginalMapsIdsMutationHookResult = ReturnType<typeof useForceMarkAndRetranslateOriginalMapsIdsMutation>;
export type ForceMarkAndRetranslateOriginalMapsIdsMutationResult = Apollo.MutationResult<ForceMarkAndRetranslateOriginalMapsIdsMutation>;
export type ForceMarkAndRetranslateOriginalMapsIdsMutationOptions = Apollo.BaseMutationOptions<ForceMarkAndRetranslateOriginalMapsIdsMutation, ForceMarkAndRetranslateOriginalMapsIdsMutationVariables>;
export const GetMapVoteStatusDocument = gql`
    query GetMapVoteStatus($map_id: ID!, $is_original: Boolean!) {
  getMapVoteStatus(map_id: $map_id, is_original: $is_original) {
    error
    vote_status {
      ...MapVoteStatusFragment
    }
  }
}
    ${MapVoteStatusFragmentFragmentDoc}`;

/**
 * __useGetMapVoteStatusQuery__
 *
 * To run a query within a React component, call `useGetMapVoteStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMapVoteStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapVoteStatusQuery({
 *   variables: {
 *      map_id: // value for 'map_id'
 *      is_original: // value for 'is_original'
 *   },
 * });
 */
export function useGetMapVoteStatusQuery(baseOptions: Apollo.QueryHookOptions<GetMapVoteStatusQuery, GetMapVoteStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMapVoteStatusQuery, GetMapVoteStatusQueryVariables>(GetMapVoteStatusDocument, options);
      }
export function useGetMapVoteStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMapVoteStatusQuery, GetMapVoteStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMapVoteStatusQuery, GetMapVoteStatusQueryVariables>(GetMapVoteStatusDocument, options);
        }
export type GetMapVoteStatusQueryHookResult = ReturnType<typeof useGetMapVoteStatusQuery>;
export type GetMapVoteStatusLazyQueryHookResult = ReturnType<typeof useGetMapVoteStatusLazyQuery>;
export type GetMapVoteStatusQueryResult = Apollo.QueryResult<GetMapVoteStatusQuery, GetMapVoteStatusQueryVariables>;
export const AddNotificationDocument = gql`
    mutation AddNotification($text: String!, $user_id: ID!) {
  addNotification(input: {text: $text, user_id: $user_id}) {
    error
    notification {
      id
      text
      isNotified
    }
  }
}
    `;
export type AddNotificationMutationFn = Apollo.MutationFunction<AddNotificationMutation, AddNotificationMutationVariables>;

/**
 * __useAddNotificationMutation__
 *
 * To run a mutation, you first call `useAddNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNotificationMutation, { data, loading, error }] = useAddNotificationMutation({
 *   variables: {
 *      text: // value for 'text'
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useAddNotificationMutation(baseOptions?: Apollo.MutationHookOptions<AddNotificationMutation, AddNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNotificationMutation, AddNotificationMutationVariables>(AddNotificationDocument, options);
      }
export type AddNotificationMutationHookResult = ReturnType<typeof useAddNotificationMutation>;
export type AddNotificationMutationResult = Apollo.MutationResult<AddNotificationMutation>;
export type AddNotificationMutationOptions = Apollo.BaseMutationOptions<AddNotificationMutation, AddNotificationMutationVariables>;
export const ListNotificationsDocument = gql`
    query ListNotifications {
  notifications {
    error
    notifications {
      text
      id
      isNotified
    }
  }
}
    `;

/**
 * __useListNotificationsQuery__
 *
 * To run a query within a React component, call `useListNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<ListNotificationsQuery, ListNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListNotificationsQuery, ListNotificationsQueryVariables>(ListNotificationsDocument, options);
      }
export function useListNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListNotificationsQuery, ListNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListNotificationsQuery, ListNotificationsQueryVariables>(ListNotificationsDocument, options);
        }
export type ListNotificationsQueryHookResult = ReturnType<typeof useListNotificationsQuery>;
export type ListNotificationsLazyQueryHookResult = ReturnType<typeof useListNotificationsLazyQuery>;
export type ListNotificationsQueryResult = Apollo.QueryResult<ListNotificationsQuery, ListNotificationsQueryVariables>;
export const DeleteNotificationDocument = gql`
    mutation DeleteNotification($id: ID!) {
  notificationDelete(input: {notification_id: $id}) {
    error
    notification_id
  }
}
    `;
export type DeleteNotificationMutationFn = Apollo.MutationFunction<DeleteNotificationMutation, DeleteNotificationMutationVariables>;

/**
 * __useDeleteNotificationMutation__
 *
 * To run a mutation, you first call `useDeleteNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationMutation, { data, loading, error }] = useDeleteNotificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNotificationMutation, DeleteNotificationMutationVariables>(DeleteNotificationDocument, options);
      }
export type DeleteNotificationMutationHookResult = ReturnType<typeof useDeleteNotificationMutation>;
export type DeleteNotificationMutationResult = Apollo.MutationResult<DeleteNotificationMutation>;
export type DeleteNotificationMutationOptions = Apollo.BaseMutationOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const MarkNotificationReadDocument = gql`
    mutation MarkNotificationRead($id: ID!) {
  markNotificationAsRead(input: {notification_id: $id}) {
    error
    notification_id
  }
}
    `;
export type MarkNotificationReadMutationFn = Apollo.MutationFunction<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;

/**
 * __useMarkNotificationReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationReadMutation, { data, loading, error }] = useMarkNotificationReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkNotificationReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument, options);
      }
export type MarkNotificationReadMutationHookResult = ReturnType<typeof useMarkNotificationReadMutation>;
export type MarkNotificationReadMutationResult = Apollo.MutationResult<MarkNotificationReadMutation>;
export type MarkNotificationReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const GetPericopiesByDocumentIdDocument = gql`
    query GetPericopiesByDocumentId($document_id: ID!, $first: Int, $after: ID) {
  getPericopiesByDocumentId(
    document_id: $document_id
    first: $first
    after: $after
  ) {
    error
    edges {
      ...PericopeWithVotesEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${PericopeWithVotesEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetPericopiesByDocumentIdQuery__
 *
 * To run a query within a React component, call `useGetPericopiesByDocumentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPericopiesByDocumentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPericopiesByDocumentIdQuery({
 *   variables: {
 *      document_id: // value for 'document_id'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetPericopiesByDocumentIdQuery(baseOptions: Apollo.QueryHookOptions<GetPericopiesByDocumentIdQuery, GetPericopiesByDocumentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPericopiesByDocumentIdQuery, GetPericopiesByDocumentIdQueryVariables>(GetPericopiesByDocumentIdDocument, options);
      }
export function useGetPericopiesByDocumentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPericopiesByDocumentIdQuery, GetPericopiesByDocumentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPericopiesByDocumentIdQuery, GetPericopiesByDocumentIdQueryVariables>(GetPericopiesByDocumentIdDocument, options);
        }
export type GetPericopiesByDocumentIdQueryHookResult = ReturnType<typeof useGetPericopiesByDocumentIdQuery>;
export type GetPericopiesByDocumentIdLazyQueryHookResult = ReturnType<typeof useGetPericopiesByDocumentIdLazyQuery>;
export type GetPericopiesByDocumentIdQueryResult = Apollo.QueryResult<GetPericopiesByDocumentIdQuery, GetPericopiesByDocumentIdQueryVariables>;
export const GetPericopeVoteStatusDocument = gql`
    query GetPericopeVoteStatus($pericope_id: ID!) {
  getPericopeVoteStatus(pericope_id: $pericope_id) {
    error
    vote_status {
      ...PericopeVoteStatusFragment
    }
  }
}
    ${PericopeVoteStatusFragmentFragmentDoc}`;

/**
 * __useGetPericopeVoteStatusQuery__
 *
 * To run a query within a React component, call `useGetPericopeVoteStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPericopeVoteStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPericopeVoteStatusQuery({
 *   variables: {
 *      pericope_id: // value for 'pericope_id'
 *   },
 * });
 */
export function useGetPericopeVoteStatusQuery(baseOptions: Apollo.QueryHookOptions<GetPericopeVoteStatusQuery, GetPericopeVoteStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPericopeVoteStatusQuery, GetPericopeVoteStatusQueryVariables>(GetPericopeVoteStatusDocument, options);
      }
export function useGetPericopeVoteStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPericopeVoteStatusQuery, GetPericopeVoteStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPericopeVoteStatusQuery, GetPericopeVoteStatusQueryVariables>(GetPericopeVoteStatusDocument, options);
        }
export type GetPericopeVoteStatusQueryHookResult = ReturnType<typeof useGetPericopeVoteStatusQuery>;
export type GetPericopeVoteStatusLazyQueryHookResult = ReturnType<typeof useGetPericopeVoteStatusLazyQuery>;
export type GetPericopeVoteStatusQueryResult = Apollo.QueryResult<GetPericopeVoteStatusQuery, GetPericopeVoteStatusQueryVariables>;
export const TogglePericopeVoteStatusDocument = gql`
    mutation TogglePericopeVoteStatus($pericope_id: ID!, $vote: Boolean!) {
  togglePericopeVoteStatus(pericope_id: $pericope_id, vote: $vote) {
    error
    vote_status {
      ...PericopeVoteStatusFragment
    }
  }
}
    ${PericopeVoteStatusFragmentFragmentDoc}`;
export type TogglePericopeVoteStatusMutationFn = Apollo.MutationFunction<TogglePericopeVoteStatusMutation, TogglePericopeVoteStatusMutationVariables>;

/**
 * __useTogglePericopeVoteStatusMutation__
 *
 * To run a mutation, you first call `useTogglePericopeVoteStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePericopeVoteStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePericopeVoteStatusMutation, { data, loading, error }] = useTogglePericopeVoteStatusMutation({
 *   variables: {
 *      pericope_id: // value for 'pericope_id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useTogglePericopeVoteStatusMutation(baseOptions?: Apollo.MutationHookOptions<TogglePericopeVoteStatusMutation, TogglePericopeVoteStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePericopeVoteStatusMutation, TogglePericopeVoteStatusMutationVariables>(TogglePericopeVoteStatusDocument, options);
      }
export type TogglePericopeVoteStatusMutationHookResult = ReturnType<typeof useTogglePericopeVoteStatusMutation>;
export type TogglePericopeVoteStatusMutationResult = Apollo.MutationResult<TogglePericopeVoteStatusMutation>;
export type TogglePericopeVoteStatusMutationOptions = Apollo.BaseMutationOptions<TogglePericopeVoteStatusMutation, TogglePericopeVoteStatusMutationVariables>;
export const UpsertPericopeDocument = gql`
    mutation UpsertPericope($startWord: String!) {
  upsertPericopies(startWords: [$startWord]) {
    error
    pericopies {
      ...PericopeFragment
    }
  }
}
    ${PericopeFragmentFragmentDoc}`;
export type UpsertPericopeMutationFn = Apollo.MutationFunction<UpsertPericopeMutation, UpsertPericopeMutationVariables>;

/**
 * __useUpsertPericopeMutation__
 *
 * To run a mutation, you first call `useUpsertPericopeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPericopeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPericopeMutation, { data, loading, error }] = useUpsertPericopeMutation({
 *   variables: {
 *      startWord: // value for 'startWord'
 *   },
 * });
 */
export function useUpsertPericopeMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPericopeMutation, UpsertPericopeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPericopeMutation, UpsertPericopeMutationVariables>(UpsertPericopeDocument, options);
      }
export type UpsertPericopeMutationHookResult = ReturnType<typeof useUpsertPericopeMutation>;
export type UpsertPericopeMutationResult = Apollo.MutationResult<UpsertPericopeMutation>;
export type UpsertPericopeMutationOptions = Apollo.BaseMutationOptions<UpsertPericopeMutation, UpsertPericopeMutationVariables>;
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
    query GetPhrasesByLanguage($first: Int!, $after: ID, $language_code: String!, $dialect_code: String, $geo_code: String, $filter: String) {
  getPhrasesByLanguage(
    first: $first
    after: $after
    input: {language_code: $language_code, dialect_code: $dialect_code, geo_code: $geo_code, filter: $filter}
  ) {
    error
    edges {
      ...PhraseWithVoteListEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${PhraseWithVoteListEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

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
 *      first: // value for 'first'
 *      after: // value for 'after'
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
export const GetQuestionOnWordRangesByDocumentIdDocument = gql`
    query GetQuestionOnWordRangesByDocumentId($document_id: ID!, $after: ID, $first: Int) {
  getQuestionOnWordRangesByDocumentId(
    document_id: $document_id
    after: $after
    first: $first
  ) {
    error
    edges {
      ...QuestionOnWordRangesEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${QuestionOnWordRangesEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

/**
 * __useGetQuestionOnWordRangesByDocumentIdQuery__
 *
 * To run a query within a React component, call `useGetQuestionOnWordRangesByDocumentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuestionOnWordRangesByDocumentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuestionOnWordRangesByDocumentIdQuery({
 *   variables: {
 *      document_id: // value for 'document_id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetQuestionOnWordRangesByDocumentIdQuery(baseOptions: Apollo.QueryHookOptions<GetQuestionOnWordRangesByDocumentIdQuery, GetQuestionOnWordRangesByDocumentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuestionOnWordRangesByDocumentIdQuery, GetQuestionOnWordRangesByDocumentIdQueryVariables>(GetQuestionOnWordRangesByDocumentIdDocument, options);
      }
export function useGetQuestionOnWordRangesByDocumentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuestionOnWordRangesByDocumentIdQuery, GetQuestionOnWordRangesByDocumentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuestionOnWordRangesByDocumentIdQuery, GetQuestionOnWordRangesByDocumentIdQueryVariables>(GetQuestionOnWordRangesByDocumentIdDocument, options);
        }
export type GetQuestionOnWordRangesByDocumentIdQueryHookResult = ReturnType<typeof useGetQuestionOnWordRangesByDocumentIdQuery>;
export type GetQuestionOnWordRangesByDocumentIdLazyQueryHookResult = ReturnType<typeof useGetQuestionOnWordRangesByDocumentIdLazyQuery>;
export type GetQuestionOnWordRangesByDocumentIdQueryResult = Apollo.QueryResult<GetQuestionOnWordRangesByDocumentIdQuery, GetQuestionOnWordRangesByDocumentIdQueryVariables>;
export const GetAnswersByQuestionIdDocument = gql`
    query GetAnswersByQuestionId($id: ID!) {
  getAnswersByQuestionIds(ids: [$id]) {
    error
    answers {
      ...AnswerFragment
    }
  }
}
    ${AnswerFragmentFragmentDoc}`;

/**
 * __useGetAnswersByQuestionIdQuery__
 *
 * To run a query within a React component, call `useGetAnswersByQuestionIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnswersByQuestionIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnswersByQuestionIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAnswersByQuestionIdQuery(baseOptions: Apollo.QueryHookOptions<GetAnswersByQuestionIdQuery, GetAnswersByQuestionIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnswersByQuestionIdQuery, GetAnswersByQuestionIdQueryVariables>(GetAnswersByQuestionIdDocument, options);
      }
export function useGetAnswersByQuestionIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnswersByQuestionIdQuery, GetAnswersByQuestionIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnswersByQuestionIdQuery, GetAnswersByQuestionIdQueryVariables>(GetAnswersByQuestionIdDocument, options);
        }
export type GetAnswersByQuestionIdQueryHookResult = ReturnType<typeof useGetAnswersByQuestionIdQuery>;
export type GetAnswersByQuestionIdLazyQueryHookResult = ReturnType<typeof useGetAnswersByQuestionIdLazyQuery>;
export type GetAnswersByQuestionIdQueryResult = Apollo.QueryResult<GetAnswersByQuestionIdQuery, GetAnswersByQuestionIdQueryVariables>;
export const GetQuestionStatisticDocument = gql`
    query getQuestionStatistic($question_id: ID!) {
  getQuestionStatistic(question_id: $question_id) {
    error
    question_with_statistic {
      ...QuestionWithStatisticFragment
    }
  }
}
    ${QuestionWithStatisticFragmentFragmentDoc}`;

/**
 * __useGetQuestionStatisticQuery__
 *
 * To run a query within a React component, call `useGetQuestionStatisticQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuestionStatisticQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuestionStatisticQuery({
 *   variables: {
 *      question_id: // value for 'question_id'
 *   },
 * });
 */
export function useGetQuestionStatisticQuery(baseOptions: Apollo.QueryHookOptions<GetQuestionStatisticQuery, GetQuestionStatisticQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuestionStatisticQuery, GetQuestionStatisticQueryVariables>(GetQuestionStatisticDocument, options);
      }
export function useGetQuestionStatisticLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuestionStatisticQuery, GetQuestionStatisticQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuestionStatisticQuery, GetQuestionStatisticQueryVariables>(GetQuestionStatisticDocument, options);
        }
export type GetQuestionStatisticQueryHookResult = ReturnType<typeof useGetQuestionStatisticQuery>;
export type GetQuestionStatisticLazyQueryHookResult = ReturnType<typeof useGetQuestionStatisticLazyQuery>;
export type GetQuestionStatisticQueryResult = Apollo.QueryResult<GetQuestionStatisticQuery, GetQuestionStatisticQueryVariables>;
export const CreateQuestionOnWordRangeDocument = gql`
    mutation CreateQuestionOnWordRange($begin_document_word_entry_id: ID!, $end_document_word_entry_id: ID!, $question: String!, $question_items: [String!]!, $question_type_is_multiselect: Boolean!) {
  createQuestionOnWordRange(
    input: {begin_document_word_entry_id: $begin_document_word_entry_id, end_document_word_entry_id: $end_document_word_entry_id, question: $question, question_items: $question_items, question_type_is_multiselect: $question_type_is_multiselect}
  ) {
    error
    questions {
      ...QuestionOnWordRangeFragment
    }
  }
}
    ${QuestionOnWordRangeFragmentFragmentDoc}`;
export type CreateQuestionOnWordRangeMutationFn = Apollo.MutationFunction<CreateQuestionOnWordRangeMutation, CreateQuestionOnWordRangeMutationVariables>;

/**
 * __useCreateQuestionOnWordRangeMutation__
 *
 * To run a mutation, you first call `useCreateQuestionOnWordRangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuestionOnWordRangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuestionOnWordRangeMutation, { data, loading, error }] = useCreateQuestionOnWordRangeMutation({
 *   variables: {
 *      begin_document_word_entry_id: // value for 'begin_document_word_entry_id'
 *      end_document_word_entry_id: // value for 'end_document_word_entry_id'
 *      question: // value for 'question'
 *      question_items: // value for 'question_items'
 *      question_type_is_multiselect: // value for 'question_type_is_multiselect'
 *   },
 * });
 */
export function useCreateQuestionOnWordRangeMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuestionOnWordRangeMutation, CreateQuestionOnWordRangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuestionOnWordRangeMutation, CreateQuestionOnWordRangeMutationVariables>(CreateQuestionOnWordRangeDocument, options);
      }
export type CreateQuestionOnWordRangeMutationHookResult = ReturnType<typeof useCreateQuestionOnWordRangeMutation>;
export type CreateQuestionOnWordRangeMutationResult = Apollo.MutationResult<CreateQuestionOnWordRangeMutation>;
export type CreateQuestionOnWordRangeMutationOptions = Apollo.BaseMutationOptions<CreateQuestionOnWordRangeMutation, CreateQuestionOnWordRangeMutationVariables>;
export const UpsertAnswerDocument = gql`
    mutation UpsertAnswer($answer: String!, $question_id: ID!, $question_item_ids: [String!]!) {
  upsertAnswers(
    input: [{answer: $answer, question_id: $question_id, question_item_ids: $question_item_ids}]
  ) {
    error
    answers {
      ...AnswerFragment
    }
  }
}
    ${AnswerFragmentFragmentDoc}`;
export type UpsertAnswerMutationFn = Apollo.MutationFunction<UpsertAnswerMutation, UpsertAnswerMutationVariables>;

/**
 * __useUpsertAnswerMutation__
 *
 * To run a mutation, you first call `useUpsertAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertAnswerMutation, { data, loading, error }] = useUpsertAnswerMutation({
 *   variables: {
 *      answer: // value for 'answer'
 *      question_id: // value for 'question_id'
 *      question_item_ids: // value for 'question_item_ids'
 *   },
 * });
 */
export function useUpsertAnswerMutation(baseOptions?: Apollo.MutationHookOptions<UpsertAnswerMutation, UpsertAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertAnswerMutation, UpsertAnswerMutationVariables>(UpsertAnswerDocument, options);
      }
export type UpsertAnswerMutationHookResult = ReturnType<typeof useUpsertAnswerMutation>;
export type UpsertAnswerMutationResult = Apollo.MutationResult<UpsertAnswerMutation>;
export type UpsertAnswerMutationOptions = Apollo.BaseMutationOptions<UpsertAnswerMutation, UpsertAnswerMutationVariables>;
export const GetAllSiteTextDefinitionsDocument = gql`
    query GetAllSiteTextDefinitions($filter: String, $onlyNotTranslated: Boolean, $onlyTranslated: Boolean, $quickFilter: String, $targetLanguage: LanguageInput, $first: Int, $after: ID) {
  getAllSiteTextDefinitions(
    filters: {filter: $filter, targetLanguage: $targetLanguage, onlyNotTranslated: $onlyNotTranslated, onlyTranslated: $onlyTranslated, quickFilter: $quickFilter}
    first: $first
    after: $after
  ) {
    error
    edges {
      ...SiteTextDefinitionEdgeFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${SiteTextDefinitionEdgeFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;

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
 *      onlyNotTranslated: // value for 'onlyNotTranslated'
 *      onlyTranslated: // value for 'onlyTranslated'
 *      quickFilter: // value for 'quickFilter'
 *      targetLanguage: // value for 'targetLanguage'
 *      first: // value for 'first'
 *      after: // value for 'after'
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
    translation_with_vote_list_by_language {
      ...TranslationWithVoteListByLanguageFragment
    }
  }
}
    ${TranslationWithVoteListByLanguageFragmentFragmentDoc}`;

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
    translation_with_vote_list_by_language_list {
      ...TranslationWithVoteListByLanguageFragment
    }
  }
}
    ${TranslationWithVoteListByLanguageFragmentFragmentDoc}`;

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
export const GetAllSiteTextLanguageListWithRateDocument = gql`
    query GetAllSiteTextLanguageListWithRate {
  getAllSiteTextLanguageListWithRate {
    error
    site_text_language_with_translation_info_list {
      ...SiteTextLanguageWithTranslationInfoFragment
    }
  }
}
    ${SiteTextLanguageWithTranslationInfoFragmentFragmentDoc}`;

/**
 * __useGetAllSiteTextLanguageListWithRateQuery__
 *
 * To run a query within a React component, call `useGetAllSiteTextLanguageListWithRateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSiteTextLanguageListWithRateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSiteTextLanguageListWithRateQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllSiteTextLanguageListWithRateQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSiteTextLanguageListWithRateQuery, GetAllSiteTextLanguageListWithRateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSiteTextLanguageListWithRateQuery, GetAllSiteTextLanguageListWithRateQueryVariables>(GetAllSiteTextLanguageListWithRateDocument, options);
      }
export function useGetAllSiteTextLanguageListWithRateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSiteTextLanguageListWithRateQuery, GetAllSiteTextLanguageListWithRateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSiteTextLanguageListWithRateQuery, GetAllSiteTextLanguageListWithRateQueryVariables>(GetAllSiteTextLanguageListWithRateDocument, options);
        }
export type GetAllSiteTextLanguageListWithRateQueryHookResult = ReturnType<typeof useGetAllSiteTextLanguageListWithRateQuery>;
export type GetAllSiteTextLanguageListWithRateLazyQueryHookResult = ReturnType<typeof useGetAllSiteTextLanguageListWithRateLazyQuery>;
export type GetAllSiteTextLanguageListWithRateQueryResult = Apollo.QueryResult<GetAllSiteTextLanguageListWithRateQuery, GetAllSiteTextLanguageListWithRateQueryVariables>;
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
export const GetTranslationLanguageInfoDocument = gql`
    query GetTranslationLanguageInfo($from_language_code: ID!, $to_language_code: ID) {
  getLanguageTranslationInfo(
    input: {fromLanguageCode: $from_language_code, toLanguageCode: $to_language_code}
  ) {
    error
    googleTranslateTotalLangCount
    liltTranslateTotalLangCount
    smartcatTranslateTotalLangCount
    deeplTranslateTotalLangCount
    totalPhraseCount
    totalWordCount
    translatedMissingPhraseCount
    translatedMissingWordCount
  }
}
    `;

/**
 * __useGetTranslationLanguageInfoQuery__
 *
 * To run a query within a React component, call `useGetTranslationLanguageInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranslationLanguageInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranslationLanguageInfoQuery({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      to_language_code: // value for 'to_language_code'
 *   },
 * });
 */
export function useGetTranslationLanguageInfoQuery(baseOptions: Apollo.QueryHookOptions<GetTranslationLanguageInfoQuery, GetTranslationLanguageInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranslationLanguageInfoQuery, GetTranslationLanguageInfoQueryVariables>(GetTranslationLanguageInfoDocument, options);
      }
export function useGetTranslationLanguageInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranslationLanguageInfoQuery, GetTranslationLanguageInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranslationLanguageInfoQuery, GetTranslationLanguageInfoQueryVariables>(GetTranslationLanguageInfoDocument, options);
        }
export type GetTranslationLanguageInfoQueryHookResult = ReturnType<typeof useGetTranslationLanguageInfoQuery>;
export type GetTranslationLanguageInfoLazyQueryHookResult = ReturnType<typeof useGetTranslationLanguageInfoLazyQuery>;
export type GetTranslationLanguageInfoQueryResult = Apollo.QueryResult<GetTranslationLanguageInfoQuery, GetTranslationLanguageInfoQueryVariables>;
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
export const GetRecommendedTranslationFromDefinitionIDsDocument = gql`
    query GetRecommendedTranslationFromDefinitionIDs($from_definition_ids: [ID!]!, $from_type_is_words: [Boolean!]!, $language_code: String!, $dialect_code: String, $geo_code: String) {
  getRecommendedTranslationFromDefinitionIDs(
    from_definition_ids: $from_definition_ids
    from_type_is_words: $from_type_is_words
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
 * __useGetRecommendedTranslationFromDefinitionIDsQuery__
 *
 * To run a query within a React component, call `useGetRecommendedTranslationFromDefinitionIDsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedTranslationFromDefinitionIDsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedTranslationFromDefinitionIDsQuery({
 *   variables: {
 *      from_definition_ids: // value for 'from_definition_ids'
 *      from_type_is_words: // value for 'from_type_is_words'
 *      language_code: // value for 'language_code'
 *      dialect_code: // value for 'dialect_code'
 *      geo_code: // value for 'geo_code'
 *   },
 * });
 */
export function useGetRecommendedTranslationFromDefinitionIDsQuery(baseOptions: Apollo.QueryHookOptions<GetRecommendedTranslationFromDefinitionIDsQuery, GetRecommendedTranslationFromDefinitionIDsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecommendedTranslationFromDefinitionIDsQuery, GetRecommendedTranslationFromDefinitionIDsQueryVariables>(GetRecommendedTranslationFromDefinitionIDsDocument, options);
      }
export function useGetRecommendedTranslationFromDefinitionIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecommendedTranslationFromDefinitionIDsQuery, GetRecommendedTranslationFromDefinitionIDsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecommendedTranslationFromDefinitionIDsQuery, GetRecommendedTranslationFromDefinitionIDsQueryVariables>(GetRecommendedTranslationFromDefinitionIDsDocument, options);
        }
export type GetRecommendedTranslationFromDefinitionIDsQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromDefinitionIDsQuery>;
export type GetRecommendedTranslationFromDefinitionIDsLazyQueryHookResult = ReturnType<typeof useGetRecommendedTranslationFromDefinitionIDsLazyQuery>;
export type GetRecommendedTranslationFromDefinitionIDsQueryResult = Apollo.QueryResult<GetRecommendedTranslationFromDefinitionIDsQuery, GetRecommendedTranslationFromDefinitionIDsQueryVariables>;
export const LanguagesForBotTranslateDocument = gql`
    query LanguagesForBotTranslate($botType: BotType!) {
  languagesForBotTranslate(botType: $botType) {
    error
    languages {
      code
      name
    }
  }
}
    `;

/**
 * __useLanguagesForBotTranslateQuery__
 *
 * To run a query within a React component, call `useLanguagesForBotTranslateQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesForBotTranslateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesForBotTranslateQuery({
 *   variables: {
 *      botType: // value for 'botType'
 *   },
 * });
 */
export function useLanguagesForBotTranslateQuery(baseOptions: Apollo.QueryHookOptions<LanguagesForBotTranslateQuery, LanguagesForBotTranslateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LanguagesForBotTranslateQuery, LanguagesForBotTranslateQueryVariables>(LanguagesForBotTranslateDocument, options);
      }
export function useLanguagesForBotTranslateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguagesForBotTranslateQuery, LanguagesForBotTranslateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LanguagesForBotTranslateQuery, LanguagesForBotTranslateQueryVariables>(LanguagesForBotTranslateDocument, options);
        }
export type LanguagesForBotTranslateQueryHookResult = ReturnType<typeof useLanguagesForBotTranslateQuery>;
export type LanguagesForBotTranslateLazyQueryHookResult = ReturnType<typeof useLanguagesForBotTranslateLazyQuery>;
export type LanguagesForBotTranslateQueryResult = Apollo.QueryResult<LanguagesForBotTranslateQuery, LanguagesForBotTranslateQueryVariables>;
export const TranslateWordsAndPhrasesByGoogleDocument = gql`
    mutation TranslateWordsAndPhrasesByGoogle($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesByGoogle(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesByGoogleMutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesByGoogleMutation, TranslateWordsAndPhrasesByGoogleMutationVariables>;

/**
 * __useTranslateWordsAndPhrasesByGoogleMutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesByGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesByGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesByGoogleMutation, { data, loading, error }] = useTranslateWordsAndPhrasesByGoogleMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesByGoogleMutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesByGoogleMutation, TranslateWordsAndPhrasesByGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesByGoogleMutation, TranslateWordsAndPhrasesByGoogleMutationVariables>(TranslateWordsAndPhrasesByGoogleDocument, options);
      }
export type TranslateWordsAndPhrasesByGoogleMutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesByGoogleMutation>;
export type TranslateWordsAndPhrasesByGoogleMutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesByGoogleMutation>;
export type TranslateWordsAndPhrasesByGoogleMutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesByGoogleMutation, TranslateWordsAndPhrasesByGoogleMutationVariables>;
export const TranslateWordsAndPhrasesByChatGpt35Document = gql`
    mutation TranslateWordsAndPhrasesByChatGPT35($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesByChatGPT35(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesByChatGpt35MutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesByChatGpt35Mutation, TranslateWordsAndPhrasesByChatGpt35MutationVariables>;

/**
 * __useTranslateWordsAndPhrasesByChatGpt35Mutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesByChatGpt35Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesByChatGpt35Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesByChatGpt35Mutation, { data, loading, error }] = useTranslateWordsAndPhrasesByChatGpt35Mutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesByChatGpt35Mutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesByChatGpt35Mutation, TranslateWordsAndPhrasesByChatGpt35MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesByChatGpt35Mutation, TranslateWordsAndPhrasesByChatGpt35MutationVariables>(TranslateWordsAndPhrasesByChatGpt35Document, options);
      }
export type TranslateWordsAndPhrasesByChatGpt35MutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesByChatGpt35Mutation>;
export type TranslateWordsAndPhrasesByChatGpt35MutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesByChatGpt35Mutation>;
export type TranslateWordsAndPhrasesByChatGpt35MutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesByChatGpt35Mutation, TranslateWordsAndPhrasesByChatGpt35MutationVariables>;
export const TranslateWordsAndPhrasesByChatGpt4Document = gql`
    mutation TranslateWordsAndPhrasesByChatGPT4($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesByChatGPT4(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesByChatGpt4MutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesByChatGpt4Mutation, TranslateWordsAndPhrasesByChatGpt4MutationVariables>;

/**
 * __useTranslateWordsAndPhrasesByChatGpt4Mutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesByChatGpt4Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesByChatGpt4Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesByChatGpt4Mutation, { data, loading, error }] = useTranslateWordsAndPhrasesByChatGpt4Mutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesByChatGpt4Mutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesByChatGpt4Mutation, TranslateWordsAndPhrasesByChatGpt4MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesByChatGpt4Mutation, TranslateWordsAndPhrasesByChatGpt4MutationVariables>(TranslateWordsAndPhrasesByChatGpt4Document, options);
      }
export type TranslateWordsAndPhrasesByChatGpt4MutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesByChatGpt4Mutation>;
export type TranslateWordsAndPhrasesByChatGpt4MutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesByChatGpt4Mutation>;
export type TranslateWordsAndPhrasesByChatGpt4MutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesByChatGpt4Mutation, TranslateWordsAndPhrasesByChatGpt4MutationVariables>;
export const TranslateMissingWordsAndPhrasesByChatGptDocument = gql`
    mutation TranslateMissingWordsAndPhrasesByChatGPT($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String, $version: String!) {
  translateMissingWordsAndPhrasesByChatGpt(
    version: $version
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateMissingWordsAndPhrasesByChatGptMutationFn = Apollo.MutationFunction<TranslateMissingWordsAndPhrasesByChatGptMutation, TranslateMissingWordsAndPhrasesByChatGptMutationVariables>;

/**
 * __useTranslateMissingWordsAndPhrasesByChatGptMutation__
 *
 * To run a mutation, you first call `useTranslateMissingWordsAndPhrasesByChatGptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateMissingWordsAndPhrasesByChatGptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateMissingWordsAndPhrasesByChatGptMutation, { data, loading, error }] = useTranslateMissingWordsAndPhrasesByChatGptMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useTranslateMissingWordsAndPhrasesByChatGptMutation(baseOptions?: Apollo.MutationHookOptions<TranslateMissingWordsAndPhrasesByChatGptMutation, TranslateMissingWordsAndPhrasesByChatGptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateMissingWordsAndPhrasesByChatGptMutation, TranslateMissingWordsAndPhrasesByChatGptMutationVariables>(TranslateMissingWordsAndPhrasesByChatGptDocument, options);
      }
export type TranslateMissingWordsAndPhrasesByChatGptMutationHookResult = ReturnType<typeof useTranslateMissingWordsAndPhrasesByChatGptMutation>;
export type TranslateMissingWordsAndPhrasesByChatGptMutationResult = Apollo.MutationResult<TranslateMissingWordsAndPhrasesByChatGptMutation>;
export type TranslateMissingWordsAndPhrasesByChatGptMutationOptions = Apollo.BaseMutationOptions<TranslateMissingWordsAndPhrasesByChatGptMutation, TranslateMissingWordsAndPhrasesByChatGptMutationVariables>;
export const TranslateMissingWordsAndPhrasesByGoogleDocument = gql`
    mutation TranslateMissingWordsAndPhrasesByGoogle($from_language_code: String!, $to_language_code: String!) {
  translateMissingWordsAndPhrasesByGoogle(
    from_language: {language_code: $from_language_code}
    to_language: {language_code: $to_language_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateMissingWordsAndPhrasesByGoogleMutationFn = Apollo.MutationFunction<TranslateMissingWordsAndPhrasesByGoogleMutation, TranslateMissingWordsAndPhrasesByGoogleMutationVariables>;

/**
 * __useTranslateMissingWordsAndPhrasesByGoogleMutation__
 *
 * To run a mutation, you first call `useTranslateMissingWordsAndPhrasesByGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateMissingWordsAndPhrasesByGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateMissingWordsAndPhrasesByGoogleMutation, { data, loading, error }] = useTranslateMissingWordsAndPhrasesByGoogleMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      to_language_code: // value for 'to_language_code'
 *   },
 * });
 */
export function useTranslateMissingWordsAndPhrasesByGoogleMutation(baseOptions?: Apollo.MutationHookOptions<TranslateMissingWordsAndPhrasesByGoogleMutation, TranslateMissingWordsAndPhrasesByGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateMissingWordsAndPhrasesByGoogleMutation, TranslateMissingWordsAndPhrasesByGoogleMutationVariables>(TranslateMissingWordsAndPhrasesByGoogleDocument, options);
      }
export type TranslateMissingWordsAndPhrasesByGoogleMutationHookResult = ReturnType<typeof useTranslateMissingWordsAndPhrasesByGoogleMutation>;
export type TranslateMissingWordsAndPhrasesByGoogleMutationResult = Apollo.MutationResult<TranslateMissingWordsAndPhrasesByGoogleMutation>;
export type TranslateMissingWordsAndPhrasesByGoogleMutationOptions = Apollo.BaseMutationOptions<TranslateMissingWordsAndPhrasesByGoogleMutation, TranslateMissingWordsAndPhrasesByGoogleMutationVariables>;
export const TranslateMissingWordsAndPhrasesByDeepLDocument = gql`
    mutation TranslateMissingWordsAndPhrasesByDeepL($from_language_code: String!, $to_language_code: String!) {
  translateMissingWordsAndPhrasesByDeepL(
    from_language: {language_code: $from_language_code}
    to_language: {language_code: $to_language_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateMissingWordsAndPhrasesByDeepLMutationFn = Apollo.MutationFunction<TranslateMissingWordsAndPhrasesByDeepLMutation, TranslateMissingWordsAndPhrasesByDeepLMutationVariables>;

/**
 * __useTranslateMissingWordsAndPhrasesByDeepLMutation__
 *
 * To run a mutation, you first call `useTranslateMissingWordsAndPhrasesByDeepLMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateMissingWordsAndPhrasesByDeepLMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateMissingWordsAndPhrasesByDeepLMutation, { data, loading, error }] = useTranslateMissingWordsAndPhrasesByDeepLMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      to_language_code: // value for 'to_language_code'
 *   },
 * });
 */
export function useTranslateMissingWordsAndPhrasesByDeepLMutation(baseOptions?: Apollo.MutationHookOptions<TranslateMissingWordsAndPhrasesByDeepLMutation, TranslateMissingWordsAndPhrasesByDeepLMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateMissingWordsAndPhrasesByDeepLMutation, TranslateMissingWordsAndPhrasesByDeepLMutationVariables>(TranslateMissingWordsAndPhrasesByDeepLDocument, options);
      }
export type TranslateMissingWordsAndPhrasesByDeepLMutationHookResult = ReturnType<typeof useTranslateMissingWordsAndPhrasesByDeepLMutation>;
export type TranslateMissingWordsAndPhrasesByDeepLMutationResult = Apollo.MutationResult<TranslateMissingWordsAndPhrasesByDeepLMutation>;
export type TranslateMissingWordsAndPhrasesByDeepLMutationOptions = Apollo.BaseMutationOptions<TranslateMissingWordsAndPhrasesByDeepLMutation, TranslateMissingWordsAndPhrasesByDeepLMutationVariables>;
export const TranslateMissingWordsAndPhrasesByLiltDocument = gql`
    mutation TranslateMissingWordsAndPhrasesByLilt($from_language_code: String!, $to_language_code: String!) {
  translateMissingWordsAndPhrasesByLilt(
    from_language: {language_code: $from_language_code}
    to_language: {language_code: $to_language_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateMissingWordsAndPhrasesByLiltMutationFn = Apollo.MutationFunction<TranslateMissingWordsAndPhrasesByLiltMutation, TranslateMissingWordsAndPhrasesByLiltMutationVariables>;

/**
 * __useTranslateMissingWordsAndPhrasesByLiltMutation__
 *
 * To run a mutation, you first call `useTranslateMissingWordsAndPhrasesByLiltMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateMissingWordsAndPhrasesByLiltMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateMissingWordsAndPhrasesByLiltMutation, { data, loading, error }] = useTranslateMissingWordsAndPhrasesByLiltMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      to_language_code: // value for 'to_language_code'
 *   },
 * });
 */
export function useTranslateMissingWordsAndPhrasesByLiltMutation(baseOptions?: Apollo.MutationHookOptions<TranslateMissingWordsAndPhrasesByLiltMutation, TranslateMissingWordsAndPhrasesByLiltMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateMissingWordsAndPhrasesByLiltMutation, TranslateMissingWordsAndPhrasesByLiltMutationVariables>(TranslateMissingWordsAndPhrasesByLiltDocument, options);
      }
export type TranslateMissingWordsAndPhrasesByLiltMutationHookResult = ReturnType<typeof useTranslateMissingWordsAndPhrasesByLiltMutation>;
export type TranslateMissingWordsAndPhrasesByLiltMutationResult = Apollo.MutationResult<TranslateMissingWordsAndPhrasesByLiltMutation>;
export type TranslateMissingWordsAndPhrasesByLiltMutationOptions = Apollo.BaseMutationOptions<TranslateMissingWordsAndPhrasesByLiltMutation, TranslateMissingWordsAndPhrasesByLiltMutationVariables>;
export const TranslateMissingWordsAndPhrasesBySmartcatDocument = gql`
    mutation TranslateMissingWordsAndPhrasesBySmartcat($from_language_code: String!, $to_language_code: String!) {
  translateMissingWordsAndPhrasesBySmartcat(
    from_language: {language_code: $from_language_code}
    to_language: {language_code: $to_language_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateMissingWordsAndPhrasesBySmartcatMutationFn = Apollo.MutationFunction<TranslateMissingWordsAndPhrasesBySmartcatMutation, TranslateMissingWordsAndPhrasesBySmartcatMutationVariables>;

/**
 * __useTranslateMissingWordsAndPhrasesBySmartcatMutation__
 *
 * To run a mutation, you first call `useTranslateMissingWordsAndPhrasesBySmartcatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateMissingWordsAndPhrasesBySmartcatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateMissingWordsAndPhrasesBySmartcatMutation, { data, loading, error }] = useTranslateMissingWordsAndPhrasesBySmartcatMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      to_language_code: // value for 'to_language_code'
 *   },
 * });
 */
export function useTranslateMissingWordsAndPhrasesBySmartcatMutation(baseOptions?: Apollo.MutationHookOptions<TranslateMissingWordsAndPhrasesBySmartcatMutation, TranslateMissingWordsAndPhrasesBySmartcatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateMissingWordsAndPhrasesBySmartcatMutation, TranslateMissingWordsAndPhrasesBySmartcatMutationVariables>(TranslateMissingWordsAndPhrasesBySmartcatDocument, options);
      }
export type TranslateMissingWordsAndPhrasesBySmartcatMutationHookResult = ReturnType<typeof useTranslateMissingWordsAndPhrasesBySmartcatMutation>;
export type TranslateMissingWordsAndPhrasesBySmartcatMutationResult = Apollo.MutationResult<TranslateMissingWordsAndPhrasesBySmartcatMutation>;
export type TranslateMissingWordsAndPhrasesBySmartcatMutationOptions = Apollo.BaseMutationOptions<TranslateMissingWordsAndPhrasesBySmartcatMutation, TranslateMissingWordsAndPhrasesBySmartcatMutationVariables>;
export const TranslateWordsAndPhrasesByLiltDocument = gql`
    mutation TranslateWordsAndPhrasesByLilt($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesByLilt(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesByLiltMutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesByLiltMutation, TranslateWordsAndPhrasesByLiltMutationVariables>;

/**
 * __useTranslateWordsAndPhrasesByLiltMutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesByLiltMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesByLiltMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesByLiltMutation, { data, loading, error }] = useTranslateWordsAndPhrasesByLiltMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesByLiltMutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesByLiltMutation, TranslateWordsAndPhrasesByLiltMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesByLiltMutation, TranslateWordsAndPhrasesByLiltMutationVariables>(TranslateWordsAndPhrasesByLiltDocument, options);
      }
export type TranslateWordsAndPhrasesByLiltMutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesByLiltMutation>;
export type TranslateWordsAndPhrasesByLiltMutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesByLiltMutation>;
export type TranslateWordsAndPhrasesByLiltMutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesByLiltMutation, TranslateWordsAndPhrasesByLiltMutationVariables>;
export const TranslateWordsAndPhrasesBySmartcatDocument = gql`
    mutation TranslateWordsAndPhrasesBySmartcat($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesBySmartcat(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesBySmartcatMutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesBySmartcatMutation, TranslateWordsAndPhrasesBySmartcatMutationVariables>;

/**
 * __useTranslateWordsAndPhrasesBySmartcatMutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesBySmartcatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesBySmartcatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesBySmartcatMutation, { data, loading, error }] = useTranslateWordsAndPhrasesBySmartcatMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesBySmartcatMutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesBySmartcatMutation, TranslateWordsAndPhrasesBySmartcatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesBySmartcatMutation, TranslateWordsAndPhrasesBySmartcatMutationVariables>(TranslateWordsAndPhrasesBySmartcatDocument, options);
      }
export type TranslateWordsAndPhrasesBySmartcatMutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesBySmartcatMutation>;
export type TranslateWordsAndPhrasesBySmartcatMutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesBySmartcatMutation>;
export type TranslateWordsAndPhrasesBySmartcatMutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesBySmartcatMutation, TranslateWordsAndPhrasesBySmartcatMutationVariables>;
export const TranslateWordsAndPhrasesByDeepLDocument = gql`
    mutation TranslateWordsAndPhrasesByDeepL($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String, $to_language_code: String!, $to_dialect_code: String, $to_geo_code: String) {
  translateWordsAndPhrasesByDeepL(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
    to_language: {language_code: $to_language_code, dialect_code: $to_dialect_code, geo_code: $to_geo_code}
  ) {
    error
    result {
      requestedCharacters
      totalPhraseCount
      totalWordCount
      translatedPhraseCount
      translatedWordCount
    }
  }
}
    `;
export type TranslateWordsAndPhrasesByDeepLMutationFn = Apollo.MutationFunction<TranslateWordsAndPhrasesByDeepLMutation, TranslateWordsAndPhrasesByDeepLMutationVariables>;

/**
 * __useTranslateWordsAndPhrasesByDeepLMutation__
 *
 * To run a mutation, you first call `useTranslateWordsAndPhrasesByDeepLMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateWordsAndPhrasesByDeepLMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateWordsAndPhrasesByDeepLMutation, { data, loading, error }] = useTranslateWordsAndPhrasesByDeepLMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *      to_language_code: // value for 'to_language_code'
 *      to_dialect_code: // value for 'to_dialect_code'
 *      to_geo_code: // value for 'to_geo_code'
 *   },
 * });
 */
export function useTranslateWordsAndPhrasesByDeepLMutation(baseOptions?: Apollo.MutationHookOptions<TranslateWordsAndPhrasesByDeepLMutation, TranslateWordsAndPhrasesByDeepLMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateWordsAndPhrasesByDeepLMutation, TranslateWordsAndPhrasesByDeepLMutationVariables>(TranslateWordsAndPhrasesByDeepLDocument, options);
      }
export type TranslateWordsAndPhrasesByDeepLMutationHookResult = ReturnType<typeof useTranslateWordsAndPhrasesByDeepLMutation>;
export type TranslateWordsAndPhrasesByDeepLMutationResult = Apollo.MutationResult<TranslateWordsAndPhrasesByDeepLMutation>;
export type TranslateWordsAndPhrasesByDeepLMutationOptions = Apollo.BaseMutationOptions<TranslateWordsAndPhrasesByDeepLMutation, TranslateWordsAndPhrasesByDeepLMutationVariables>;
export const TranslateAllWordsAndPhrasesByGoogleDocument = gql`
    mutation TranslateAllWordsAndPhrasesByGoogle($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String) {
  translateAllWordsAndPhrasesByGoogle(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
  ) {
    error
  }
}
    `;
export type TranslateAllWordsAndPhrasesByGoogleMutationFn = Apollo.MutationFunction<TranslateAllWordsAndPhrasesByGoogleMutation, TranslateAllWordsAndPhrasesByGoogleMutationVariables>;

/**
 * __useTranslateAllWordsAndPhrasesByGoogleMutation__
 *
 * To run a mutation, you first call `useTranslateAllWordsAndPhrasesByGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateAllWordsAndPhrasesByGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateAllWordsAndPhrasesByGoogleMutation, { data, loading, error }] = useTranslateAllWordsAndPhrasesByGoogleMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *   },
 * });
 */
export function useTranslateAllWordsAndPhrasesByGoogleMutation(baseOptions?: Apollo.MutationHookOptions<TranslateAllWordsAndPhrasesByGoogleMutation, TranslateAllWordsAndPhrasesByGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateAllWordsAndPhrasesByGoogleMutation, TranslateAllWordsAndPhrasesByGoogleMutationVariables>(TranslateAllWordsAndPhrasesByGoogleDocument, options);
      }
export type TranslateAllWordsAndPhrasesByGoogleMutationHookResult = ReturnType<typeof useTranslateAllWordsAndPhrasesByGoogleMutation>;
export type TranslateAllWordsAndPhrasesByGoogleMutationResult = Apollo.MutationResult<TranslateAllWordsAndPhrasesByGoogleMutation>;
export type TranslateAllWordsAndPhrasesByGoogleMutationOptions = Apollo.BaseMutationOptions<TranslateAllWordsAndPhrasesByGoogleMutation, TranslateAllWordsAndPhrasesByGoogleMutationVariables>;
export const TranslateAllWordsAndPhrasesByLiltDocument = gql`
    mutation TranslateAllWordsAndPhrasesByLilt($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String) {
  translateAllWordsAndPhrasesByLilt(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
  ) {
    error
  }
}
    `;
export type TranslateAllWordsAndPhrasesByLiltMutationFn = Apollo.MutationFunction<TranslateAllWordsAndPhrasesByLiltMutation, TranslateAllWordsAndPhrasesByLiltMutationVariables>;

/**
 * __useTranslateAllWordsAndPhrasesByLiltMutation__
 *
 * To run a mutation, you first call `useTranslateAllWordsAndPhrasesByLiltMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateAllWordsAndPhrasesByLiltMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateAllWordsAndPhrasesByLiltMutation, { data, loading, error }] = useTranslateAllWordsAndPhrasesByLiltMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *   },
 * });
 */
export function useTranslateAllWordsAndPhrasesByLiltMutation(baseOptions?: Apollo.MutationHookOptions<TranslateAllWordsAndPhrasesByLiltMutation, TranslateAllWordsAndPhrasesByLiltMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateAllWordsAndPhrasesByLiltMutation, TranslateAllWordsAndPhrasesByLiltMutationVariables>(TranslateAllWordsAndPhrasesByLiltDocument, options);
      }
export type TranslateAllWordsAndPhrasesByLiltMutationHookResult = ReturnType<typeof useTranslateAllWordsAndPhrasesByLiltMutation>;
export type TranslateAllWordsAndPhrasesByLiltMutationResult = Apollo.MutationResult<TranslateAllWordsAndPhrasesByLiltMutation>;
export type TranslateAllWordsAndPhrasesByLiltMutationOptions = Apollo.BaseMutationOptions<TranslateAllWordsAndPhrasesByLiltMutation, TranslateAllWordsAndPhrasesByLiltMutationVariables>;
export const TranslateAllWordsAndPhrasesBySmartcatDocument = gql`
    mutation TranslateAllWordsAndPhrasesBySmartcat($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String) {
  translateAllWordsAndPhrasesBySmartcat(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
  ) {
    error
  }
}
    `;
export type TranslateAllWordsAndPhrasesBySmartcatMutationFn = Apollo.MutationFunction<TranslateAllWordsAndPhrasesBySmartcatMutation, TranslateAllWordsAndPhrasesBySmartcatMutationVariables>;

/**
 * __useTranslateAllWordsAndPhrasesBySmartcatMutation__
 *
 * To run a mutation, you first call `useTranslateAllWordsAndPhrasesBySmartcatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateAllWordsAndPhrasesBySmartcatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateAllWordsAndPhrasesBySmartcatMutation, { data, loading, error }] = useTranslateAllWordsAndPhrasesBySmartcatMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *   },
 * });
 */
export function useTranslateAllWordsAndPhrasesBySmartcatMutation(baseOptions?: Apollo.MutationHookOptions<TranslateAllWordsAndPhrasesBySmartcatMutation, TranslateAllWordsAndPhrasesBySmartcatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateAllWordsAndPhrasesBySmartcatMutation, TranslateAllWordsAndPhrasesBySmartcatMutationVariables>(TranslateAllWordsAndPhrasesBySmartcatDocument, options);
      }
export type TranslateAllWordsAndPhrasesBySmartcatMutationHookResult = ReturnType<typeof useTranslateAllWordsAndPhrasesBySmartcatMutation>;
export type TranslateAllWordsAndPhrasesBySmartcatMutationResult = Apollo.MutationResult<TranslateAllWordsAndPhrasesBySmartcatMutation>;
export type TranslateAllWordsAndPhrasesBySmartcatMutationOptions = Apollo.BaseMutationOptions<TranslateAllWordsAndPhrasesBySmartcatMutation, TranslateAllWordsAndPhrasesBySmartcatMutationVariables>;
export const TranslateAllWordsAndPhrasesByDeepLDocument = gql`
    mutation TranslateAllWordsAndPhrasesByDeepL($from_language_code: String!, $from_dialect_code: String, $from_geo_code: String) {
  translateAllWordsAndPhrasesByDeepL(
    from_language: {language_code: $from_language_code, dialect_code: $from_dialect_code, geo_code: $from_geo_code}
  ) {
    error
  }
}
    `;
export type TranslateAllWordsAndPhrasesByDeepLMutationFn = Apollo.MutationFunction<TranslateAllWordsAndPhrasesByDeepLMutation, TranslateAllWordsAndPhrasesByDeepLMutationVariables>;

/**
 * __useTranslateAllWordsAndPhrasesByDeepLMutation__
 *
 * To run a mutation, you first call `useTranslateAllWordsAndPhrasesByDeepLMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTranslateAllWordsAndPhrasesByDeepLMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [translateAllWordsAndPhrasesByDeepLMutation, { data, loading, error }] = useTranslateAllWordsAndPhrasesByDeepLMutation({
 *   variables: {
 *      from_language_code: // value for 'from_language_code'
 *      from_dialect_code: // value for 'from_dialect_code'
 *      from_geo_code: // value for 'from_geo_code'
 *   },
 * });
 */
export function useTranslateAllWordsAndPhrasesByDeepLMutation(baseOptions?: Apollo.MutationHookOptions<TranslateAllWordsAndPhrasesByDeepLMutation, TranslateAllWordsAndPhrasesByDeepLMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TranslateAllWordsAndPhrasesByDeepLMutation, TranslateAllWordsAndPhrasesByDeepLMutationVariables>(TranslateAllWordsAndPhrasesByDeepLDocument, options);
      }
export type TranslateAllWordsAndPhrasesByDeepLMutationHookResult = ReturnType<typeof useTranslateAllWordsAndPhrasesByDeepLMutation>;
export type TranslateAllWordsAndPhrasesByDeepLMutationResult = Apollo.MutationResult<TranslateAllWordsAndPhrasesByDeepLMutation>;
export type TranslateAllWordsAndPhrasesByDeepLMutationOptions = Apollo.BaseMutationOptions<TranslateAllWordsAndPhrasesByDeepLMutation, TranslateAllWordsAndPhrasesByDeepLMutationVariables>;
export const StopBotTranslationDocument = gql`
    mutation StopBotTranslation {
  stopBotTranslation {
    error
  }
}
    `;
export type StopBotTranslationMutationFn = Apollo.MutationFunction<StopBotTranslationMutation, StopBotTranslationMutationVariables>;

/**
 * __useStopBotTranslationMutation__
 *
 * To run a mutation, you first call `useStopBotTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopBotTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopBotTranslationMutation, { data, loading, error }] = useStopBotTranslationMutation({
 *   variables: {
 *   },
 * });
 */
export function useStopBotTranslationMutation(baseOptions?: Apollo.MutationHookOptions<StopBotTranslationMutation, StopBotTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopBotTranslationMutation, StopBotTranslationMutationVariables>(StopBotTranslationDocument, options);
      }
export type StopBotTranslationMutationHookResult = ReturnType<typeof useStopBotTranslationMutation>;
export type StopBotTranslationMutationResult = Apollo.MutationResult<StopBotTranslationMutation>;
export type StopBotTranslationMutationOptions = Apollo.BaseMutationOptions<StopBotTranslationMutation, StopBotTranslationMutationVariables>;
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
export const SubscribeToTranslationReportDocument = gql`
    subscription SubscribeToTranslationReport {
  TranslationReport {
    requestedCharacters
    totalPhraseCount
    totalWordCount
    translatedPhraseCount
    translatedWordCount
    status
    message
    errors
    total
    completed
  }
}
    `;

/**
 * __useSubscribeToTranslationReportSubscription__
 *
 * To run a query within a React component, call `useSubscribeToTranslationReportSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTranslationReportSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToTranslationReportSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToTranslationReportSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToTranslationReportSubscription, SubscribeToTranslationReportSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToTranslationReportSubscription, SubscribeToTranslationReportSubscriptionVariables>(SubscribeToTranslationReportDocument, options);
      }
export type SubscribeToTranslationReportSubscriptionHookResult = ReturnType<typeof useSubscribeToTranslationReportSubscription>;
export type SubscribeToTranslationReportSubscriptionResult = Apollo.SubscriptionResult<SubscribeToTranslationReportSubscription>;
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

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "MapWordOrPhraseAsOrig": [
      "PhraseWithDefinition",
      "WordWithDefinition"
    ],
    "SiteTextDefinition": [
      "SiteTextPhraseDefinition",
      "SiteTextWordDefinition"
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
    GetTotalPosts: 'GetTotalPosts',
    PostsByParent: 'PostsByParent',
    WordDefinitionRead: 'WordDefinitionRead',
    GetWordsByLanguage: 'GetWordsByLanguage',
    GetWordDefinitionsByWordId: 'GetWordDefinitionsByWordId',
    GetWordWithVoteById: 'GetWordWithVoteById',
    GetAllDocuments: 'GetAllDocuments',
    GetDocument: 'GetDocument',
    GetDocumentWordEntriesByDocumentId: 'GetDocumentWordEntriesByDocumentId',
    GetDocumentTextFromRanges: 'GetDocumentTextFromRanges',
    GetWordRangesByDocumentId: 'GetWordRangesByDocumentId',
    ReadWordRange: 'ReadWordRange',
    GetFlagsFromRef: 'GetFlagsFromRef',
    GetWordDefinitionsByFlag: 'GetWordDefinitionsByFlag',
    GetPhraseDefinitionsByFlag: 'GetPhraseDefinitionsByFlag',
    GetThreadById: 'GetThreadById',
    GetThreadsList: 'GetThreadsList',
    GetForumFolderById: 'GetForumFolderById',
    GetForumFoldersList: 'GetForumFoldersList',
    GetForumById: 'GetForumById',
    GetForumsList: 'GetForumsList',
    GetOrigMapWordsAndPhrases: 'GetOrigMapWordsAndPhrases',
    GetOrigMapWordsAndPhrasesCount: 'GetOrigMapWordsAndPhrasesCount',
    GetMapWordOrPhraseAsOrigByDefinitionId: 'GetMapWordOrPhraseAsOrigByDefinitionId',
    GetAllMapsList: 'GetAllMapsList',
    GetMapDetails: 'GetMapDetails',
    IsAdminLoggedIn: 'IsAdminLoggedIn',
    GetMapVoteStatus: 'GetMapVoteStatus',
    ListNotifications: 'ListNotifications',
    GetPericopiesByDocumentId: 'GetPericopiesByDocumentId',
    GetPericopeVoteStatus: 'GetPericopeVoteStatus',
    PhraseDefinitionRead: 'PhraseDefinitionRead',
    GetPhrasesByLanguage: 'GetPhrasesByLanguage',
    GetPhraseDefinitionsByPhraseId: 'GetPhraseDefinitionsByPhraseId',
    GetPhraseWithVoteById: 'GetPhraseWithVoteById',
    PostRead: 'PostRead',
    GetQuestionOnWordRangesByDocumentId: 'GetQuestionOnWordRangesByDocumentId',
    GetAnswersByQuestionId: 'GetAnswersByQuestionId',
    getQuestionStatistic: 'getQuestionStatistic',
    GetAllSiteTextDefinitions: 'GetAllSiteTextDefinitions',
    GetAllTranslationFromSiteTextDefinitionID: 'GetAllTranslationFromSiteTextDefinitionID',
    SiteTextWordDefinitionRead: 'SiteTextWordDefinitionRead',
    SiteTextPhraseDefinitionRead: 'SiteTextPhraseDefinitionRead',
    GetAllSiteTextLanguageList: 'GetAllSiteTextLanguageList',
    GetRecommendedTranslationFromSiteTextDefinitionID: 'GetRecommendedTranslationFromSiteTextDefinitionID',
    GetAllRecommendedSiteTextTranslationListByLanguage: 'GetAllRecommendedSiteTextTranslationListByLanguage',
    GetAllRecommendedSiteTextTranslationList: 'GetAllRecommendedSiteTextTranslationList',
    GetAllSiteTextLanguageListWithRate: 'GetAllSiteTextLanguageListWithRate',
    GetTranslationLanguageInfo: 'GetTranslationLanguageInfo',
    GetTranslationsByFromDefinitionId: 'GetTranslationsByFromDefinitionId',
    GetRecommendedTranslationFromDefinitionID: 'GetRecommendedTranslationFromDefinitionID',
    GetRecommendedTranslationFromDefinitionIDs: 'GetRecommendedTranslationFromDefinitionIDs',
    LanguagesForBotTranslate: 'LanguagesForBotTranslate',
    UserRead: 'UserRead',
    GetFileUploadUrl: 'GetFileUploadUrl'
  },
  Mutation: {
    PostCreate: 'PostCreate',
    Register: 'Register',
    Login: 'Login',
    Logout: 'Logout',
    ResetEmailRequest: 'ResetEmailRequest',
    PasswordResetFormRequest: 'PasswordResetFormRequest',
    GenerateData: 'GenerateData',
    StopDataGeneration: 'StopDataGeneration',
    WordDefinitionUpsert: 'WordDefinitionUpsert',
    ToggleWordDefinitionVoteStatus: 'ToggleWordDefinitionVoteStatus',
    ToggleWordVoteStatus: 'ToggleWordVoteStatus',
    WordUpsert: 'WordUpsert',
    DocumentUpload: 'DocumentUpload',
    UpsertWordRange: 'UpsertWordRange',
    EmailResponse: 'EmailResponse',
    UploadFile: 'UploadFile',
    ToggleFlagWithRef: 'ToggleFlagWithRef',
    CreateThread: 'CreateThread',
    UpdateThread: 'UpdateThread',
    DeleteThread: 'DeleteThread',
    CreateForumFolder: 'CreateForumFolder',
    UpdateForumFolder: 'UpdateForumFolder',
    DeleteForumFolder: 'DeleteForumFolder',
    CreateForum: 'CreateForum',
    UpdateForum: 'UpdateForum',
    DeleteForum: 'DeleteForum',
    StartZipMapDownload: 'StartZipMapDownload',
    MapUpload: 'MapUpload',
    MapDelete: 'MapDelete',
    MapsTranslationsReset: 'MapsTranslationsReset',
    MapsReTranslate: 'MapsReTranslate',
    ToggleMapVoteStatus: 'ToggleMapVoteStatus',
    ForceMarkAndRetranslateOriginalMapsIds: 'ForceMarkAndRetranslateOriginalMapsIds',
    AddNotification: 'AddNotification',
    DeleteNotification: 'DeleteNotification',
    MarkNotificationRead: 'MarkNotificationRead',
    TogglePericopeVoteStatus: 'TogglePericopeVoteStatus',
    UpsertPericope: 'UpsertPericope',
    PhraseDefinitionUpsert: 'PhraseDefinitionUpsert',
    TogglePhraseDefinitionVoteStatus: 'TogglePhraseDefinitionVoteStatus',
    TogglePhraseVoteStatus: 'TogglePhraseVoteStatus',
    PhraseUpsert: 'PhraseUpsert',
    VersionCreate: 'VersionCreate',
    CreateQuestionOnWordRange: 'CreateQuestionOnWordRange',
    UpsertAnswer: 'UpsertAnswer',
    UpsertSiteTextTranslation: 'UpsertSiteTextTranslation',
    SiteTextUpsert: 'SiteTextUpsert',
    TranslateWordsAndPhrasesByGoogle: 'TranslateWordsAndPhrasesByGoogle',
    TranslateWordsAndPhrasesByChatGPT35: 'TranslateWordsAndPhrasesByChatGPT35',
    TranslateWordsAndPhrasesByChatGPT4: 'TranslateWordsAndPhrasesByChatGPT4',
    TranslateMissingWordsAndPhrasesByChatGPT: 'TranslateMissingWordsAndPhrasesByChatGPT',
    TranslateMissingWordsAndPhrasesByGoogle: 'TranslateMissingWordsAndPhrasesByGoogle',
    TranslateMissingWordsAndPhrasesByDeepL: 'TranslateMissingWordsAndPhrasesByDeepL',
    TranslateMissingWordsAndPhrasesByLilt: 'TranslateMissingWordsAndPhrasesByLilt',
    TranslateMissingWordsAndPhrasesBySmartcat: 'TranslateMissingWordsAndPhrasesBySmartcat',
    TranslateWordsAndPhrasesByLilt: 'TranslateWordsAndPhrasesByLilt',
    TranslateWordsAndPhrasesBySmartcat: 'TranslateWordsAndPhrasesBySmartcat',
    TranslateWordsAndPhrasesByDeepL: 'TranslateWordsAndPhrasesByDeepL',
    TranslateAllWordsAndPhrasesByGoogle: 'TranslateAllWordsAndPhrasesByGoogle',
    TranslateAllWordsAndPhrasesByLilt: 'TranslateAllWordsAndPhrasesByLilt',
    TranslateAllWordsAndPhrasesBySmartcat: 'TranslateAllWordsAndPhrasesBySmartcat',
    TranslateAllWordsAndPhrasesByDeepL: 'TranslateAllWordsAndPhrasesByDeepL',
    StopBotTranslation: 'StopBotTranslation',
    ToggleTranslationVoteStatus: 'ToggleTranslationVoteStatus',
    UpsertTranslation: 'UpsertTranslation',
    UpsertTranslationFromWordAndDefinitionlikeString: 'UpsertTranslationFromWordAndDefinitionlikeString',
    UpsertWordDefinitionFromWordAndDefinitionlikeString: 'UpsertWordDefinitionFromWordAndDefinitionlikeString',
    UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString: 'UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString',
    AvatarUpdate: 'AvatarUpdate'
  },
  Subscription: {
    SubscribeToDataGenProgress: 'SubscribeToDataGenProgress',
    SubscribeToZipMap: 'SubscribeToZipMap',
    SubscribeToTranslationReport: 'SubscribeToTranslationReport'
  },
  Fragment: {
    UserFields: 'UserFields',
    PostFields: 'PostFields',
    SessionFields: 'SessionFields',
    WordlikeStringFragment: 'WordlikeStringFragment',
    WordFragment: 'WordFragment',
    WordDefinitionFragment: 'WordDefinitionFragment',
    WordWithDefinitionsFragment: 'WordWithDefinitionsFragment',
    WordDefinitionWithVoteFragment: 'WordDefinitionWithVoteFragment',
    WordWithVoteFragment: 'WordWithVoteFragment',
    DefinitionVoteStatusFragment: 'DefinitionVoteStatusFragment',
    WordVoteStatusFragment: 'WordVoteStatusFragment',
    WordWithVoteListEdgeFragment: 'WordWithVoteListEdgeFragment',
    PageInfoFragment: 'PageInfoFragment',
    TextyDocumentFragment: 'TextyDocumentFragment',
    DocumentWordEntryFragment: 'DocumentWordEntryFragment',
    WordRangeFragment: 'WordRangeFragment',
    WordRangesEdgeFragment: 'WordRangesEdgeFragment',
    DocumentEdgeFragment: 'DocumentEdgeFragment',
    DocumentWordEntriesEdgeFragment: 'DocumentWordEntriesEdgeFragment',
    FlagFragment: 'FlagFragment',
    WordDefinitionListEdgeFragment: 'WordDefinitionListEdgeFragment',
    PhraseDefinitionListEdgeFragment: 'PhraseDefinitionListEdgeFragment',
    ThreadFragment: 'ThreadFragment',
    ForumFolderFragment: 'ForumFolderFragment',
    ForumFolderNodeFragment: 'ForumFolderNodeFragment',
    ForumFragment: 'ForumFragment',
    ForumNodeFragment: 'ForumNodeFragment',
    ThreadEdgeFragment: 'ThreadEdgeFragment',
    ForumFolderEdgeFragment: 'ForumFolderEdgeFragment',
    ForumEdgeFragment: 'ForumEdgeFragment',
    MapDetailsOutputFragment: 'MapDetailsOutputFragment',
    MapDetailsOutputEdgeFragment: 'MapDetailsOutputEdgeFragment',
    MapWordOrPhraseFragment: 'MapWordOrPhraseFragment',
    MapWordsAndPhrasesEdgeFragment: 'MapWordsAndPhrasesEdgeFragment',
    WordWithDefinitionFragment: 'WordWithDefinitionFragment',
    PhraseWithDefinitionFragment: 'PhraseWithDefinitionFragment',
    MapVoteStatusFragment: 'MapVoteStatusFragment',
    PericopeFragment: 'PericopeFragment',
    PericopeVoteStatusFragment: 'PericopeVoteStatusFragment',
    PericopeWithVoteFragment: 'PericopeWithVoteFragment',
    PericopeWithVotesEdgeFragment: 'PericopeWithVotesEdgeFragment',
    PhraseFragment: 'PhraseFragment',
    PhraseDefinitionFragment: 'PhraseDefinitionFragment',
    PhraseWithDefinitionsFragment: 'PhraseWithDefinitionsFragment',
    PhraseDefinitionWithVoteFragment: 'PhraseDefinitionWithVoteFragment',
    PhraseWithVoteFragment: 'PhraseWithVoteFragment',
    PhraseVoteStatusFragment: 'PhraseVoteStatusFragment',
    PhraseWithVoteListEdgeFragment: 'PhraseWithVoteListEdgeFragment',
    VersionFields: 'VersionFields',
    QuestionItemFragment: 'QuestionItemFragment',
    QuestionItemWithStatisticFragment: 'QuestionItemWithStatisticFragment',
    QuestionFragment: 'QuestionFragment',
    QuestionWithStatisticFragment: 'QuestionWithStatisticFragment',
    AnswerFragment: 'AnswerFragment',
    QuestionOnWordRangeFragment: 'QuestionOnWordRangeFragment',
    QuestionOnWordRangesEdgeFragment: 'QuestionOnWordRangesEdgeFragment',
    SiteTextPhraseDefinitionFragment: 'SiteTextPhraseDefinitionFragment',
    SiteTextWordDefinitionFragment: 'SiteTextWordDefinitionFragment',
    SiteTextWordDefinitionEdgeFragment: 'SiteTextWordDefinitionEdgeFragment',
    SiteTextPhraseDefinitionEdgeFragment: 'SiteTextPhraseDefinitionEdgeFragment',
    SiteTextDefinitionEdgeFragment: 'SiteTextDefinitionEdgeFragment',
    SiteTextLanguageFragment: 'SiteTextLanguageFragment',
    TranslationWithVoteListByLanguageFragment: 'TranslationWithVoteListByLanguageFragment',
    SiteTextLanguageWithTranslationInfoFragment: 'SiteTextLanguageWithTranslationInfoFragment',
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