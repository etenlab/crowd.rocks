import { TypePolicies } from '@apollo/client';

export const typePolicies: TypePolicies = {
  WordWithDefinitions: {
    keyFields: ['word_id'],
  },
  WordDefinitionWithVote: {
    keyFields: ['word_definition_id'],
  },
  WordWithVote: {
    keyFields: ['word_id'],
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
  SiteTextWordToWordTranslationWithVote: {
    keyFields: ['word_to_word_translation_id'],
  },
  SiteTextWordToPhraseTranslationWithVote: {
    keyFields: ['word_to_phrase_translation_id'],
  },
  SiteTextPhraseToWordTranslationWithVote: {
    keyFields: ['phrase_to_word_translation_id'],
  },
  SiteTextPhraseToPhraseTranslationWithVote: {
    keyFields: ['phrase_to_phrase_translation_id'],
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
};
