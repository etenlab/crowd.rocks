import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { WordDefinitionsService } from './word-definitions.service';

import {
  WordDefinition,
  WordDefinitionReadOutput,
  WordDefinitionUpsertInput,
  WordDefinitionUpsertOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(WordDefinition)
export class WordDefinitionsResolver {
  constructor(private wordDefinitionsService: WordDefinitionsService) {}

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
}
