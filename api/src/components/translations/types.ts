import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';

import { Word } from 'src/components/words/types';
import { Phrase } from 'src/components/phrases/types';

@ObjectType()
export class WordToWordTranslation {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => Word) from_word: Word;
  @Field(() => Word) to_word: Word;
}

@ObjectType()
export class WordToPhraseTranslation {
  @Field(() => ID) word_to_phrase_translation_id: string;
  @Field(() => Word) from_word: Word;
  @Field(() => Phrase) to_phrase: Phrase;
}

@ObjectType()
export class PhraseToPhraseTranslation {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
  @Field(() => Phrase) from_phrase: Phrase;
  @Field(() => Phrase) to_phrase: Phrase;
}

@InputType()
export class WordToWordTranslationUpsertInput {
  @Field(() => ID) from_word: string;
  @Field(() => ID) to_word: string;
}

@InputType()
export class WordToPhraseTranslationUpsertInput {
  @Field(() => ID) from_word: string;
  @Field(() => ID) to_phrase: string;
}

@InputType()
export class PhraseToPhraseTranslationUpsertInput {
  @Field(() => ID) from_phrase: string;
  @Field(() => ID) to_phrase: string;
}

@ObjectType()
export class WordToWordTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@ObjectType()
export class WordToWordTranslationReadOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}
