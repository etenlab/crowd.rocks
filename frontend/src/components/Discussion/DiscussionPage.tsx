import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useTr } from '../../hooks/useTr';
import { Caption } from '../common/Caption/Caption';
import { AddListHeader } from '../common/ListHeader';
import { PageLayout } from '../common/PageLayout';
import { CaptionContainer, CardContainer } from '../common/styled';
import {
  ErrorType,
  User,
  usePostsByParentLazyQuery,
} from '../../generated/graphql';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Post } from './Post';
import { NewPostForm } from './NewPostForm/NewPostForm';

interface DiscussionPageProps
  extends RouteComponentProps<{
    parent: string;
    parent_id: string;
  }> {}

export function DiscussionPage({ match }: DiscussionPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();
  const [isAdding, set_is_adding] = useState(false);

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
    }[] = [];

    const allPosts = postData.postsByParent.posts;

    if (allPosts) {
      for (const post of allPosts) {
        if (post) {
          console.log(post.created_at);
          tempPosts.push({
            content: post.content,
            created_by_user: post.created_by_user,
            created_at: new Date(post.created_at).toDateString(),
            id: post.post_id,
          });
        }
      }
      return tempPosts.map((post) => (
        <CardContainer key={post.id}>
          <Post
            created_by={post.created_by_user.avatar}
            created_at={post.created_at}
            chatContent={
              <div
                dangerouslySetInnerHTML={{ __html: `${post.content}` }}
              ></div>
            }
          />
        </CardContainer>
      ));
    } else {
      return null;
    }
  }, [postData, postError]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption handleBackClick={() => router.goBack()}>
          {tr('Discussion')}
        </Caption>
      </CaptionContainer>
      <IonTitle>{postData?.postsByParent.title}</IonTitle>
      <AddListHeader
        title={tr('Posts')}
        onClick={() => {
          set_is_adding(true);
        }}
      />
      {postsComp}
      <IonModal isOpen={isAdding}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Post')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <NewPostForm
            parent={match.params.parent}
            parent_id={match.params.parent_id}
            onCancel={() => set_is_adding(false)}
            onCreated={() => set_is_adding(false)}
          />
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
