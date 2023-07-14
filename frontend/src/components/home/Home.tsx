import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  add,
  book,
  bookOutline,
  chatbubbleEllipsesOutline,
  codeWorkingOutline,
  mapOutline,
  searchCircle,
  searchCircleOutline,
  searchOutline,
} from "ionicons/icons";
import { FormEvent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import {
  ErrorType,
} from "../../generated/graphql";
import { globals } from "../../services/globals";
import { map } from 'ionicons/icons';
import "./Home.css";

interface HomePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> { }

const Home: React.FC<HomePageProps> = ({ match }) => {
  const router = useIonRouter();

  const [show_legal_menu, set_show_legal_menu] = useState(false);

  useIonViewWillEnter(() => {
    document.title = "Home";
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>
                  Media</IonLabel>
              </IonItemDivider>

              <IonItem lines='none'>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={mapOutline}></IonIcon>
                      <IonText>

                        Maps
                      </IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>Upload .svg files and translate all their text into another language</IonCardSubtitle>
                  </IonCardHeader>

                </IonCard>
              </IonItem>

            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Language</IonLabel>
              </IonItemDivider>

              <IonItem lines='none'>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={bookOutline}></IonIcon>
                      <IonText>
                        Dictionary
                      </IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>Manage the words and definitions in a language</IonCardSubtitle>
                  </IonCardHeader>

                </IonCard>           
             </IonItem>

              <IonItem lines='none'>
                <IonCard onClick={() => console.log('asdf')}>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={chatbubbleEllipsesOutline}></IonIcon>
                      <IonText>
                        Phrase Book
                      </IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>Helpful phrases in a lanuage</IonCardSubtitle>
                  </IonCardHeader>
                </IonCard>            
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>User Interface</IonLabel>
              </IonItemDivider>

              <IonItem lines='none'>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={codeWorkingOutline}></IonIcon>
                      <IonText>

                        Site Text Strings
                      </IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>Help us translate this app into more languages</IonCardSubtitle>
                  </IonCardHeader>

                </IonCard>
              </IonItem>

            </IonItemGroup>

            <div className="home-footer">
              <div className="ion-text-end">
                {/* <IonFab className="home-footer-create-button-wrap">
                  <IonFabButton
                    onClick={() => {
                      if (globals.get_user_id()) {
                        // old code was here
                      } else {
                        router.push(
                          `/${match.params.nation_id}/${match.params.language_id}/1/login`
                        );
                      }
                    }}
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </IonFab> */}
              </div>

              {show_legal_menu && (
                <div>
                  <div>
                    <a href="https://app.termly.io/document/terms-of-use-for-website/[todo]">
                      Terms of Service
                    </a>
                  </div>

                  <div>
                    <a href="https://app.termly.io/document/cookie-policy/[todo]">
                      Cookie Policy
                    </a>
                  </div>

                  <div>
                    <a href="https://app.termly.io/document/acceptable-use-policy/[todo]">
                      Acceptable Use Policy
                    </a>
                  </div>

                  <div>
                    <a href="https://app.termly.io/document/disclaimer/[todo]">
                      Disclaimer
                    </a>
                  </div>

                  <div>
                    <a href="https://app.termly.io/document/eula/[todo]">
                      EULA
                    </a>
                  </div>

                  <div>
                    <a href="https://app.termly.io/document/privacy-policy/[todo]">
                      Privacy Policy
                    </a>
                  </div>
                  <div>
                    <a href="https://app.termly.io/notify/[todo]">
                      Do Not Sell or Share My Personal information
                    </a>
                  </div>
                </div>
              )}

              <div
                className="home-footer-legal-button clickable"
                onClick={() => {
                  set_show_legal_menu(!show_legal_menu);
                }}
              >
                Legal
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
