import { useIonToast } from '@ionic/react';
import { usePostCreateMutation as useGeneratedPostCreateMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithCreatePost } from '../cacheUpdators/createPost';

export function usePostCreateMutation({
  parent_name,
  parent_id,
}: {
  parent_name: string;
  parent_id: string;
}) {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedPostCreateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.postCreateResolver.post &&
        data.postCreateResolver.error === ErrorType.NoError
      ) {
        const newPost = data.postCreateResolver.post;

        updateCacheWithCreatePost(cache, { newPost, parent_name, parent_id });

        present({
          message: tr('Success at creating new post!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('usePostCreateMutation: ', errors);
        console.log(data?.postCreateResolver.error);

        present({
          message: `${tr('Failed at creating new word!')} [${data
            ?.postCreateResolver.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
