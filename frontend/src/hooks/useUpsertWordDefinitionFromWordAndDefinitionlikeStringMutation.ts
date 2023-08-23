import { useIonToast } from '@ionic/react';

import { useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation as useGeneratedUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertWord } from '../cacheUpdators/upsertWord';
import { updateCacheWithUpsertWordDefinition } from '../cacheUpdators/upsertWordDefinition';

import { useTr } from './useTr';

export function useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation(
    {
      update(cache, { data, errors }) {
        if (
          !errors &&
          data &&
          data.upsertWordDefinitionFromWordAndDefinitionlikeString
            .word_definition &&
          data.upsertWordDefinitionFromWordAndDefinitionlikeString.error ===
            ErrorType.NoError
        ) {
          const newDefinition =
            data.upsertWordDefinitionFromWordAndDefinitionlikeString
              .word_definition;

          updateCacheWithUpsertWord(cache, newDefinition.word);
          updateCacheWithUpsertWordDefinition(cache, newDefinition);

          present({
            message: tr('Success at creating a new word and word definition!'),
            duration: 1500,
            position: 'top',
            color: 'success',
          });
        } else {
          console.log(
            'useUpsertWordDefinitionFromWordAndDefinitionlikeStringMutation: ',
            errors,
          );
          console.log(
            data?.upsertWordDefinitionFromWordAndDefinitionlikeString.error,
          );

          present({
            message: `${tr(
              'Failed at creating a new word and word definition!',
            )} [${data?.upsertWordDefinitionFromWordAndDefinitionlikeString
              .error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });
        }
      },
    },
  );
}
