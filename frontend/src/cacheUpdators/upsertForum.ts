import { ApolloCache } from '@apollo/client';

import { Forum, GetForumsDocument, GetForumsQuery } from '../generated/graphql';

export function updateCacheWithUpsertForum(
  cache: ApolloCache<unknown>,
  newForum: Forum,
) {
  cache.updateQuery<GetForumsQuery>(
    {
      query: GetForumsDocument,
    },
    (data) => {
      if (data) {
        const alreadyExists = data.forums.forums.filter(
          (forum) => forum?.forum_id === newForum.forum_id,
        );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          forums: {
            ...data.forums,
            forums: [
              ...data.forums.forums,
              {
                ...newForum,
                __typename: 'Forum',
                created_at: new Date().toISOString(),
              },
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
