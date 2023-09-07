import { ApolloCache } from '@apollo/client';

import { Forum, GetForumsDocument, GetForumsQuery } from '../generated/graphql';

export function updateCacheWithUpdateForum(
  cache: ApolloCache<unknown>,
  updatedForum: Forum,
) {
  cache.updateQuery<GetForumsQuery>(
    {
      query: GetForumsDocument,
    },
    (data) => {
      if (data) {
        const updatedForums = data.forums.forums.map((forum) => {
          if (forum.forum_id != updatedForum.forum_id) return forum;
          return {
            ...updatedForum,
          };
        });

        return {
          ...data,
          forums: {
            ...data.forums,
            forums: [...updatedForums],
          },
        };
      } else {
        return data;
      }
    },
  );
}

export function updateCacheWithCreateForum(
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
