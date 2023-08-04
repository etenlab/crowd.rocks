import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from '@ionic/react';
import { FormEvent, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useResetEmailRequestMutation } from '../../generated/graphql';
import './ResetEmailRequest.css';

import { useTr } from '../../hooks/useTr';

interface ResetEmailRequestProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

const ResetEmailRequestPage: React.FC<ResetEmailRequestProps> = () => {
  const { tr } = useTr();

  const [email, set_email] = useState('');
  const [show_response, set_show_response] = useState(false);

  const [resetEmailRequestMutation] = useResetEmailRequestMutation();

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await resetEmailRequestMutation({
        variables: {
          email,
        },
      });
    } catch (e) {
      console.error('error', e);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const error = result?.data?.resetEmailRequest.error;

    set_show_response(true);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>{tr('Request a Password Reset')}</h1>

            <form onSubmit={(event) => handle_submit(event)}>
              <IonItem counter={true}>
                <IonLabel position="floating">{tr('Email')}</IonLabel>
                <IonInput
                  value={email}
                  inputmode="email"
                  minlength={1}
                  maxlength={512}
                  onIonChange={(e) => set_email(e.detail.value!)}
                  required
                />
              </IonItem>

              {show_response && (
                <div>
                  {tr(
                    'If your email exists in our database a reset link has been sent.',
                  )}
                </div>
              )}

              {!show_response && (
                <IonButton type="submit" color="primary">
                  {tr('Send Password Reset Email')}
                </IonButton>
              )}
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetEmailRequestPage;
