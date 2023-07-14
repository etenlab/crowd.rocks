import { IonButton, IonContent, IonPage, useIonToast } from "@ionic/react";
import { useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { useEmailResponseMutation } from "../../generated/graphql";

import "./EmailResponse.css";

interface EmailResponsePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    token: string;
  }> {}

const EmailResponsePage: React.FC<EmailResponsePageProps> = ({ match }) => {
  let history = useHistory();
  const [present] = useIonToast();

  const [emailResponseMutation, { data, loading, error }] =
    useEmailResponseMutation();

  useEffect(() => {
    send_token();
  }, []);

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Thank you!",
      duration: 4000,
      position: position,
    });
  };

  const send_token = async () => {
    if (match.params.token === null) return;

    let result;
    try {
      result = await emailResponseMutation({
        variables: {
          token: match.params.token,
        },
      });

      // presentToast("bottom");
    } catch (e) {
      console.error("error", e);
    }
  };

  const click_go_home = () => {
    history.push(
      `/${match.params.nation_id}/${match.params.language_id}/1/home`
    );
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <div>Your response has been processed.</div>
            <div>
              <IonButton onClick={click_go_home}>Home</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmailResponsePage;
