import { TypePolicies } from '@apollo/client';

export const typePolicies: TypePolicies = {
  WordWithDefinitionlikeStrings: {
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
  PhraseWithDefinitionlikeStrings: {
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
  SiteTextTranslationWithVote: {
    keyFields: ['site_text_translation_id'],
  },
  SiteTextTranslation: {
    keyFields: ['site_text_translation_id'],
  },
  VoteStatus: {
    keyFields: ['site_text_translation_id'],
  },
};
