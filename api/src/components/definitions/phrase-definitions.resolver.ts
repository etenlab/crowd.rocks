import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { PhraseDefinitionsService } from './phrase-definitions.service';

import {
  PhraseDefinition,
  PhraseDefinitionReadOutput,
  PhraseDefinitionUpsertInput,
  PhraseDefinitionUpsertOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(PhraseDefinition)
export class PhraseDefinitionsResolver {
  constructor(private phraseDefinitionsService: PhraseDefinitionsService) {}

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
}
