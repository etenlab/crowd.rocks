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
import { useResetEmailRequestMutation } from "../../generated/graphql";
import "./ResetEmailRequest.css";

interface ResetEmailRequestProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

const ResetEmailRequestPage: React.FC<ResetEmailRequestProps> = ({ match }) => {
  let history = useHistory();
  const [email, set_email] = useState("");
  const [show_response, set_show_response] = useState(false);

  const [resetEmailRequestMutation, { data, loading, error }] =
    useResetEmailRequestMutation();

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
      console.error("error", e);
    }

    const error = result?.data?.resetEmailRequest.error;

    set_show_response(true);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>Request a Password Reset</h1>

            <form onSubmit={(event) => handle_submit(event)}>
              <IonItem counter={true}>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  value={email}
                  inputmode="email"
                  minlength={1}
                  maxlength={512}
                  onIonChange={(e) => set_email(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>

              {show_response && (
                <div>
                  If your email exists in our database a reset link has been
                  sent.
                </div>
              )}

              {!show_response && (
                <IonButton type="submit" color="primary">
                  Send Password Reset Email
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
