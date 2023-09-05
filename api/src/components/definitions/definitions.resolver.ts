import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';
import { DefinitionsService } from './definitions.service';
import { WordDefinitionVotesService } from './word-definition-votes.service';
import { PhraseDefinitionVotesService } from './phrase-definition-votes.service';

import {
  WordDefinitionOutput,
  WordDefinitionUpsertInput,
  PhraseDefinitionOutput,
  PhraseDefinitionUpsertInput,
  FromWordAndDefintionlikeStringUpsertInput,
  FromPhraseAndDefintionlikeStringUpsertInput,
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
  WordDefinitionWithVoteListOutput,
  PhraseDefinitionWithVoteListOutput,
  DefinitionVoteStatusOutputRow,
} from './types';
import { LanguageInput } from 'src/components/common/types';

@Injectable()
@Resolver()
export class DefinitionsResolver {
  constructor(
    private wordDefinitionsService: WordDefinitionsService,
    private phraseDefinitionsService: PhraseDefinitionsService,
    private definitionService: DefinitionsService,
    private wordDefinitionVoteService: WordDefinitionVotesService,
    private phraseDefinitionVoteService: PhraseDefinitionVotesService,
  ) {}

  @Query(() => WordDefinitionOutput)
  async wordDefinitionRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordDefinitionOutput> {
    console.log('word definition read resolver, word_id:', id);

    return this.wordDefinitionsService.read(+id, null);
  }

  @Mutation(() => WordDefinitionOutput)
  async wordDefinitionUpsert(
    @Args('input') input: WordDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<WordDefinitionOutput> {
    console.log(
      `word definition upsert resolver, string: word_id: ${input.word_id}, definition: ${input.definition} `,
    );

    return this.wordDefinitionsService.upsert(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PhraseDefinitionOutput)
  async phraseDefinitionRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseDefinitionOutput> {
    console.log('phrase definition read resolver, phrase_id:', id);

    return this.phraseDefinitionsService.read(+id, null);
  }

  @Mutation(() => PhraseDefinitionOutput)
  async phraseDefinitionUpsert(
    @Args('input') input: PhraseDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<PhraseDefinitionOutput> {
    console.log(
      `phrase definition upsert resolver, string: phrase_id: ${input.phrase_id}, definition: ${input.definition} `,
    );

    return this.phraseDefinitionsService.upsert(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => WordDefinitionOutput)
  async upsertWordDefinitionFromWordAndDefinitionlikeString(
    @Args('input') input: FromWordAndDefintionlikeStringUpsertInput,
    @Context() req: any,
  ): Promise<WordDefinitionOutput> {
    console.log(
      `upsert word definition from word and definition like string resolver, string: wordlike_string: ${input.wordlike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.definitionService.upsertFromWordAndDefinitionlikeString(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => PhraseDefinitionOutput)
  async upsertPhraseDefinitionFromPhraseAndDefinitionlikeString(
    @Args('input') input: FromPhraseAndDefintionlikeStringUpsertInput,
    @Context() req: any,
  ): Promise<PhraseDefinitionOutput> {
    console.log(
      `upsert phrase definition from phrase and definition like string resolver, string: phraselike_string: ${input.phraselike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.definitionService.upsertFromPhraseAndDefinitionlikeString(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => PhraseDefinitionOutput)
  async updateDefinition(
    @Args('input') input: DefinitionUpdateaInput,
    @Context() req: any,
  ): Promise<DefinitionUpdateOutput> {
    console.log(`update definition`);

    return this.definitionService.updateDefinition(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => WordDefinitionWithVoteListOutput)
  async getWordDefinitionsByLanguage(
    @Args('input', { type: () => LanguageInput }) input: LanguageInput,
  ): Promise<WordDefinitionWithVoteListOutput> {
    console.log(
      'getWordDefinitionsByLanguage resolver',
      JSON.stringify(input, null, 2),
    );

    return this.wordDefinitionsService.getWordDefinitionsByLanguage(
      input,
      null,
    );
  }

  @Query(() => WordDefinitionWithVoteListOutput)
  async getWordDefinitionsByWordId(
    @Args('word_id', { type: () => ID }) word_id: string,
  ): Promise<WordDefinitionWithVoteListOutput> {
    console.log('getWordDefinitionsByLanguage resolver');

    return this.wordDefinitionsService.getWordDefinitionsByWordId(
      +word_id,
      null,
    );
  }

  @Query(() => PhraseDefinitionWithVoteListOutput)
  async getPhraseDefinitionsByLanguage(
    @Args('input', { type: () => LanguageInput }) input: LanguageInput,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    console.log(
      'getPhraseDefinitionsByLanguage resolver',
      JSON.stringify(input, null, 2),
    );

    return this.phraseDefinitionsService.getPhraseDefinitionsByLanguage(
      input,
      null,
    );
  }

  @Query(() => PhraseDefinitionWithVoteListOutput)
  async getPhraseDefinitionsByPhraseId(
    @Args('phrase_id', { type: () => ID }) phrase_id: string,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    console.log('getPhraseDefinitionsByPhraseId resolver');

    return this.phraseDefinitionsService.getPhraseDefinitionsByPhraseId(
      +phrase_id,
      null,
    );
  }

  @Query(() => DefinitionVoteStatusOutputRow)
  async getWordDefinitionVoteStatus(
    @Args('word_definition_id', { type: () => ID }) word_definition_id: string,
  ): Promise<DefinitionVoteStatusOutputRow> {
    console.log('getWordDefinitionVoteStatus resolver', word_definition_id);

    return this.wordDefinitionVoteService.getVoteStatus(
      +word_definition_id,
      null,
    );
  }

  @Query(() => DefinitionVoteStatusOutputRow)
  async getPhraseDefinitionVoteStatus(
    @Args('phrase_definition_id', { type: () => ID })
    phrase_definition_id: string,
  ): Promise<DefinitionVoteStatusOutputRow> {
    console.log('getPhraseDefinitionVoteStatus resolver', phrase_definition_id);

    return this.phraseDefinitionVoteService.getVoteStatus(
      +phrase_definition_id,
      null,
    );
  }

  @Mutation(() => DefinitionVoteStatusOutputRow)
  async toggleWordDefinitionVoteStatus(
    @Args('word_definition_id', { type: () => ID }) word_definition_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<DefinitionVoteStatusOutputRow> {
    console.log('getWordDefinitionToggleVote');

    return this.wordDefinitionVoteService.toggleVoteStatus(
      +word_definition_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => DefinitionVoteStatusOutputRow)
  async togglePhraseDefinitionVoteStatus(
    @Args('phrase_definition_id', { type: () => ID })
    phrase_definition_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<DefinitionVoteStatusOutputRow> {
    console.log('getWordDefinitionToggleVote');

    return this.phraseDefinitionVoteService.toggleVoteStatus(
      +phrase_definition_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }
}
