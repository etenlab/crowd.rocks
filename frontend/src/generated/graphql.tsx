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
  created_by: Scalars['String']['output'];
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

export type CreateQuestionOnWordRangeUpsertInput = {
  begin_document_word_entry_id: Scalars['ID']['input'];
  end_document_word_entry_id: Scalars['ID']['input'];
  question: Scalars['String']['input'];
  question_items: Array<Scalars['String']['input']>;
  question_type_is_multiselect: Scalars['Boolean']['input'];
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

export type DocumentUploadInput = {
  document: TextyDocumentInput;
};

export type DocumentUploadOutput = {
  __typename?: 'DocumentUploadOutput';
  document_id?: Maybe<Scalars['String']['output']>;
  error: ErrorType;
};

export type DocumentWordEntriesOutput = {
  __typename?: 'DocumentWordEntriesOutput';
  document_word_entries: Array<Maybe<DocumentWordEntry>>;
  error: ErrorType;
};

export type DocumentWordEntry = {
  __typename?: 'DocumentWordEntry';
  document_id: Scalars['String']['output'];
  document_word_entry_id: Scalars['ID']['output'];
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
  CandidateNotFound = 'CandidateNotFound',
  CandidateNotFoundInBallot = 'CandidateNotFoundInBallot',
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
  ForumUpsertFailed = 'ForumUpsertFailed',
  InvalidEmailOrPassword = 'InvalidEmailOrPassword',
  InvalidInputs = 'InvalidInputs',
  LimitInvalid = 'LimitInvalid',
  MapDeletionError = 'MapDeletionError',
  MapFilenameAlreadyExists = 'MapFilenameAlreadyExists',
  MapInsertFailed = 'MapInsertFailed',
  MapNotFound = 'MapNotFound',
  MapVoteNotFound = 'MapVoteNotFound',
  NoError = 'NoError',
  NotificationDeleteFailed = 'NotificationDeleteFailed',
  NotificationInsertFailed = 'NotificationInsertFailed',
  OffsetInvalid = 'OffsetInvalid',
  ParentElectionNotFound = 'ParentElectionNotFound',
  PasswordInvalid = 'PasswordInvalid',
  PasswordTooLong = 'PasswordTooLong',
  PasswordTooShort = 'PasswordTooShort',
  PhraseDefinitionAlreadyExists = 'PhraseDefinitionAlreadyExists',
  PhraseDefinitionNotFound = 'PhraseDefinitionNotFound',
  PhraseDefinitionVoteNotFound = 'PhraseDefinitionVoteNotFound',
  PhraseNotFound = 'PhraseNotFound',
  PhraseToPhraseTranslationNotFound = 'PhraseToPhraseTranslationNotFound',
  PhraseToWordTranslationNotFound = 'PhraseToWordTranslationNotFound',
  PhraseVoteNotFound = 'PhraseVoteNotFound',
  PositionInvalid = 'PositionInvalid',
  PostCreateFailed = 'PostCreateFailed',
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
  forum_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ForumDeleteInput = {
  forum_id: Scalars['ID']['input'];
};

export type ForumDeleteOutput = {
  __typename?: 'ForumDeleteOutput';
  error: ErrorType;
  forum_id: Scalars['ID']['output'];
};

export type ForumFolder = {
  __typename?: 'ForumFolder';
  folder_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ForumFolderDeleteInput = {
  folder_id: Scalars['ID']['input'];
};

export type ForumFolderDeleteOutput = {
  __typename?: 'ForumFolderDeleteOutput';
  error: ErrorType;
  folder_id: Scalars['ID']['output'];
};

export type ForumFolderListInput = {
  forum_id: Scalars['ID']['input'];
};

export type ForumFolderListOutput = {
  __typename?: 'ForumFolderListOutput';
  error: ErrorType;
  folders: Array<ForumFolder>;
};

export type ForumFolderReadInput = {
  folder_id: Scalars['ID']['input'];
};

export type ForumFolderReadOutput = {
  __typename?: 'ForumFolderReadOutput';
  error: ErrorType;
  folder?: Maybe<ForumFolder>;
};

export type ForumFolderUpsertInput = {
  folder_id?: InputMaybe<Scalars['ID']['input']>;
  forum_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ForumFolderUpsertOutput = {
  __typename?: 'ForumFolderUpsertOutput';
  error: ErrorType;
  folder?: Maybe<ForumFolder>;
};

export type ForumListOutput = {
  __typename?: 'ForumListOutput';
  error: ErrorType;
  forums: Array<Forum>;
};

export type ForumReadInput = {
  forum_id: Scalars['ID']['input'];
};

export type ForumReadOutput = {
  __typename?: 'ForumReadOutput';
  error: ErrorType;
  forum?: Maybe<Forum>;
};

export type ForumUpsertInput = {
  forum_id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type ForumUpsertOutput = {
  __typename?: 'ForumUpsertOutput';
  error: ErrorType;
  forum?: Maybe<Forum>;
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

export type GetAllDocumentsInput = {
  lang?: InputMaybe<LanguageInput>;
};

export type GetAllDocumentsOutput = {
  __typename?: 'GetAllDocumentsOutput';
  documents?: Maybe<Array<TextyDocument>>;
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
  lang: LanguageInput;
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
  mapFileInfo?: Maybe<MapDetailsInfo>;
};

export type MapDetailsOutputEdge = {
  __typename?: 'MapDetailsOutputEdge';
  cursor: Scalars['ID']['output'];
  node: MapDetailsOutput;
};

export type MapFileListConnection = {
  __typename?: 'MapFileListConnection';
  edges: Array<MapDetailsOutputEdge>;
  pageInfo: PageInfo;
};

export type MapUploadOutput = {
  __typename?: 'MapUploadOutput';
  error: ErrorType;
  mapFileOutput?: Maybe<MapDetailsOutput>;
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
  pageInfo: PageInfo;
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
  createQuestionOnWordRange: QuestionsOutput;
  documentUpload: DocumentUploadOutput;
  emailResponseResolver: EmailResponseOutput;
  forumDelete: ForumDeleteOutput;
  forumFolderDelete: ForumFolderDeleteOutput;
  forumFolderUpsert: ForumFolderUpsertOutput;
  forumUpsert: ForumUpsertOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  mapDelete: MapDeleteOutput;
  mapUpload: MapUploadOutput;
  mapVoteUpsert: MapVoteOutput;
  mapsReTranslate: GenericOutput;
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
  siteTextTranslationVoteUpsert: SiteTextTranslationVoteOutput;
  siteTextUpsert: SiteTextDefinitionOutput;
  siteTextWordDefinitionUpsert: SiteTextWordDefinitionOutput;
  stopGoogleTranslation: GenericOutput;
  stopLiltTranslation: GenericOutput;
  threadDelete: ThreadDeleteOutput;
  threadUpsert: ThreadUpsertOutput;
  toggleFlagWithRef: FlagsOutput;
  toggleMapVoteStatus: MapVoteStatusOutputRow;
  togglePhraseDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  togglePhraseToPhraseTrVoteStatus: PhraseToPhraseTranslationVoteStatusOutputRow;
  togglePhraseToWordTrVoteStatus: PhraseToWordTranslationVoteStatusOutputRow;
  togglePhraseVoteStatus: PhraseVoteStatusOutputRow;
  toggleSiteTextTranslationVoteStatus: SiteTextTranslationVoteStatusOutputRow;
  toggleTranslationVoteStatus: TranslationVoteStatusOutputRow;
  toggleWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  toggleWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  toggleWordVoteStatus: WordVoteStatusOutputRow;
  translateAllWordsAndPhrasesByGoogle: GenericOutput;
  translateAllWordsAndPhrasesByLilt: GenericOutput;
  translateMissingWordsAndPhrasesByGoogle: TranslateAllWordsAndPhrasesByGoogleOutput;
  translateWordsAndPhrasesByGoogle: TranslateAllWordsAndPhrasesByGoogleOutput;
  translateWordsAndPhrasesByLilt: TranslateAllWordsAndPhrasesByBotOutput;
  updateDefinition: PhraseDefinitionOutput;
  updateFile: IFileOutput;
  uploadFile: IFileOutput;
  upsertAnswers: AnswersOutput;
  upsertFromTranslationlikeString: TranslationOutput;
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


export type MutationForumDeleteArgs = {
  input: ForumDeleteInput;
};


export type MutationForumFolderDeleteArgs = {
  input: ForumFolderDeleteInput;
};


export type MutationForumFolderUpsertArgs = {
  input: ForumFolderUpsertInput;
};


export type MutationForumUpsertArgs = {
  input: ForumUpsertInput;
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


export type MutationThreadDeleteArgs = {
  input: ThreadDeleteInput;
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


export type MutationToggleWordVoteStatusArgs = {
  vote: Scalars['Boolean']['input'];
  word_id: Scalars['ID']['input'];
};


export type MutationTranslateAllWordsAndPhrasesByGoogleArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateAllWordsAndPhrasesByLiltArgs = {
  from_language: LanguageInput;
};


export type MutationTranslateMissingWordsAndPhrasesByGoogleArgs = {
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
  input: Array<WordRangeUpsertInput>;
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
  created_at: Scalars['String']['output'];
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
  forumFolderRead: ForumFolderReadOutput;
  forumFolders: ForumFolderListOutput;
  forumRead: ForumReadOutput;
  forums: ForumListOutput;
  getAllDocuments: GetAllDocumentsOutput;
  getAllMapsList: MapFileListConnection;
  getAllRecommendedSiteTextTranslationList: SiteTextTranslationWithVoteListByLanguageListOutput;
  getAllRecommendedSiteTextTranslationListByLanguage: SiteTextTranslationWithVoteListByLanguageOutput;
  getAllSiteTextDefinitions: SiteTextDefinitionListOutput;
  getAllSiteTextLanguageList: SiteTextLanguageListOutput;
  getAllSiteTextLanguageListWithRate: SiteTextLanguageWithTranslationInfoListOutput;
  getAllTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteListOutput;
  getAnswersByQuestionIds: AnswersOutput;
  getDocument: GetDocumentOutput;
  getDocumentWordEntriesByDocumentId: DocumentWordEntriesOutput;
  getFlagsFromRef: FlagsOutput;
  getLanguageTranslationInfo: TranslatedLanguageInfoOutput;
  getMapDetails: MapDetailsOutput;
  getMapVoteStatus: MapVoteStatusOutputRow;
  getMapWordOrPhraseAsOrigByDefinitionId: MapWordOrPhraseAsOrigOutput;
  getOrigMapWordsAndPhrases: MapWordsAndPhrasesConnection;
  getOrigMapsList: GetOrigMapsListOutput;
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
  getQuestionOnWordRangesByDocumentId: QuestionOnWordRangesOutput;
  getQuestionsByRefs: QuestionsOutput;
  getRecommendedTranslationFromDefinitionID: TranslationWithVoteOutput;
  getRecommendedTranslationFromSiteTextDefinitionID: SiteTextTranslationWithVoteOutput;
  getSiteTextTranslationVoteStatus: SiteTextTranslationVoteStatusOutputRow;
  getTranslationsByFromDefinitionId: TranslationWithVoteListOutput;
  getWordDefinitionVoteStatus: DefinitionVoteStatusOutputRow;
  getWordDefinitionsByFlag: WordDefinitionListConnection;
  getWordDefinitionsByLanguage: WordDefinitionWithVoteListOutput;
  getWordDefinitionsByWordId: WordDefinitionWithVoteListOutput;
  getWordRangesByBeginIds: WordRangesOutput;
  getWordRangesByDocumentId: WordRangesOutput;
  getWordToPhraseTrVoteStatus: WordToPhraseTranslationVoteStatusOutputRow;
  getWordToPhraseTranslationsByFromWordDefinitionId: WordToPhraseTranslationWithVoteListOutput;
  getWordToWordTrVoteStatus: WordTrVoteStatusOutputRow;
  getWordToWordTranslationsByFromWordDefinitionId: WordToWordTranslationWithVoteListOutput;
  getWordVoteStatus: WordVoteStatusOutputRow;
  getWordWithVoteById: WordWithVoteOutput;
  getWordsByLanguage: WordWithVoteListConnection;
  languagesForGoogleTranslate: LanguageListForBotTranslateOutput;
  languagesForLiltTranslate: LanguageListForBotTranslateOutput;
  loggedInIsAdmin: IsAdminIdOutput;
  notifications: NotificationListOutput;
  phraseDefinitionRead: PhraseDefinitionOutput;
  phraseRead: PhraseOutput;
  phraseToPhraseTranslationRead: PhraseToPhraseTranslationOutput;
  phraseVoteRead: PhraseVoteOutput;
  postReadResolver: PostReadOutput;
  postsByParent: PostsByParentOutput;
  readAnswers: AnswersOutput;
  readQuestionItems: QuestionItemsOutput;
  readQuestions: QuestionsOutput;
  readWordRanges: WordRangesOutput;
  siteTextPhraseDefinitionRead: SiteTextPhraseDefinitionOutput;
  siteTextTranslationVoteRead: SiteTextTranslationVoteOutput;
  siteTextWordDefinitionRead: SiteTextWordDefinitionOutput;
  threadRead: ThreadReadOutput;
  threads: ThreadListOutput;
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
  input: ForumFolderReadInput;
};


export type QueryForumFoldersArgs = {
  input: ForumFolderListInput;
};


export type QueryForumReadArgs = {
  input: ForumReadInput;
};


export type QueryGetAllDocumentsArgs = {
  input: GetAllDocumentsInput;
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
  filter?: InputMaybe<Scalars['String']['input']>;
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


export type QueryGetDocumentWordEntriesByDocumentIdArgs = {
  document_id: Scalars['ID']['input'];
};


export type QueryGetFlagsFromRefArgs = {
  parent_id: Scalars['String']['input'];
  parent_table: TableNameType;
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


export type QueryGetOrigMapsListArgs = {
  input: GetOrigMapListInput;
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
  document_id: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
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


export type QuerySiteTextTranslationVoteReadArgs = {
  id: Scalars['String']['input'];
};


export type QuerySiteTextWordDefinitionReadArgs = {
  id: Scalars['String']['input'];
};


export type QueryThreadReadArgs = {
  input: ThreadReadInput;
};


export type QueryThreadsArgs = {
  input: ThreadListInput;
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
  created_by: Scalars['String']['output'];
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

export type QuestionItemsOutput = {
  __typename?: 'QuestionItemsOutput';
  error: ErrorType;
  question_items: Array<Maybe<QuestionItem>>;
};

export type QuestionOnWordRange = {
  __typename?: 'QuestionOnWordRange';
  begin: DocumentWordEntry;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  end: DocumentWordEntry;
  parent_id: Scalars['String']['output'];
  parent_table: TableNameType;
  question: Scalars['String']['output'];
  question_id: Scalars['ID']['output'];
  question_items: Array<QuestionItem>;
  question_type_is_multiselect: Scalars['Boolean']['output'];
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

export type SiteTextDefinitionListOutput = {
  __typename?: 'SiteTextDefinitionListOutput';
  error: ErrorType;
  site_text_definition_list: Array<Maybe<SiteTextDefinition>>;
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
  site_text_translation_with_vote_list: Array<Maybe<SiteTextTranslationWithVote>>;
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

export type Subscription = {
  __typename?: 'Subscription';
  TranslationReport: TranslateAllWordsAndPhrasesByBotResult;
};

export enum TableNameType {
  DocumentWordEntries = 'document_word_entries',
  Documents = 'documents',
  OriginalMaps = 'original_maps',
  PhraseDefinitions = 'phrase_definitions',
  Phrases = 'phrases',
  TranslatedMaps = 'translated_maps',
  WordDefinitions = 'word_definitions',
  WordRanges = 'word_ranges',
  Words = 'words'
}

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
  name: Scalars['String']['output'];
  thread_id: Scalars['ID']['output'];
};

export type ThreadDeleteInput = {
  thread_id: Scalars['ID']['input'];
};

export type ThreadDeleteOutput = {
  __typename?: 'ThreadDeleteOutput';
  error: ErrorType;
  thread_id: Scalars['ID']['output'];
};

export type ThreadListInput = {
  folder_id: Scalars['ID']['input'];
};

export type ThreadListOutput = {
  __typename?: 'ThreadListOutput';
  error: ErrorType;
  threads: Array<Thread>;
};

export type ThreadReadInput = {
  thread_id: Scalars['ID']['input'];
};

export type ThreadReadOutput = {
  __typename?: 'ThreadReadOutput';
  error: ErrorType;
  thread?: Maybe<Thread>;
};

export type ThreadUpsertInput = {
  folder_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  thread_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ThreadUpsertOutput = {
  __typename?: 'ThreadUpsertOutput';
  error: ErrorType;
  thread?: Maybe<Thread>;
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

export type TranslateAllWordsAndPhrasesByGoogleOutput = {
  __typename?: 'TranslateAllWordsAndPhrasesByGoogleOutput';
  error: ErrorType;
  result?: Maybe<TranslateAllWordsAndPhrasesByBotResult>;
};

export type TranslatedLanguageInfoInput = {
  fromLanguageCode: Scalars['ID']['input'];
  toLanguageCode?: InputMaybe<Scalars['ID']['input']>;
};

export type TranslatedLanguageInfoOutput = {
  __typename?: 'TranslatedLanguageInfoOutput';
  error: ErrorType;
  googleTranslateTotalLangCount: Scalars['Int']['output'];
  liltTranslateTotalLangCount: Scalars['Int']['output'];
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
  dialect_code?: Maybe<Scalars['String']['output']>;
  geo_code?: Maybe<Scalars['String']['output']>;
  language_code: Scalars['String']['output'];
  word: Scalars['String']['output'];
  word_id: Scalars['ID']['output'];
};

export type WordDefinition = {
  __typename?: 'WordDefinition';
  created_at: Scalars['String']['output'];
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

export type WordRangeUpsertInput = {
  begin_document_word_entry_id: Scalars['String']['input'];
  end_document_word_entry_id: Scalars['String']['input'];
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

export type UserFieldsFragment = { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null };

export type PostFieldsFragment = { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null } };

export type PostsByParentQueryVariables = Exact<{
  parent_id: Scalars['ID']['input'];
  parent_name: Scalars['String']['input'];
}>;


export type PostsByParentQuery = { __typename?: 'Query', postsByParent: { __typename?: 'PostsByParentOutput', error: ErrorType, title: string, posts?: Array<{ __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null } }> | null } };

export type PostCreateMutationVariables = Exact<{
  content: Scalars['String']['input'];
  parentId: Scalars['Int']['input'];
  parentTable: Scalars['String']['input'];
  file_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type PostCreateMutation = { __typename?: 'Mutation', postCreateResolver: { __typename?: 'PostCreateOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null } } | null } };

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

export type WordlikeStringFragmentFragment = { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string };

export type WordFragmentFragment = { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type WordDefinitionFragmentFragment = { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type WordWithDefinitionsFragmentFragment = { __typename?: 'WordWithDefinitions', word_id: string, word: string, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> };

export type WordDefinitionWithVoteFragmentFragment = { __typename?: 'WordDefinitionWithVote', word_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type WordWithVoteFragmentFragment = { __typename?: 'WordWithVote', dialect_code?: string | null, downvotes: number, geo_code?: string | null, language_code: string, upvotes: number, word: string, word_id: string };

export type DefinitionVoteStatusFragmentFragment = { __typename?: 'DefinitionVoteStatus', definition_id: string, downvotes: number, upvotes: number };

export type WordVoteStatusFragmentFragment = { __typename?: 'WordVoteStatus', word_id: string, downvotes: number, upvotes: number };

export type WordWithVoteListEdgeFragmentFragment = { __typename?: 'WordWithVoteListEdge', cursor: string, node: { __typename?: 'WordWithDefinitions', word_id: string, word: string, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } };

export type PageInfoFragmentFragment = { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null };

export type WordDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WordDefinitionReadQuery = { __typename?: 'Query', wordDefinitionRead: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type GetWordsByLanguageQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWordsByLanguageQuery = { __typename?: 'Query', getWordsByLanguage: { __typename?: 'WordWithVoteListConnection', error: ErrorType, edges: Array<{ __typename?: 'WordWithVoteListEdge', cursor: string, node: { __typename?: 'WordWithDefinitions', word_id: string, word: string, downvotes: number, upvotes: number, language_code: string, dialect_code?: string | null, geo_code?: string | null, definitions: Array<{ __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

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


export type WordDefinitionUpsertMutation = { __typename?: 'Mutation', wordDefinitionUpsert: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

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


export type WordUpsertMutation = { __typename?: 'Mutation', wordUpsert: { __typename?: 'WordOutput', error: ErrorType, word?: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type TextyDocumentFragmentFragment = { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type DocumentWordEntryFragmentFragment = { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } };

export type WordRangeFragmentFragment = { __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } };

export type DocumentUploadMutationVariables = Exact<{
  document: TextyDocumentInput;
}>;


export type DocumentUploadMutation = { __typename?: 'Mutation', documentUpload: { __typename?: 'DocumentUploadOutput', error: ErrorType, document_id?: string | null } };

export type GetAllDocumentsQueryVariables = Exact<{
  languageInput?: InputMaybe<LanguageInput>;
}>;


export type GetAllDocumentsQuery = { __typename?: 'Query', getAllDocuments: { __typename?: 'GetAllDocumentsOutput', documents?: Array<{ __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null }> | null } };

export type GetDocumentQueryVariables = Exact<{
  document_id: Scalars['String']['input'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', getDocument: { __typename?: 'GetDocumentOutput', document?: { __typename?: 'TextyDocument', document_id: string, file_id: string, file_name: string, file_url: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

export type GetDocumentWordEntriesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
}>;


export type GetDocumentWordEntriesByDocumentIdQuery = { __typename?: 'Query', getDocumentWordEntriesByDocumentId: { __typename?: 'DocumentWordEntriesOutput', error: ErrorType, document_word_entries: Array<{ __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } | null> } };

export type GetWordRangesByDocumentIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWordRangesByDocumentIdQuery = { __typename?: 'Query', getWordRangesByDocumentId: { __typename?: 'WordRangesOutput', error: ErrorType, word_ranges: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

export type UpsertWordRangeMutationVariables = Exact<{
  begin_document_word_entry_id: Scalars['String']['input'];
  end_document_word_entry_id: Scalars['String']['input'];
}>;


export type UpsertWordRangeMutation = { __typename?: 'Mutation', upsertWordRanges: { __typename?: 'WordRangesOutput', error: ErrorType, word_ranges: Array<{ __typename?: 'WordRange', word_range_id: string, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

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

export type WordDefinitionListEdgeFragmentFragment = { __typename?: 'WordDefinitionListEdge', cursor: string, node: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseDefinitionListEdgeFragmentFragment = { __typename?: 'PhraseDefinitionListEdge', cursor: string, node: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

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


export type GetWordDefinitionsByFlagQuery = { __typename?: 'Query', getWordDefinitionsByFlag: { __typename?: 'WordDefinitionListConnection', error: ErrorType, edges: Array<{ __typename?: 'WordDefinitionListEdge', cursor: string, node: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type GetPhraseDefinitionsByFlagQueryVariables = Exact<{
  flag_name: FlagType;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetPhraseDefinitionsByFlagQuery = { __typename?: 'Query', getPhraseDefinitionsByFlag: { __typename?: 'PhraseDefinitionListConnection', error: ErrorType, edges: Array<{ __typename?: 'PhraseDefinitionListEdge', cursor: string, node: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type ToggleFlagWithRefMutationVariables = Exact<{
  parent_table: TableNameType;
  parent_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type ToggleFlagWithRefMutation = { __typename?: 'Mutation', toggleFlagWithRef: { __typename?: 'FlagsOutput', error: ErrorType, flags: Array<{ __typename?: 'Flag', flag_id: string, parent_table: string, parent_id: string, name: FlagType, created_at: string, created_by: string }> } };

export type CreateThreadMutationVariables = Exact<{
  name: Scalars['String']['input'];
  folder_id: Scalars['ID']['input'];
}>;


export type CreateThreadMutation = { __typename?: 'Mutation', threadUpsert: { __typename?: 'ThreadUpsertOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, name: string } | null } };

export type GetThreadByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetThreadByIdQuery = { __typename?: 'Query', threadRead: { __typename?: 'ThreadReadOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, name: string } | null } };

export type GetThreadsQueryVariables = Exact<{
  folder_id: Scalars['ID']['input'];
}>;


export type GetThreadsQuery = { __typename?: 'Query', threads: { __typename?: 'ThreadListOutput', error: ErrorType, threads: Array<{ __typename: 'Thread', thread_id: string, name: string }> } };

export type UpdateThreadMutationVariables = Exact<{
  thread_id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  folder_id: Scalars['ID']['input'];
}>;


export type UpdateThreadMutation = { __typename?: 'Mutation', threadUpsert: { __typename?: 'ThreadUpsertOutput', error: ErrorType, thread?: { __typename?: 'Thread', thread_id: string, name: string } | null } };

export type DeleteThreadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteThreadMutation = { __typename?: 'Mutation', threadDelete: { __typename?: 'ThreadDeleteOutput', error: ErrorType, thread_id: string } };

export type ForumFolderFragmentFragment = { __typename?: 'ForumFolder', folder_id: string, name: string };

export type CreateForumFolderMutationVariables = Exact<{
  name: Scalars['String']['input'];
  forum_id: Scalars['ID']['input'];
}>;


export type CreateForumFolderMutation = { __typename?: 'Mutation', forumFolderUpsert: { __typename?: 'ForumFolderUpsertOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', folder_id: string, name: string } | null } };

export type GetForumFolderByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetForumFolderByIdQuery = { __typename?: 'Query', forumFolderRead: { __typename?: 'ForumFolderReadOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', folder_id: string, name: string } | null } };

export type GetForumFoldersQueryVariables = Exact<{
  forum_id: Scalars['ID']['input'];
}>;


export type GetForumFoldersQuery = { __typename?: 'Query', forumFolders: { __typename?: 'ForumFolderListOutput', error: ErrorType, folders: Array<{ __typename?: 'ForumFolder', folder_id: string, name: string }> } };

export type UpdateForumFolderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  forum_id: Scalars['ID']['input'];
}>;


export type UpdateForumFolderMutation = { __typename?: 'Mutation', forumFolderUpsert: { __typename?: 'ForumFolderUpsertOutput', error: ErrorType, folder?: { __typename?: 'ForumFolder', folder_id: string, name: string } | null } };

export type DeleteForumFolderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteForumFolderMutation = { __typename?: 'Mutation', forumFolderDelete: { __typename?: 'ForumFolderDeleteOutput', error: ErrorType, folder_id: string } };

export type ForumFragmentFragment = { __typename?: 'Forum', forum_id: string, name: string };

export type CreateForumMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateForumMutation = { __typename?: 'Mutation', forumUpsert: { __typename?: 'ForumUpsertOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string } | null } };

export type GetForumByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetForumByIdQuery = { __typename?: 'Query', forumRead: { __typename?: 'ForumReadOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string } | null } };

export type GetForumsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetForumsQuery = { __typename?: 'Query', forums: { __typename?: 'ForumListOutput', error: ErrorType, forums: Array<{ __typename?: 'Forum', forum_id: string, name: string }> } };

export type UpdateForumMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
}>;


export type UpdateForumMutation = { __typename?: 'Mutation', forumUpsert: { __typename?: 'ForumUpsertOutput', error: ErrorType, forum?: { __typename?: 'Forum', forum_id: string, name: string } | null } };

export type DeleteForumMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteForumMutation = { __typename?: 'Mutation', forumDelete: { __typename?: 'ForumDeleteOutput', error: ErrorType, forum_id: string } };

export type MapDetailsOutputFragmentFragment = { __typename?: 'MapDetailsOutput', error: ErrorType, mapFileInfo?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null };

export type MapDetailsOutputEdgeFragmentFragment = { __typename?: 'MapDetailsOutputEdge', cursor: string, node: { __typename?: 'MapDetailsOutput', error: ErrorType, mapFileInfo?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type MapWordOrPhraseFragmentFragment = { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null };

export type MapWordsAndPhrasesEdgeFragmentFragment = { __typename?: 'MapWordsAndPhrasesEdge', cursor: string, node: { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null } };

export type WordWithDefinitionFragmentFragment = { __typename?: 'WordWithDefinition', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null };

export type PhraseWithDefinitionFragmentFragment = { __typename?: 'PhraseWithDefinition', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null };

export type GetOrigMapWordsAndPhrasesQueryVariables = Exact<{
  lang: LanguageInput;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOrigMapWordsAndPhrasesQuery = { __typename?: 'Query', getOrigMapWordsAndPhrases: { __typename?: 'MapWordsAndPhrasesConnection', edges: Array<{ __typename?: 'MapWordsAndPhrasesEdge', cursor: string, node: { __typename?: 'MapWordOrPhrase', id: string, type: string, o_id: string, o_like_string: string, o_definition: string, o_definition_id: string, o_language_code: string, o_dialect_code?: string | null, o_geo_code?: string | null } }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetMapWordOrPhraseAsOrigByDefinitionIdQueryVariables = Exact<{
  definition_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
}>;


export type GetMapWordOrPhraseAsOrigByDefinitionIdQuery = { __typename?: 'Query', getMapWordOrPhraseAsOrigByDefinitionId: { __typename?: 'MapWordOrPhraseAsOrigOutput', error: ErrorType, wordOrPhrase?: { __typename?: 'PhraseWithDefinition', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null } | { __typename?: 'WordWithDefinition', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, definition?: string | null, definition_id?: string | null } | null } };

export type GetAllMapsListQueryVariables = Exact<{
  lang?: InputMaybe<LanguageInput>;
  after?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllMapsListQuery = { __typename?: 'Query', getAllMapsList: { __typename?: 'MapFileListConnection', edges: Array<{ __typename?: 'MapDetailsOutputEdge', cursor: string, node: { __typename?: 'MapDetailsOutput', error: ErrorType, mapFileInfo?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type GetMapDetailsQueryVariables = Exact<{
  map_id: Scalars['ID']['input'];
  is_original: Scalars['Boolean']['input'];
}>;


export type GetMapDetailsQuery = { __typename?: 'Query', getMapDetails: { __typename?: 'MapDetailsOutput', error: ErrorType, mapFileInfo?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type IsAdminLoggedInQueryVariables = Exact<{
  input: IsAdminIdInput;
}>;


export type IsAdminLoggedInQuery = { __typename?: 'Query', loggedInIsAdmin: { __typename?: 'IsAdminIdOutput', isAdmin: boolean } };

export type MapUploadMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  previewFileId?: InputMaybe<Scalars['String']['input']>;
  file_type: Scalars['String']['input'];
  file_size: Scalars['Int']['input'];
}>;


export type MapUploadMutation = { __typename?: 'Mutation', mapUpload: { __typename?: 'MapUploadOutput', error: ErrorType, mapFileOutput?: { __typename?: 'MapDetailsOutput', error: ErrorType, mapFileInfo?: { __typename?: 'MapDetailsInfo', is_original: boolean, original_map_id: string, translated_map_id?: string | null, map_file_name: string, translated_percent?: string | null, created_at: string, created_by: string, map_file_name_with_langs: string, preview_file_url?: string | null, content_file_url: string, content_file_id: string, language: { __typename?: 'LanguageOutput', language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } | null } };

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

export type PhraseFragmentFragment = { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type PhraseDefinitionFragmentFragment = { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type PhraseWithDefinitionsFragmentFragment = { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> };

export type PhraseDefinitionWithVoteFragmentFragment = { __typename?: 'PhraseDefinitionWithVote', phrase_definition_id: string, definition: string, downvotes: number, upvotes: number, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } };

export type PhraseWithVoteFragmentFragment = { __typename?: 'PhraseWithVote', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number };

export type PhraseVoteStatusFragmentFragment = { __typename?: 'PhraseVoteStatus', downvotes: number, phrase_id: string, upvotes: number };

export type PhraseWithVoteListEdgeFragmentFragment = { __typename?: 'PhraseWithVoteListEdge', cursor: string, node: { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } };

export type PhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PhraseDefinitionReadQuery = { __typename?: 'Query', phraseDefinitionRead: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type GetPhrasesByLanguageQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['ID']['input']>;
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPhrasesByLanguageQuery = { __typename?: 'Query', getPhrasesByLanguage: { __typename?: 'PhraseWithVoteListConnection', error: ErrorType, edges: Array<{ __typename?: 'PhraseWithVoteListEdge', cursor: string, node: { __typename?: 'PhraseWithDefinitions', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null, downvotes: number, upvotes: number, definitions: Array<{ __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

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


export type PhraseDefinitionUpsertMutation = { __typename?: 'Mutation', phraseDefinitionUpsert: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

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


export type PhraseUpsertMutation = { __typename?: 'Mutation', phraseUpsert: { __typename?: 'PhraseOutput', error: ErrorType, phrase?: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } | null } };

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


export type PostReadQuery = { __typename?: 'Query', postReadResolver: { __typename?: 'PostReadOutput', error: ErrorType, post?: { __typename?: 'Post', post_id: string, content: string, created_at: any, file_url?: string | null, file_type?: string | null, created_by_user: { __typename?: 'User', user_id: string, avatar: string, avatar_url?: string | null } } | null } };

export type QuestionItemFragmentFragment = { __typename?: 'QuestionItem', question_item_id: string, item: string };

export type QuestionFragmentFragment = { __typename?: 'Question', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }> };

export type AnswerFragmentFragment = { __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }> };

export type QuestionOnWordRangeFragmentFragment = { __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } };

export type GetQuestionOnWordRangesByDocumentIdQueryVariables = Exact<{
  document_id: Scalars['ID']['input'];
}>;


export type GetQuestionOnWordRangesByDocumentIdQuery = { __typename?: 'Query', getQuestionOnWordRangesByDocumentId: { __typename?: 'QuestionOnWordRangesOutput', error: ErrorType, questions: Array<{ __typename?: 'QuestionOnWordRange', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }>, begin: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } }, end: { __typename?: 'DocumentWordEntry', document_word_entry_id: string, document_id: string, parent_document_word_entry_id?: string | null, wordlike_string: { __typename?: 'WordlikeString', wordlike_string_id: string, wordlike_string: string } } } | null> } };

export type GetAnswersByQuestionIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAnswersByQuestionIdQuery = { __typename?: 'Query', getAnswersByQuestionIds: { __typename?: 'AnswersOutput', error: ErrorType, answers: Array<{ __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }> } | null> } };

export type CreateQuestionOnWordRangeMutationVariables = Exact<{
  begin_document_word_entry_id: Scalars['ID']['input'];
  end_document_word_entry_id: Scalars['ID']['input'];
  question: Scalars['String']['input'];
  question_items: Array<Scalars['String']['input']> | Scalars['String']['input'];
  question_type_is_multiselect: Scalars['Boolean']['input'];
}>;


export type CreateQuestionOnWordRangeMutation = { __typename?: 'Mutation', createQuestionOnWordRange: { __typename?: 'QuestionsOutput', error: ErrorType, questions: Array<{ __typename?: 'Question', question_id: string, parent_table: TableNameType, parent_id: string, question: string, question_type_is_multiselect: boolean, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }> } | null> } };

export type UpsertAnswerMutationVariables = Exact<{
  answer: Scalars['String']['input'];
  question_id: Scalars['ID']['input'];
  question_item_ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type UpsertAnswerMutation = { __typename?: 'Mutation', upsertAnswers: { __typename?: 'AnswersOutput', error: ErrorType, answers: Array<{ __typename?: 'Answer', answer_id: string, question_id: string, answer?: string | null, created_by: string, created_at: any, question_items: Array<{ __typename?: 'QuestionItem', question_item_id: string, item: string }> } | null> } };

export type SiteTextWordToWordTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextWordToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseToWordTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextPhraseDefinitionFragmentFragment = { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextWordDefinitionFragmentFragment = { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type SiteTextTranslationVoteStatusFragmentFragment = { __typename?: 'SiteTextTranslationVoteStatus', translation_id: string, from_type_is_word: boolean, to_type_is_word: boolean, downvotes: number, upvotes: number };

export type SiteTextLanguageFragmentFragment = { __typename?: 'SiteTextLanguage', language_code: string, dialect_code?: string | null, geo_code?: string | null };

export type SiteTextTranslationWithVoteListByLanguageFragmentFragment = { __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> };

export type SiteTextLanguageWithTranslationInfoFragmentFragment = { __typename?: 'SiteTextLanguageWithTranslationInfo', language_code: string, dialect_code?: string | null, geo_code?: string | null, total_count: number, translated_count: number };

export type GetAllSiteTextDefinitionsQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllSiteTextDefinitionsQuery = { __typename?: 'Query', getAllSiteTextDefinitions: { __typename?: 'SiteTextDefinitionListOutput', error: ErrorType, site_text_definition_list: Array<{ __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } };

export type GetAllTranslationFromSiteTextDefinitionIdQueryVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  site_text_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getAllTranslationFromSiteTextDefinitionID: { __typename?: 'SiteTextTranslationWithVoteListOutput', error: ErrorType, site_text_translation_with_vote_list: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } };

export type SiteTextWordDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextWordDefinitionReadQuery = { __typename?: 'Query', siteTextWordDefinitionRead: { __typename?: 'SiteTextWordDefinitionOutput', error: ErrorType, site_text_word_definition?: { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type SiteTextPhraseDefinitionReadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SiteTextPhraseDefinitionReadQuery = { __typename?: 'Query', siteTextPhraseDefinitionRead: { __typename?: 'SiteTextPhraseDefinitionOutput', error: ErrorType, site_text_phrase_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type UpsertSiteTextTranslationMutationVariables = Exact<{
  site_text_id: Scalars['ID']['input'];
  is_word_definition: Scalars['Boolean']['input'];
  translationlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertSiteTextTranslationMutation = { __typename?: 'Mutation', upsertSiteTextTranslation: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

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


export type GetRecommendedTranslationFromSiteTextDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromSiteTextDefinitionID: { __typename?: 'SiteTextTranslationWithVoteOutput', error: ErrorType, site_text_translation_with_vote?: { __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type GetAllRecommendedSiteTextTranslationListByLanguageQueryVariables = Exact<{
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllRecommendedSiteTextTranslationListByLanguageQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationListByLanguage: { __typename?: 'SiteTextTranslationWithVoteListByLanguageOutput', error: ErrorType, site_text_translation_with_vote_list_by_language: { __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } } };

export type GetAllRecommendedSiteTextTranslationListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRecommendedSiteTextTranslationListQuery = { __typename?: 'Query', getAllRecommendedSiteTextTranslationList: { __typename?: 'SiteTextTranslationWithVoteListByLanguageListOutput', error: ErrorType, site_text_translation_with_vote_list_by_language_list?: Array<{ __typename?: 'SiteTextTranslationWithVoteListByLanguage', dialect_code?: string | null, geo_code?: string | null, language_code: string, site_text_translation_with_vote_list: Array<{ __typename?: 'SiteTextPhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextPhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> }> | null } };

export type GetAllSiteTextLanguageListWithRateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSiteTextLanguageListWithRateQuery = { __typename?: 'Query', getAllSiteTextLanguageListWithRate: { __typename?: 'SiteTextLanguageWithTranslationInfoListOutput', error: ErrorType, site_text_language_with_translation_info_list: Array<{ __typename?: 'SiteTextLanguageWithTranslationInfo', language_code: string, dialect_code?: string | null, geo_code?: string | null, total_count: number, translated_count: number } | null> } };

export type SiteTextUpsertMutationVariables = Exact<{
  siteTextlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type SiteTextUpsertMutation = { __typename?: 'Mutation', siteTextUpsert: { __typename?: 'SiteTextDefinitionOutput', error: ErrorType, site_text_definition?: { __typename?: 'SiteTextPhraseDefinition', site_text_id: string, phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'SiteTextWordDefinition', site_text_id: string, word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type WordToWordTranslationWithVoteFragmentFragment = { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToWordTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToPhraseTranslationWithVoteFragmentFragment = { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToWordTranslationFragmentFragment = { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordToPhraseTranslationFragmentFragment = { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToWordTranslationFragmentFragment = { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type PhraseToPhraseTranslationFragmentFragment = { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } };

export type WordTrVoteStatusFragmentFragment = { __typename?: 'WordTrVoteStatus', word_to_word_translation_id: string, upvotes: number, downvotes: number };

export type WordToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'WordToPhraseTranslationVoteStatus', word_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToWordTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToWordTranslationVoteStatus', phrase_to_word_translation_id: string, upvotes: number, downvotes: number };

export type PhraseToPhraseTranslationVoteStatusFragmentFragment = { __typename?: 'PhraseToPhraseTranslationVoteStatus', phrase_to_phrase_translation_id: string, upvotes: number, downvotes: number };

export type GetTranslationLanguageInfoQueryVariables = Exact<{
  from_language_code: Scalars['ID']['input'];
  to_language_code?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetTranslationLanguageInfoQuery = { __typename?: 'Query', getLanguageTranslationInfo: { __typename?: 'TranslatedLanguageInfoOutput', error: ErrorType, googleTranslateTotalLangCount: number, liltTranslateTotalLangCount: number, totalPhraseCount: number, totalWordCount: number, translatedMissingPhraseCount?: number | null, translatedMissingWordCount?: number | null } };

export type GetTranslationsByFromDefinitionIdQueryVariables = Exact<{
  definition_id: Scalars['ID']['input'];
  from_definition_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTranslationsByFromDefinitionIdQuery = { __typename?: 'Query', getTranslationsByFromDefinitionId: { __typename?: 'TranslationWithVoteListOutput', error: ErrorType, translation_with_vote_list: Array<{ __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null> } };

export type GetRecommendedTranslationFromDefinitionIdQueryVariables = Exact<{
  from_definition_id: Scalars['ID']['input'];
  from_type_is_word: Scalars['Boolean']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRecommendedTranslationFromDefinitionIdQuery = { __typename?: 'Query', getRecommendedTranslationFromDefinitionID: { __typename?: 'TranslationWithVoteOutput', error: ErrorType, translation_with_vote?: { __typename?: 'PhraseToPhraseTranslationWithVote', phrase_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslationWithVote', phrase_to_word_translation_id: string, downvotes: number, upvotes: number, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslationWithVote', word_to_phrase_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslationWithVote', word_to_word_translation_id: string, downvotes: number, upvotes: number, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type LanguagesForGoogleTranslateQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesForGoogleTranslateQuery = { __typename?: 'Query', languagesForGoogleTranslate: { __typename?: 'LanguageListForBotTranslateOutput', error: ErrorType, languages?: Array<{ __typename?: 'LanguageForBotTranslate', code: string, name: string }> | null } };

export type LanguagesForLiltTranslateQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesForLiltTranslateQuery = { __typename?: 'Query', languagesForLiltTranslate: { __typename?: 'LanguageListForBotTranslateOutput', error: ErrorType, languages?: Array<{ __typename?: 'LanguageForBotTranslate', code: string, name: string }> | null } };

export type TranslateWordsAndPhrasesByGoogleMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByGoogleMutation = { __typename?: 'Mutation', translateWordsAndPhrasesByGoogle: { __typename?: 'TranslateAllWordsAndPhrasesByGoogleOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

export type TranslateWordsAndPhrasesByLiltMutationVariables = Exact<{
  from_language_code: Scalars['String']['input'];
  from_dialect_code?: InputMaybe<Scalars['String']['input']>;
  from_geo_code?: InputMaybe<Scalars['String']['input']>;
  to_language_code: Scalars['String']['input'];
  to_dialect_code?: InputMaybe<Scalars['String']['input']>;
  to_geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type TranslateWordsAndPhrasesByLiltMutation = { __typename?: 'Mutation', translateWordsAndPhrasesByLilt: { __typename?: 'TranslateAllWordsAndPhrasesByBotOutput', error: ErrorType, result?: { __typename?: 'TranslateAllWordsAndPhrasesByBotResult', requestedCharacters: number, totalPhraseCount: number, totalWordCount: number, translatedPhraseCount: number, translatedWordCount: number } | null } };

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

export type StopGoogleTranslationMutationVariables = Exact<{ [key: string]: never; }>;


export type StopGoogleTranslationMutation = { __typename?: 'Mutation', stopGoogleTranslation: { __typename?: 'GenericOutput', error: ErrorType } };

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


export type UpsertTranslationMutation = { __typename?: 'Mutation', upsertTranslation: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

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


export type UpsertTranslationFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertTranslationFromWordAndDefinitionlikeString: { __typename?: 'TranslationOutput', error: ErrorType, translation?: { __typename?: 'PhraseToPhraseTranslation', phrase_to_phrase_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'PhraseToWordTranslation', phrase_to_word_translation_id: string, from_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToPhraseTranslation', word_to_phrase_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_phrase_definition: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | { __typename?: 'WordToWordTranslation', word_to_word_translation_id: string, from_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } }, to_word_definition: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } } | null } };

export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutationVariables = Exact<{
  wordlike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertWordDefinitionFromWordAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertWordDefinitionFromWordAndDefinitionlikeString: { __typename?: 'WordDefinitionOutput', error: ErrorType, word_definition?: { __typename?: 'WordDefinition', word_definition_id: string, definition: string, created_at: string, word: { __typename?: 'Word', word_id: string, word: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutationVariables = Exact<{
  phraselike_string: Scalars['String']['input'];
  definitionlike_string: Scalars['String']['input'];
  language_code: Scalars['String']['input'];
  dialect_code?: InputMaybe<Scalars['String']['input']>;
  geo_code?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation = { __typename?: 'Mutation', upsertPhraseDefinitionFromPhraseAndDefinitionlikeString: { __typename?: 'PhraseDefinitionOutput', error: ErrorType, phrase_definition?: { __typename?: 'PhraseDefinition', phrase_definition_id: string, definition: string, created_at: string, phrase: { __typename?: 'Phrase', phrase_id: string, phrase: string, language_code: string, dialect_code?: string | null, geo_code?: string | null } } | null } };

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
}
    `;
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
export const WordDefinitionFragmentFragmentDoc = gql`
    fragment WordDefinitionFragment on WordDefinition {
  word_definition_id
  word {
    ...WordFragment
  }
  definition
  created_at
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
}
    `;
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
}
    `;
export const PhraseDefinitionFragmentFragmentDoc = gql`
    fragment PhraseDefinitionFragment on PhraseDefinition {
  phrase_definition_id
  definition
  phrase {
    ...PhraseFragment
  }
  created_at
}
    ${PhraseFragmentFragmentDoc}`;
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
  folder_id
  name
}
    `;
export const ForumFragmentFragmentDoc = gql`
    fragment ForumFragment on Forum {
  forum_id
  name
}
    `;
export const MapDetailsOutputFragmentFragmentDoc = gql`
    fragment MapDetailsOutputFragment on MapDetailsOutput {
  error
  mapFileInfo {
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
}
    `;
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
}
    `;
export const PhraseWithDefinitionFragmentFragmentDoc = gql`
    fragment PhraseWithDefinitionFragment on PhraseWithDefinition {
  phrase_id
  phrase
  language_code
  dialect_code
  geo_code
  definition
  definition_id
}
    `;
export const MapVoteStatusFragmentFragmentDoc = gql`
    fragment MapVoteStatusFragment on MapVoteStatus {
  map_id
  is_original
  downvotes
  upvotes
}
    `;
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
  created_by
  created_at
}
    ${QuestionItemFragmentFragmentDoc}`;
export const AnswerFragmentFragmentDoc = gql`
    fragment AnswerFragment on Answer {
  answer_id
  question_id
  answer
  question_items {
    ...QuestionItemFragment
  }
  created_by
  created_at
}
    ${QuestionItemFragmentFragmentDoc}`;
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
  created_by
  created_at
  begin {
    ...DocumentWordEntryFragment
  }
  end {
    ...DocumentWordEntryFragment
  }
}
    ${QuestionItemFragmentFragmentDoc}
${DocumentWordEntryFragmentFragmentDoc}`;
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
export const SiteTextLanguageWithTranslationInfoFragmentFragmentDoc = gql`
    fragment SiteTextLanguageWithTranslationInfoFragment on SiteTextLanguageWithTranslationInfo {
  language_code
  dialect_code
  geo_code
  total_count
  translated_count
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
    document_id
  }
}
    `;
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
    query GetAllDocuments($languageInput: LanguageInput) {
  getAllDocuments(input: {lang: $languageInput}) {
    documents {
      ...TextyDocumentFragment
    }
  }
}
    ${TextyDocumentFragmentFragmentDoc}`;

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
 *      languageInput: // value for 'languageInput'
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
    query GetDocumentWordEntriesByDocumentId($document_id: ID!) {
  getDocumentWordEntriesByDocumentId(document_id: $document_id) {
    error
    document_word_entries {
      ...DocumentWordEntryFragment
    }
  }
}
    ${DocumentWordEntryFragmentFragmentDoc}`;

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
export const GetWordRangesByDocumentIdDocument = gql`
    query GetWordRangesByDocumentId($id: ID!) {
  getWordRangesByDocumentId(id: $id) {
    error
    word_ranges {
      ...WordRangeFragment
    }
  }
}
    ${WordRangeFragmentFragmentDoc}`;

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
 *      id: // value for 'id'
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
export const CreateThreadDocument = gql`
    mutation CreateThread($name: String!, $folder_id: ID!) {
  threadUpsert(input: {name: $name, folder_id: $folder_id}) {
    error
    thread {
      thread_id
      name
    }
  }
}
    `;
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
 *      folder_id: // value for 'folder_id'
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
export const GetThreadByIdDocument = gql`
    query GetThreadById($id: ID!) {
  threadRead(input: {thread_id: $id}) {
    error
    thread {
      thread_id
      name
    }
  }
}
    `;

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
 *      id: // value for 'id'
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
export const GetThreadsDocument = gql`
    query GetThreads($folder_id: ID!) {
  threads(input: {folder_id: $folder_id}) {
    error
    threads {
      __typename
      thread_id
      name
    }
  }
}
    `;

/**
 * __useGetThreadsQuery__
 *
 * To run a query within a React component, call `useGetThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadsQuery({
 *   variables: {
 *      folder_id: // value for 'folder_id'
 *   },
 * });
 */
export function useGetThreadsQuery(baseOptions: Apollo.QueryHookOptions<GetThreadsQuery, GetThreadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadsQuery, GetThreadsQueryVariables>(GetThreadsDocument, options);
      }
export function useGetThreadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadsQuery, GetThreadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadsQuery, GetThreadsQueryVariables>(GetThreadsDocument, options);
        }
export type GetThreadsQueryHookResult = ReturnType<typeof useGetThreadsQuery>;
export type GetThreadsLazyQueryHookResult = ReturnType<typeof useGetThreadsLazyQuery>;
export type GetThreadsQueryResult = Apollo.QueryResult<GetThreadsQuery, GetThreadsQueryVariables>;
export const UpdateThreadDocument = gql`
    mutation UpdateThread($thread_id: ID, $name: String!, $folder_id: ID!) {
  threadUpsert(input: {folder_id: $folder_id, name: $name, thread_id: $thread_id}) {
    error
    thread {
      thread_id
      name
    }
  }
}
    `;
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
 *      folder_id: // value for 'folder_id'
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
    mutation DeleteThread($id: ID!) {
  threadDelete(input: {thread_id: $id}) {
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
 *      id: // value for 'id'
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
export const CreateForumFolderDocument = gql`
    mutation CreateForumFolder($name: String!, $forum_id: ID!) {
  forumFolderUpsert(input: {name: $name, forum_id: $forum_id}) {
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
export const GetForumFolderByIdDocument = gql`
    query GetForumFolderById($id: ID!) {
  forumFolderRead(input: {folder_id: $id}) {
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
 *      id: // value for 'id'
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
export const GetForumFoldersDocument = gql`
    query GetForumFolders($forum_id: ID!) {
  forumFolders(input: {forum_id: $forum_id}) {
    error
    folders {
      ...ForumFolderFragment
    }
  }
}
    ${ForumFolderFragmentFragmentDoc}`;

/**
 * __useGetForumFoldersQuery__
 *
 * To run a query within a React component, call `useGetForumFoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumFoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumFoldersQuery({
 *   variables: {
 *      forum_id: // value for 'forum_id'
 *   },
 * });
 */
export function useGetForumFoldersQuery(baseOptions: Apollo.QueryHookOptions<GetForumFoldersQuery, GetForumFoldersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumFoldersQuery, GetForumFoldersQueryVariables>(GetForumFoldersDocument, options);
      }
export function useGetForumFoldersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumFoldersQuery, GetForumFoldersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumFoldersQuery, GetForumFoldersQueryVariables>(GetForumFoldersDocument, options);
        }
export type GetForumFoldersQueryHookResult = ReturnType<typeof useGetForumFoldersQuery>;
export type GetForumFoldersLazyQueryHookResult = ReturnType<typeof useGetForumFoldersLazyQuery>;
export type GetForumFoldersQueryResult = Apollo.QueryResult<GetForumFoldersQuery, GetForumFoldersQueryVariables>;
export const UpdateForumFolderDocument = gql`
    mutation UpdateForumFolder($id: ID!, $name: String!, $forum_id: ID!) {
  forumFolderUpsert(input: {forum_id: $forum_id, name: $name, folder_id: $id}) {
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
 *      id: // value for 'id'
 *      name: // value for 'name'
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
    mutation DeleteForumFolder($id: ID!) {
  forumFolderDelete(input: {folder_id: $id}) {
    error
    folder_id
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
 *      id: // value for 'id'
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
export const CreateForumDocument = gql`
    mutation CreateForum($name: String!) {
  forumUpsert(input: {name: $name}) {
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
export const GetForumByIdDocument = gql`
    query GetForumById($id: ID!) {
  forumRead(input: {forum_id: $id}) {
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
 *      id: // value for 'id'
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
export const GetForumsDocument = gql`
    query GetForums {
  forums {
    error
    forums {
      ...ForumFragment
    }
  }
}
    ${ForumFragmentFragmentDoc}`;

/**
 * __useGetForumsQuery__
 *
 * To run a query within a React component, call `useGetForumsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetForumsQuery(baseOptions?: Apollo.QueryHookOptions<GetForumsQuery, GetForumsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumsQuery, GetForumsQueryVariables>(GetForumsDocument, options);
      }
export function useGetForumsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumsQuery, GetForumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumsQuery, GetForumsQueryVariables>(GetForumsDocument, options);
        }
export type GetForumsQueryHookResult = ReturnType<typeof useGetForumsQuery>;
export type GetForumsLazyQueryHookResult = ReturnType<typeof useGetForumsLazyQuery>;
export type GetForumsQueryResult = Apollo.QueryResult<GetForumsQuery, GetForumsQueryVariables>;
export const UpdateForumDocument = gql`
    mutation UpdateForum($id: ID, $name: String!) {
  forumUpsert(input: {forum_id: $id, name: $name}) {
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
    mutation DeleteForum($id: ID!) {
  forumDelete(input: {forum_id: $id}) {
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
 *      id: // value for 'id'
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
    query GetOrigMapWordsAndPhrases($lang: LanguageInput!, $after: ID, $first: Int) {
  getOrigMapWordsAndPhrases(input: {lang: $lang}, after: $after, first: $first) {
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
 *      lang: // value for 'lang'
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
export const MapUploadDocument = gql`
    mutation MapUpload($file: Upload!, $previewFileId: String, $file_type: String!, $file_size: Int!) {
  mapUpload(
    file: $file
    previewFileId: $previewFileId
    file_type: $file_type
    file_size: $file_size
  ) {
    error
    mapFileOutput {
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
    query GetQuestionOnWordRangesByDocumentId($document_id: ID!) {
  getQuestionOnWordRangesByDocumentId(document_id: $document_id) {
    error
    questions {
      ...QuestionOnWordRangeFragment
    }
  }
}
    ${QuestionOnWordRangeFragmentFragmentDoc}`;

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
export const CreateQuestionOnWordRangeDocument = gql`
    mutation CreateQuestionOnWordRange($begin_document_word_entry_id: ID!, $end_document_word_entry_id: ID!, $question: String!, $question_items: [String!]!, $question_type_is_multiselect: Boolean!) {
  createQuestionOnWordRange(
    input: {begin_document_word_entry_id: $begin_document_word_entry_id, end_document_word_entry_id: $end_document_word_entry_id, question: $question, question_items: $question_items, question_type_is_multiselect: $question_type_is_multiselect}
  ) {
    error
    questions {
      ...QuestionFragment
    }
  }
}
    ${QuestionFragmentFragmentDoc}`;
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
export const LanguagesForGoogleTranslateDocument = gql`
    query LanguagesForGoogleTranslate {
  languagesForGoogleTranslate {
    error
    languages {
      code
      name
    }
  }
}
    `;

/**
 * __useLanguagesForGoogleTranslateQuery__
 *
 * To run a query within a React component, call `useLanguagesForGoogleTranslateQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesForGoogleTranslateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesForGoogleTranslateQuery({
 *   variables: {
 *   },
 * });
 */
export function useLanguagesForGoogleTranslateQuery(baseOptions?: Apollo.QueryHookOptions<LanguagesForGoogleTranslateQuery, LanguagesForGoogleTranslateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LanguagesForGoogleTranslateQuery, LanguagesForGoogleTranslateQueryVariables>(LanguagesForGoogleTranslateDocument, options);
      }
export function useLanguagesForGoogleTranslateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguagesForGoogleTranslateQuery, LanguagesForGoogleTranslateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LanguagesForGoogleTranslateQuery, LanguagesForGoogleTranslateQueryVariables>(LanguagesForGoogleTranslateDocument, options);
        }
export type LanguagesForGoogleTranslateQueryHookResult = ReturnType<typeof useLanguagesForGoogleTranslateQuery>;
export type LanguagesForGoogleTranslateLazyQueryHookResult = ReturnType<typeof useLanguagesForGoogleTranslateLazyQuery>;
export type LanguagesForGoogleTranslateQueryResult = Apollo.QueryResult<LanguagesForGoogleTranslateQuery, LanguagesForGoogleTranslateQueryVariables>;
export const LanguagesForLiltTranslateDocument = gql`
    query LanguagesForLiltTranslate {
  languagesForLiltTranslate {
    error
    languages {
      code
      name
    }
  }
}
    `;

/**
 * __useLanguagesForLiltTranslateQuery__
 *
 * To run a query within a React component, call `useLanguagesForLiltTranslateQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesForLiltTranslateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesForLiltTranslateQuery({
 *   variables: {
 *   },
 * });
 */
export function useLanguagesForLiltTranslateQuery(baseOptions?: Apollo.QueryHookOptions<LanguagesForLiltTranslateQuery, LanguagesForLiltTranslateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LanguagesForLiltTranslateQuery, LanguagesForLiltTranslateQueryVariables>(LanguagesForLiltTranslateDocument, options);
      }
export function useLanguagesForLiltTranslateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguagesForLiltTranslateQuery, LanguagesForLiltTranslateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LanguagesForLiltTranslateQuery, LanguagesForLiltTranslateQueryVariables>(LanguagesForLiltTranslateDocument, options);
        }
export type LanguagesForLiltTranslateQueryHookResult = ReturnType<typeof useLanguagesForLiltTranslateQuery>;
export type LanguagesForLiltTranslateLazyQueryHookResult = ReturnType<typeof useLanguagesForLiltTranslateLazyQuery>;
export type LanguagesForLiltTranslateQueryResult = Apollo.QueryResult<LanguagesForLiltTranslateQuery, LanguagesForLiltTranslateQueryVariables>;
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
export const StopGoogleTranslationDocument = gql`
    mutation StopGoogleTranslation {
  stopGoogleTranslation {
    error
  }
}
    `;
export type StopGoogleTranslationMutationFn = Apollo.MutationFunction<StopGoogleTranslationMutation, StopGoogleTranslationMutationVariables>;

/**
 * __useStopGoogleTranslationMutation__
 *
 * To run a mutation, you first call `useStopGoogleTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopGoogleTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopGoogleTranslationMutation, { data, loading, error }] = useStopGoogleTranslationMutation({
 *   variables: {
 *   },
 * });
 */
export function useStopGoogleTranslationMutation(baseOptions?: Apollo.MutationHookOptions<StopGoogleTranslationMutation, StopGoogleTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopGoogleTranslationMutation, StopGoogleTranslationMutationVariables>(StopGoogleTranslationDocument, options);
      }
export type StopGoogleTranslationMutationHookResult = ReturnType<typeof useStopGoogleTranslationMutation>;
export type StopGoogleTranslationMutationResult = Apollo.MutationResult<StopGoogleTranslationMutation>;
export type StopGoogleTranslationMutationOptions = Apollo.BaseMutationOptions<StopGoogleTranslationMutation, StopGoogleTranslationMutationVariables>;
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
    PostsByParent: 'PostsByParent',
    WordDefinitionRead: 'WordDefinitionRead',
    GetWordsByLanguage: 'GetWordsByLanguage',
    GetWordDefinitionsByWordId: 'GetWordDefinitionsByWordId',
    GetWordWithVoteById: 'GetWordWithVoteById',
    GetAllDocuments: 'GetAllDocuments',
    GetDocument: 'GetDocument',
    GetDocumentWordEntriesByDocumentId: 'GetDocumentWordEntriesByDocumentId',
    GetWordRangesByDocumentId: 'GetWordRangesByDocumentId',
    GetFlagsFromRef: 'GetFlagsFromRef',
    GetWordDefinitionsByFlag: 'GetWordDefinitionsByFlag',
    GetPhraseDefinitionsByFlag: 'GetPhraseDefinitionsByFlag',
    GetThreadById: 'GetThreadById',
    GetThreads: 'GetThreads',
    GetForumFolderById: 'GetForumFolderById',
    GetForumFolders: 'GetForumFolders',
    GetForumById: 'GetForumById',
    GetForums: 'GetForums',
    GetOrigMapWordsAndPhrases: 'GetOrigMapWordsAndPhrases',
    GetMapWordOrPhraseAsOrigByDefinitionId: 'GetMapWordOrPhraseAsOrigByDefinitionId',
    GetAllMapsList: 'GetAllMapsList',
    GetMapDetails: 'GetMapDetails',
    IsAdminLoggedIn: 'IsAdminLoggedIn',
    GetMapVoteStatus: 'GetMapVoteStatus',
    ListNotifications: 'ListNotifications',
    PhraseDefinitionRead: 'PhraseDefinitionRead',
    GetPhrasesByLanguage: 'GetPhrasesByLanguage',
    GetPhraseDefinitionsByPhraseId: 'GetPhraseDefinitionsByPhraseId',
    GetPhraseWithVoteById: 'GetPhraseWithVoteById',
    PostRead: 'PostRead',
    GetQuestionOnWordRangesByDocumentId: 'GetQuestionOnWordRangesByDocumentId',
    GetAnswersByQuestionId: 'GetAnswersByQuestionId',
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
    LanguagesForGoogleTranslate: 'LanguagesForGoogleTranslate',
    LanguagesForLiltTranslate: 'LanguagesForLiltTranslate',
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
    MapUpload: 'MapUpload',
    MapDelete: 'MapDelete',
    MapsTranslationsReset: 'MapsTranslationsReset',
    MapsReTranslate: 'MapsReTranslate',
    ToggleMapVoteStatus: 'ToggleMapVoteStatus',
    AddNotification: 'AddNotification',
    DeleteNotification: 'DeleteNotification',
    MarkNotificationRead: 'MarkNotificationRead',
    PhraseDefinitionUpsert: 'PhraseDefinitionUpsert',
    TogglePhraseDefinitionVoteStatus: 'TogglePhraseDefinitionVoteStatus',
    TogglePhraseVoteStatus: 'TogglePhraseVoteStatus',
    PhraseUpsert: 'PhraseUpsert',
    VersionCreate: 'VersionCreate',
    CreateQuestionOnWordRange: 'CreateQuestionOnWordRange',
    UpsertAnswer: 'UpsertAnswer',
    UpsertSiteTextTranslation: 'UpsertSiteTextTranslation',
    ToggleSiteTextTranslationVoteStatus: 'ToggleSiteTextTranslationVoteStatus',
    SiteTextUpsert: 'SiteTextUpsert',
    TranslateWordsAndPhrasesByGoogle: 'TranslateWordsAndPhrasesByGoogle',
    TranslateWordsAndPhrasesByLilt: 'TranslateWordsAndPhrasesByLilt',
    TranslateAllWordsAndPhrasesByGoogle: 'TranslateAllWordsAndPhrasesByGoogle',
    TranslateAllWordsAndPhrasesByLilt: 'TranslateAllWordsAndPhrasesByLilt',
    StopGoogleTranslation: 'StopGoogleTranslation',
    ToggleTranslationVoteStatus: 'ToggleTranslationVoteStatus',
    UpsertTranslation: 'UpsertTranslation',
    UpsertTranslationFromWordAndDefinitionlikeString: 'UpsertTranslationFromWordAndDefinitionlikeString',
    UpsertWordDefinitionFromWordAndDefinitionlikeString: 'UpsertWordDefinitionFromWordAndDefinitionlikeString',
    UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString: 'UpsertPhraseDefinitionFromPhraseAndDefinitionlikeString',
    AvatarUpdate: 'AvatarUpdate'
  },
  Subscription: {
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
    FlagFragment: 'FlagFragment',
    WordDefinitionListEdgeFragment: 'WordDefinitionListEdgeFragment',
    PhraseDefinitionListEdgeFragment: 'PhraseDefinitionListEdgeFragment',
    ForumFolderFragment: 'ForumFolderFragment',
    ForumFragment: 'ForumFragment',
    MapDetailsOutputFragment: 'MapDetailsOutputFragment',
    MapDetailsOutputEdgeFragment: 'MapDetailsOutputEdgeFragment',
    MapWordOrPhraseFragment: 'MapWordOrPhraseFragment',
    MapWordsAndPhrasesEdgeFragment: 'MapWordsAndPhrasesEdgeFragment',
    WordWithDefinitionFragment: 'WordWithDefinitionFragment',
    PhraseWithDefinitionFragment: 'PhraseWithDefinitionFragment',
    MapVoteStatusFragment: 'MapVoteStatusFragment',
    PhraseFragment: 'PhraseFragment',
    PhraseDefinitionFragment: 'PhraseDefinitionFragment',
    PhraseWithDefinitionsFragment: 'PhraseWithDefinitionsFragment',
    PhraseDefinitionWithVoteFragment: 'PhraseDefinitionWithVoteFragment',
    PhraseWithVoteFragment: 'PhraseWithVoteFragment',
    PhraseVoteStatusFragment: 'PhraseVoteStatusFragment',
    PhraseWithVoteListEdgeFragment: 'PhraseWithVoteListEdgeFragment',
    VersionFields: 'VersionFields',
    QuestionItemFragment: 'QuestionItemFragment',
    QuestionFragment: 'QuestionFragment',
    AnswerFragment: 'AnswerFragment',
    QuestionOnWordRangeFragment: 'QuestionOnWordRangeFragment',
    SiteTextWordToWordTranslationWithVoteFragment: 'SiteTextWordToWordTranslationWithVoteFragment',
    SiteTextWordToPhraseTranslationWithVoteFragment: 'SiteTextWordToPhraseTranslationWithVoteFragment',
    SiteTextPhraseToWordTranslationWithVoteFragment: 'SiteTextPhraseToWordTranslationWithVoteFragment',
    SiteTextPhraseToPhraseTranslationWithVoteFragment: 'SiteTextPhraseToPhraseTranslationWithVoteFragment',
    SiteTextPhraseDefinitionFragment: 'SiteTextPhraseDefinitionFragment',
    SiteTextWordDefinitionFragment: 'SiteTextWordDefinitionFragment',
    SiteTextTranslationVoteStatusFragment: 'SiteTextTranslationVoteStatusFragment',
    SiteTextLanguageFragment: 'SiteTextLanguageFragment',
    SiteTextTranslationWithVoteListByLanguageFragment: 'SiteTextTranslationWithVoteListByLanguageFragment',
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