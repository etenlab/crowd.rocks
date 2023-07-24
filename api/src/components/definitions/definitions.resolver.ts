import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';
import { DefinitionsService } from './definitions.service';

import {
  WordDefinitionReadOutput,
  WordDefinitionUpsertInput,
  WordDefinitionUpsertOutput,
  PhraseDefinitionReadOutput,
  PhraseDefinitionUpsertInput,
  PhraseDefinitionUpsertOutput,
  FromWordAndDefintionlikeStringUpsertInput,
  FromPhraseAndDefintionlikeStringUpsertInput,
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver()
export class DefinitionsResolver {
  constructor(
    private wordDefinitionsService: WordDefinitionsService,
    private phraseDefinitionsService: PhraseDefinitionsService,
    private definitionService: DefinitionsService,
  ) {}

  @Query(() => WordDefinitionReadOutput)
  async wordDefinitionRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordDefinitionReadOutput> {
    console.log('word definition read resolver, word_id:', id);

    return this.wordDefinitionsService.read(+id);
  }

  @Mutation(() => WordDefinitionUpsertOutput)
  async wordDefinitionUpsert(
    @Args('input') input: WordDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<WordDefinitionUpsertOutput> {
    console.log(
      `word definition upsert resolver, string: word_id: ${input.word_id}, definition: ${input.definition} `,
    );

    return this.wordDefinitionsService.upsert(input, getBearer(req));
  }

  @Query(() => PhraseDefinitionReadOutput)
  async phraseDefinitionRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseDefinitionReadOutput> {
    console.log('phrase definition read resolver, phrase_id:', id);

    return this.phraseDefinitionsService.read(+id);
  }

  @Mutation(() => PhraseDefinitionUpsertOutput)
  async phraseDefinitionUpsert(
    @Args('input') input: PhraseDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<PhraseDefinitionUpsertOutput> {
    console.log(
      `phrase definition upsert resolver, string: phrase_id: ${input.phrase_id}, definition: ${input.definition} `,
    );

    return this.phraseDefinitionsService.upsert(input, getBearer(req));
  }

  @Mutation(() => WordDefinitionUpsertOutput)
  async upsertWordDefinitionFromWordAndDefinitionlikeString(
    @Args('input') input: FromWordAndDefintionlikeStringUpsertInput,
    @Context() req: any,
  ): Promise<WordDefinitionUpsertOutput> {
    console.log(
      `upsert word definition from word and definition like string resolver, string: wordlike_string: ${input.wordlike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.definitionService.upsertFromWordAndDefinitionlikeString(
      input,
      getBearer(req),
    );
  }

  @Mutation(() => PhraseDefinitionUpsertOutput)
  async upsertPhraseDefinitionFromPhraseAndDefinitionlikeString(
    @Args('input') input: FromPhraseAndDefintionlikeStringUpsertInput,
    @Context() req: any,
  ): Promise<PhraseDefinitionUpsertOutput> {
    console.log(
      `upsert phrase definition from phrase and definition like string resolver, string: phraselike_string: ${input.phraselike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.definitionService.upsertFromPhraseAndDefinitionlikeString(
      input,
      getBearer(req),
    );
  }

  @Mutation(() => PhraseDefinitionUpsertOutput)
  async updateDefinition(
    @Args('input') input: DefinitionUpdateaInput,
    @Context() req: any,
  ): Promise<DefinitionUpdateOutput> {
    console.log(`update definition`);

    return this.definitionService.updateDefinition(input, getBearer(req));
  }
}
