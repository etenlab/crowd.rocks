import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { apollo_client } from '../../main';
import { ErrorType, useLoginMutation } from '../../generated/graphql';
import { globals } from '../../services/globals';
import { login_change } from '../../services/subscriptions';
import './Login.css';

import { useTr } from '../../hooks/useTr';

const Login: React.FC = () => {
  const history = useHistory();
  const { tr } = useTr();

  useIonViewWillEnter(() => {
    document.title = tr('Login');
  });

  const [email, set_email] = useState('');
  const [password, set_password] = useState('');

  const [is_email_too_long, set_is_email_too_long] = useState(false);
  const [is_email_too_short, set_is_email_too_short] = useState(false);
  const [is_email_invalid, set_is_email_invalid] = useState(false);
  const [is_password_too_long, set_is_password_too_long] = useState(false);
  const [is_password_too_short, set_is_password_too_short] = useState(false);
  const [is_invalid_email_or_password, set_is_invalid_email_or_password] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [is_unknown_error, set_is_unknown_error] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginMutation, { data, loading, error }] = useLoginMutation();

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await loginMutation({
        variables: {
          email,
          password,
        },
        errorPolicy: 'all',
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}

    const error = result?.data?.login.error;

    set_is_email_too_long(false);
    set_is_email_too_short(false);
    set_is_email_invalid(false);
    set_is_password_too_long(false);
    set_is_password_too_short(false);
    set_is_invalid_email_or_password(false);

    if (error === ErrorType.NoError) {
      set_email('');
      set_password('');
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const session = result?.data?.login.session!;
      globals.set_token(session.token);
      globals.set_user_id(+session.user_id);
      globals.set_avatar(session.avatar);
      if (session.avatar_url) {
        globals.set_profile_url(session.avatar_url);
      }

      login_change.next(true);

      const redirect = localStorage.getItem('login-redirect');

      await apollo_client.clearStore();
      await apollo_client.resetStore();

      if (redirect === 'back') {
        localStorage.removeItem('login-redirect');
        history.goBack();
      } else {
        history.push('/US/eng/1/home');
      }

      return;
    } else if (error === ErrorType.EmailTooLong) {
      set_is_email_too_long(true);
    } else if (error === ErrorType.EmailTooShort) {
      set_is_email_too_short(true);
    } else if (error === ErrorType.EmailInvalid) {
      set_is_email_invalid(true);
    } else if (error === ErrorType.PasswordTooLong) {
      set_is_password_too_long(true);
    } else if (error === ErrorType.PasswordTooShort) {
      set_is_password_too_short(true);
    } else if (error === ErrorType.InvalidEmailOrPassword) {
      set_is_invalid_email_or_password(true);
    } else if (error === ErrorType.UnknownError) {
      set_is_unknown_error(true);
    } else {
      set_is_unknown_error(true);
      console.error(error);
    }
  }

  const click_reset_password = () => {
    history.push('/US/eng/1/reset-email-request');
  };

  const click_register = () => {
    history.push('/US/eng/1/register');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>{tr('Login')}</h1>

            <form onSubmit={(event) => handle_submit(event)}>
              <IonItem>
                <IonLabel position="floating">{tr('Email')}</IonLabel>
                <IonInput
                  value={email}
                  inputmode="email"
                  minlength={4}
                  maxlength={255}
                  onIonChange={(e) => set_email(e.detail.value!)}
                  required
                />
              </IonItem>

              {is_email_too_long && <div>{tr('Email too long')}</div>}
              {is_email_too_short && <div>{tr('Email too short')}</div>}
              {is_email_invalid && <div>{tr('Email Invalid')}</div>}

              <IonItem>
                <IonLabel position="floating">{tr('Password')}</IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  inputmode="text"
                  onIonChange={(e) => set_password(e.detail.value!)}
                  required
                />
              </IonItem>

              {is_password_too_long && <div>{tr('Password too long')}</div>}
              {is_password_too_short && <div>{tr('Password too short')}</div>}

              <br />

              <IonButton type="submit" color="primary">
                {tr('Login')}
              </IonButton>

              <br />
              <br />

              <IonButton
                type="button"
                color="primary"
                fill="clear"
                onClick={click_reset_password}
              >
                {tr('Reset Password')}
              </IonButton>

              <br />

              <IonButton
                type="button"
                color="primary"
                fill="clear"
                onClick={click_register}
              >
                {tr('Register')}
              </IonButton>

              {is_invalid_email_or_password && (
                <div>{tr('Invalid email or password')}</div>
              )}
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
