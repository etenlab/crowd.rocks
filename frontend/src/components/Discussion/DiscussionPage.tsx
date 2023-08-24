import { RouteComponentProps } from 'react-router';
import { IonTitle, useIonRouter } from '@ionic/react';
import { useTr } from '../../hooks/useTr';
import { Caption } from '../common/Caption/Caption';
import { AddListHeader } from '../common/ListHeader';
import { PageLayout } from '../common/PageLayout';
import { CaptionContainer } from '../common/styled';

interface DiscussionPageProps
  extends RouteComponentProps<{
    title: string;
    subtitle: string;
  }> {}

export function DiscussionPage({ match }: DiscussionPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption handleBackClick={() => router.goBack()}>
          {tr('Discussion')}
        </Caption>
      </CaptionContainer>
      <IonTitle>
        {match.params.title} - {match.params.subtitle}
      </IonTitle>
      <AddListHeader
        title={tr('Posts')}
        onClick={() => {
          console.log('Add post clicked');
        }}
      />
    </PageLayout>
  );
}
