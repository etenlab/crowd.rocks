import { ApolloCache } from '@apollo/client';
import {
  Post,
  PostsByParentDocument,
  PostsByParentQuery,
} from '../generated/graphql';

export function updateCacheWithCreatePost(
  cache: ApolloCache<unknown>,
  data: {
    newPost: Post;
    parent_id: string;
    parent: string;
  },
) {
  const { newPost, parent_id, parent } = data;
  console.log('updating cache');
  cache.updateQuery<PostsByParentQuery>(
    {
      query: PostsByParentDocument,
      variables: {
        parent: parent,
        parent_id: parent_id + '',
      },
    },
    (data) => {
      if (data && data.postsByParent.posts) {
        const alreadyExists = data.postsByParent.posts.filter((post) => {
          return post?.post_id === newPost.post_id;
        });

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          postsByParent: {
            ...data.postsByParent,
            posts: [
              ...data.postsByParent.posts,
              {
                ...newPost,
                __typename: 'Post',
              } as Post,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
