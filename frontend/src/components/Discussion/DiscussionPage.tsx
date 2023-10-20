import { RouteComponentProps } from 'react-router';
import { IonTitle, useIonRouter } from '@ionic/react';
import { useTr } from '../../hooks/useTr';
import { Caption } from '../common/Caption/Caption';
import { AddListHeader } from '../common/ListHeader';
import { PageLayout } from '../common/PageLayout';
import { CardContainer } from '../common/styled';
import {
  ErrorType,
  User,
  usePostsByParentLazyQuery,
} from '../../generated/graphql';
import { useEffect, useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Post } from './Post';
import { useAppContext } from '../../hooks/useAppContext';
import { PostModal } from './PostModal';

interface DiscussionPageProps
  extends RouteComponentProps<{
    parent: string;
    parent_id: string;
  }> {}

export function DiscussionPage({ match }: DiscussionPageProps) {
  const {
    actions: { createModal },
  } = useAppContext();
  const { openModal, closeModal } = createModal();
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [getPostsByParent, { data: postData, error: postError }] =
    usePostsByParentLazyQuery();

  useEffect(() => {
    getPostsByParent({
      variables: {
        parent_id: match.params.parent_id,
        parent_name: match.params.parent,
      },
    });
  }, [getPostsByParent, match.params.parent, match.params.parent_id]);

  const postsComp = useMemo(() => {
    if (postError) return null;

    if (!postData || postData.postsByParent.error !== ErrorType.NoError) {
      return null;
    }

    const tempPosts: {
      content: string;
      created_by_user: User;
      created_at: string;
      id: string;
      file_url?: string | null;
      file_type?: string | null;
    }[] = [];

    const allPosts = postData.postsByParent.posts;

    if (allPosts) {
      for (const post of allPosts) {
        if (post) {
          tempPosts.push({
            content: post.content,
            created_by_user: post.created_by_user,
            created_at: new Date(post.created_at).toDateString(),
            id: post.post_id,
            file_url: post.file_url,
            file_type: post.file_type,
          });
        }
      }
      return tempPosts.map((post) => (
        <CardContainer key={post.id}>
          <Post
            author={{
              username: post.created_by_user.avatar,
              avatar: post.created_by_user.avatar_url + '',
              createdAt: new Date(post.created_at),
            }}
            chatContent={
              <div
                dangerouslySetInnerHTML={{ __html: `${post.content}` }}
              ></div>
            }
            av_file_url={post.file_url}
            av_file_type={post.file_type}
          />
        </CardContainer>
      ));
    } else {
      return null;
    }
  }, [postData, postError]);

  const handleOpenModal = () => {
    openModal(
      <PostModal
        onClose={closeModal}
        parent={match.params.parent}
        parentId={match.params.parent_id}
      />,
      'full',
    );
  };

  return (
    <PageLayout>
      <Caption handleBackClick={() => router.goBack()}>
        {tr('Discussion')}
      </Caption>

      <IonTitle>{postData?.postsByParent.title}</IonTitle>
      <AddListHeader
        title={tr('Posts')}
        onClick={() => {
          handleOpenModal();
        }}
      />
      {postsComp}
    </PageLayout>
  );
}
