import { TypePolicies } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      getWordsByLanguage: relayStylePagination(['input']),
      getPhrasesByLanguage: relayStylePagination(['input']),
      getWordDefinitionsByFlag: relayStylePagination(['flag_name']),
      getPhraseDefinitionsByFlag: relayStylePagination(['flag_name']),
      getAllMapsList: relayStylePagination(['input']),
      getOrigMapWordsAndPhrases: relayStylePagination(['input']),
    },
  },
  WordWithDefinitions: {
    keyFields: ['word_id'],
  },
  WordDefinitionWithVote: {
    keyFields: ['word_definition_id'],
  },
  WordWithVote: {
    keyFields: ['word_id'],
  },
  WordWithVoteListEdge: {
    keyFields: ['cursor'],
  },
  WordVoteStatus: {
    keyFields: ['word_id'],
  },
  PhraseWithDefinitions: {
    keyFields: ['phrase_id'],
  },
  PhraseDefinitionWithVote: {
    keyFields: ['phrase_definition_id'],
  },
  PhraseWithVote: {
    keyFields: ['phrase_id'],
  },
  PhraseWithVoteListEdge: {
    keyFields: ['cursor'],
  },
  PhraseVoteStatus: {
    keyFields: ['phrase_id'],
  },
  Phrase: {
    keyFields: ['phrase_id'],
  },
  Word: {
    keyFields: ['word_id'],
  },
  WordDefinition: {
    keyFields: ['word_definition_id'],
  },
  PhraseDefinition: {
    keyFields: ['phrase_definition_id'],
  },
  SiteTextPhraseDefinition: {
    keyFields: ['site_text_id'],
  },
  SiteTextWordDefinition: {
    keyFields: ['site_text_id'],
  },
  WordToWordTranslationWithVote: {
    keyFields: ['word_to_word_translation_id'],
  },
  WordToPhraseTranslationWithVote: {
    keyFields: ['word_to_phrase_translation_id'],
  },
  PhraseToWordTranslationWithVote: {
    keyFields: ['phrase_to_word_translation_id'],
  },
  PhraseToPhraseTranslationWithVote: {
    keyFields: ['phrase_to_phrase_translation_id'],
  },
  WordToWordTranslation: {
    keyFields: ['word_to_word_translation_id'],
  },
  WordToPhraseTranslation: {
    keyFields: ['word_to_phrase_translation_id'],
  },
  PhraseToWordTranslation: {
    keyFields: ['phrase_to_word_translation_id'],
  },
  PhraseToPhraseTranslation: {
    keyFields: ['phrase_to_phrase_translation_id'],
  },
  Post: {
    keyFields: ['post_id'],
  },
  Flag: {
    keyFields: ['flag_id'],
  },
  TextyDocument: {
    keyFields: ['document_id'],
  },
  MapFileOutputEdge: {
    keyFields: ['cursor'],
  },
  MapWordsAndPhrasesEdge: {
    keyFields: ['cursor'],
  },
  MapVoteStatus: {
    keyFields: ['map_id', 'is_original'],
  },
  Question: {
    keyFields: ['question_id'],
  },
  QuestionOnWordRange: {
    keyFields: ['question_id'],
  },
  Answer: {
    keyFields: ['answer_id'],
  },
  Pericope: {
    keyFields: ['pericope_id'],
  },
  PericopeVoteStatus: {
    keyFields: ['pericope_id'],
  },
};
