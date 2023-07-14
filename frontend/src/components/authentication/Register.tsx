import { useMutation } from "@apollo/client";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { useHistory } from "react-router";
import result, {
  ErrorType,
  useRegisterMutation,
} from "../../generated/graphql";
import { globals } from "../../services/globals";
import { login_change } from "../../services/subscriptions";
import "./Register.css";

const Register: React.FC = () => {
  let history = useHistory();

  useIonViewWillEnter(() => {
    document.title = "Register";
  });

  const [email, set_email] = useState("");
  const [avatar, set_avatar] = useState("");
  const [password, set_password] = useState("");

  const [is_email_too_long, set_is_email_too_long] = useState(false);
  const [is_email_too_short, set_is_email_too_short] = useState(false);
  const [is_email_invalid, set_is_email_invalid] = useState(false);
  const [is_avatar_too_long, set_is_avatar_too_long] = useState(false);
  const [is_avatar_too_short, set_is_avatar_too_short] = useState(false);
  const [is_avatar_unavailable, set_is_avatar_unavailable] = useState(false);
  const [is_password_too_long, set_is_password_too_long] = useState(false);
  const [is_password_too_short, set_is_password_too_short] = useState(false);
  const [is_unknown_error, set_is_unknown_error] = useState(false);

  const [registerMutation, { data, loading, error }] = useRegisterMutation();

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await registerMutation({
        variables: {
          email,
          password,
          avatar,
        },
        errorPolicy: "all",
      });
    } catch (e) {}

    const error = result?.data?.register.error;

    set_is_email_too_long(false);
    set_is_email_too_short(false);
    set_is_email_invalid(false);
    set_is_avatar_too_long(false);
    set_is_avatar_too_short(false);
    set_is_avatar_unavailable(false);
    set_is_password_too_long(false);
    set_is_password_too_short(false);

    if (error === ErrorType.NoError) {
      set_avatar("");
      set_email("");
      set_password("");
      const session = result?.data?.register.session!;
      globals.set_token(session.token);
      globals.set_user_id(+session.user_id);
      globals.set_avatar(session.avatar);
      if (session.profile_url) {
        globals.set_profile_url(session.profile_url);
      }

      login_change.next(true);
      history.push("/US/eng/1/home");
      return;
    } else if (error === ErrorType.EmailTooLong) {
      set_is_email_too_long(true);
    } else if (error === ErrorType.EmailTooShort) {
      set_is_email_too_short(true);
    } else if (error === ErrorType.EmailInvalid) {
      set_is_email_invalid(true);
    } else if (error === ErrorType.AvatarTooLong) {
      set_is_avatar_too_long(true);
    } else if (error === ErrorType.AvatarTooShort) {
      set_is_avatar_too_short(true);
    } else if (error === ErrorType.AvatarUnavailable) {
      set_is_avatar_unavailable(true);
    } else if (error === ErrorType.PasswordTooLong) {
      set_is_password_too_long(true);
    } else if (error === ErrorType.PasswordTooShort) {
      set_is_password_too_short(true);
    } else if (error === ErrorType.UnknownError) {
      set_is_unknown_error(true);
    } else {
      set_is_unknown_error(true);
      console.error(error);
    }
  }


  const click_login = () => {
    history.push("/US/eng/1/login");
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>Register</h1>
            <form onSubmit={(event) => handle_submit(event)}>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  value={email}
                  inputmode="email"
                  minlength={4}
                  maxlength={255}
                  onIonChange={(e) => set_email(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              {is_email_too_long && <div>Email too long</div>}
              {is_email_too_short && <div>Email too short</div>}
              {is_email_invalid && <div>Email Invalid</div>}

              <IonItem counter={true}>
                <IonLabel position="floating">Avatar</IonLabel>
                <IonInput
                  value={avatar}
                  inputmode="text"
                  minlength={1}
                  maxlength={64}
                  onIonChange={(e) => set_avatar(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              {is_avatar_too_long && <div>Avatar too long</div>}
              {is_avatar_too_short && <div>Avatar too short</div>}
              {is_avatar_unavailable && <div>Avatar Unavailable</div>}
              <IonItem counter={true}>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  minlength={8}
                  maxlength={128}
                  onIonChange={(e) => set_password(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              {is_password_too_long && <div>Password too long</div>}
              {is_password_too_short && <div>Password too short</div>}

              <IonButton type="submit" color="primary">
                Register
              </IonButton>
            </form>

            <br />
            
            <IonButton
              type="button"
              color="primary"
              fill="clear"
              onClick={click_login}
            >
              Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
