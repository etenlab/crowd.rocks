import { ApolloCache } from '@apollo/client';

import {
  Thread,
  GetThreadsDocument,
  GetThreadsQuery,
} from '../generated/graphql';

export function updateCacheWithUpsertThread(
  cache: ApolloCache<unknown>,
  newThread: Thread,
  folder_id: string,
) {
  cache.updateQuery<GetThreadsQuery>(
    {
      query: GetThreadsDocument,
      variables: {
        folder_id: folder_id,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists = data.threads.threads.filter(
          (thread) => thread?.thread_id === newThread.thread_id,
        );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          threads: {
            ...data.threads,
            threads: [
              ...data.threads.threads,
              {
                ...newThread,
                __typename: 'Thread',
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
