import { useIonToast } from '@ionic/react';

import { useWordDefinitionUpsertMutation as useGeneratedWordDefinitionUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertWordDefinition } from '../cacheUpdators/upsertWordDefinition';

import { useTr } from '../hooks/useTr';

export function useWordDefinitionUpsertMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedWordDefinitionUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.wordDefinitionUpsert.word_definition &&
        data.wordDefinitionUpsert.error === ErrorType.NoError
      ) {
        const newDefinition = data.wordDefinitionUpsert.word_definition;

        updateCacheWithUpsertWordDefinition(cache, newDefinition);

        present({
          message: tr('Success at creating new word!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useWordDefinitionUpsertMutation: ', errors);
        console.log(data?.wordDefinitionUpsert.error);

        present({
          message: `${tr('Failed at creating new word definition!')} [${data
            ?.wordDefinitionUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
