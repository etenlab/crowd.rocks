import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import {
  usePasswordResetFormRequestMutation,
  useResetEmailRequestMutation,
} from "../../generated/graphql";
import "./ResetEmailRequest.css";

interface PasswordResetFormProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    token: string;
  }> {}

const PasswordResetFormPage: React.FC<PasswordResetFormProps> = ({ match }) => {
  let history = useHistory();
  const [password, set_password] = useState("");
  const [show_response, set_show_response] = useState(false);

  const [passwordResetFormMutation, { data, loading, error }] =
    usePasswordResetFormRequestMutation();

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await passwordResetFormMutation({
        variables: {
          token: match.params.token,
          password,
        },
      });
    } catch (e) {
      console.error("error", e);
    }

    const error = result?.data?.passwordResetFormResolver.error;

    set_show_response(true);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>Reset Password</h1>

            <form onSubmit={(event) => handle_submit(event)}>
              <IonItem counter={true}>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  inputmode="text"
                  minlength={1}
                  maxlength={512}
                  onIonChange={(e) => set_password(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              {show_response && <div>Your password has been reset</div>}

              {!show_response && (
                <IonButton type="submit" color="primary">
                  Reset Password
                </IonButton>
              )}
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PasswordResetFormPage;
