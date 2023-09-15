import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  isPlatform,
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
import { AudioRecorder } from './AudioRecorder/AudioRecorder';
import { VideoRecorder } from './VideoRecorder';
import { ISettings, globals } from '../../services/globals';

interface DiscussionPageProps
  extends RouteComponentProps<{
    parent: string;
    parent_id: string;
    page_title: string;
  }> {}

type PostKind = 'video' | 'audio' | 'text';

export function DiscussionPage({ match }: DiscussionPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();
  const [isAdding, set_is_adding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [getPostsByParent, { data: postData, error: postError }] =
    usePostsByParentLazyQuery();

  const [postKind, setPostKind] = useState<PostKind>();

  const settings: ISettings = globals.get_settings();

  useEffect(() => {
    getPostsByParent({
      variables: {
        parent_id: match.params.parent_id,
        parent_name: match.params.parent,
      },
    });
  }, [getPostsByParent, match.params.parent, match.params.parent_id]);

  const addPostMenuComp = useMemo(() => {
    if (settings.isSign) {
      setPostKind('video');
    }
    return (
      !settings.isSign && (
        <IonSegment>
          {!settings.isOral && (
            <IonSegmentButton onClick={() => setPostKind('text')} value="text">
              <IonLabel>Text</IonLabel>
            </IonSegmentButton>
          )}
          <IonSegmentButton onClick={() => setPostKind('video')} value="video">
            <IonLabel>Video</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton onClick={() => setPostKind('audio')} value="audio">
            <IonLabel>Audio</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      )
    );
  }, [settings.isOral, settings.isSign]);

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
            created_by={post.created_by_user.avatar}
            created_at={post.created_at}
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

  const handleCancel = () => {
    set_is_adding(false);
    setPostKind(undefined);
  };

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption handleBackClick={() => router.goBack()}>
          {tr('Discussion')}
        </Caption>
      </CaptionContainer>
      <IonTitle>{match.params.page_title}</IonTitle>
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
          <div style={{ paddingTop: '10px' }}>{addPostMenuComp}</div>

          {postKind === 'text' && (
            <NewPostForm
              parent={match.params.parent}
              parent_id={match.params.parent_id}
              onCancel={() => handleCancel()}
              onCreated={() => handleCancel()}
            />
          )}
          {postKind === 'video' &&
            (isPlatform('mobileweb') ||
              isPlatform('pwa') ||
              isPlatform('desktop')) && (
              <VideoRecorder
                onCancel={() => handleCancel()}
                onCreated={() => handleCancel()}
                parent={match.params.parent}
                parent_id={match.params.parent_id}
              />
            )}
          {postKind === 'audio' &&
            (isPlatform('mobileweb') ||
              isPlatform('pwa') ||
              isPlatform('desktop')) && (
              <AudioRecorder
                onCancel={() => handleCancel()}
                onCreated={() => handleCancel()}
                parent={match.params.parent}
                parent_id={match.params.parent_id}
              />
            )}
          {!postKind && (
            <p style={{ textAlign: 'center' }}>Please select a post type</p>
          )}
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
