import { useEffect, useCallback } from 'react';
import { IonButton, useIonToast } from '@ionic/react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useEmailResponseMutation } from '../../generated/graphql';

import { PageLayout } from '../common/PageLayout';

import { useTr } from '../../hooks/useTr';

import './EmailResponse.css';

interface EmailResponsePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    token: string;
  }> {}

// eslint-disable-next-line react/prop-types
const EmailResponsePage: React.FC<EmailResponsePageProps> = ({ match }) => {
  const history = useHistory();
  const { tr } = useTr();
  const [present] = useIonToast();

  const [emailResponseMutation] = useEmailResponseMutation();

  const presentToast = useCallback(
    (position: 'top' | 'middle' | 'bottom') => {
      present({
        message: tr('Thank you!'),
        duration: 4000,
        position: position,
      });
    },
    [present, tr],
  );

  const send_token = useCallback(async () => {
    // eslint-disable-next-line react/prop-types
    if (match.params.token === null) return;

    let result;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = await emailResponseMutation({
        variables: {
          // eslint-disable-next-line react/prop-types
          token: match.params.token,
        },
      });

      presentToast('bottom');
    } catch (e) {
      console.error('error', e);
    }
    // eslint-disable-next-line react/prop-types
  }, [match.params.token, emailResponseMutation, presentToast]);

  useEffect(() => {
    send_token();
  }, [send_token]);

  const click_go_home = () => {
    history.push(
      // eslint-disable-next-line react/prop-types
      `/${match.params.nation_id}/${match.params.language_id}/1/home`,
    );
  };

  return (
    <PageLayout>
      <div>{tr('Your response has been processed.')}</div>
      <div>
        <IonButton onClick={click_go_home}>{tr('Home')}</IonButton>
      </div>
    </PageLayout>
  );
};

export default EmailResponsePage;
