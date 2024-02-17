import { FormEvent, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

import { usePasswordResetFormRequestMutation } from '../../generated/graphql';
import './ResetEmailRequest.css';

import { PageLayout } from '../common/PageLayout';

import { useTr } from '../../hooks/useTr';

interface PasswordResetFormProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    token: string;
  }> {}

// eslint-disable-next-line react/prop-types
const PasswordResetFormPage: React.FC<PasswordResetFormProps> = ({ match }) => {
  const { tr } = useTr();

  const [password, set_password] = useState('');
  const [show_response, set_show_response] = useState(false);

  const [passwordResetFormMutation] = usePasswordResetFormRequestMutation();

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await passwordResetFormMutation({
        variables: {
          // eslint-disable-next-line react/prop-types
          token: match.params.token,
          password,
        },
      });
    } catch (e) {
      console.error('error', e);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const error = result?.data?.passwordResetFormResolver.error;

    set_show_response(true);
  }

  return (
    <PageLayout>
      <h1>{tr('Reset Password')}</h1>

      <form onSubmit={(event) => handle_submit(event)}>
        <IonItem counter={true}>
          <IonLabel position="floating">{tr('Password')}</IonLabel>
          <IonInput
            value={password}
            type="password"
            inputmode="text"
            minlength={1}
            maxlength={512}
            onIonChange={(e) => set_password(e.detail.value!)}
            required
          />
        </IonItem>

        {show_response && <div>{tr('Your password has been reset')}</div>}

        {!show_response && (
          <IonButton type="submit" color="primary">
            {tr('Reset Password')}
          </IonButton>
        )}
      </form>
    </PageLayout>
  );
};

export default PasswordResetFormPage;
