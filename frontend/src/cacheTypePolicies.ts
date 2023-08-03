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
};
