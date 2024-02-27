import { useState, useEffect, ReactNode } from 'react';
import { useIonViewWillEnter, IonIcon } from '@ionic/react';
import {
  flashOutline,
  bookOutline,
  languageOutline,
  codeWorkingOutline,
  mapOutline,
  sendOutline,
  helpCircleOutline,
  logoGoogle,
  brushOutline,
  cogOutline,
  newspaperOutline,
  cloudUploadOutline,
  cutOutline,
  bookmarkOutline,
} from 'ionicons/icons';
import { Stack } from '@mui/material';
import { RouteComponentProps } from 'react-router';
import './Home.css';
import { useTr } from '../../hooks/useTr';
import { PageLayout } from '../common/PageLayout';
import { ISettings, globals } from '../../services/globals';
import { useIsAdminLoggedInLazyQuery } from '../../generated/graphql';
import { CardsMenu, CardsMenuItem } from '../common/CardsMenu/CardsMenu';

interface HomePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

interface ISubMenu
  extends Array<{
    isShown: () => boolean;
    link: string;
    icon: ReactNode;
    title: string;
    description: string;
  }> {}

interface IMenu
  extends Array<{
    isShown: () => boolean;
    group: string;
    subMenu: ISubMenu;
  }> {}

const Home: React.FC<HomePageProps> = ({ match }: HomePageProps) => {
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show_legal_menu, set_show_legal_menu] = useState(false);

  const settings: ISettings = globals.get_settings();
  const user_id = globals.get_user_id();

  const [isAdmin, { data: isAdminRes }] = useIsAdminLoggedInLazyQuery();

  useEffect(() => {
    if (user_id) {
      isAdmin({ variables: { input: { user_id: user_id + '' } } });
    }
  }, [isAdmin, user_id]);

  useEffect(() => {
    if (isAdminRes && isAdminRes.loggedInIsAdmin.isAdmin) {
      globals.set_admin_user();
    }
  }, [isAdminRes]);

  useIonViewWillEnter(() => {
    document.title = tr('Home');
  });

  const menu: IMenu = [
    {
      group: tr('Media'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/super-tool/documents`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={newspaperOutline}
            />
          ),
          title: tr('Crowd Sourcing Translation'),
          description: tr(
            'Upload a document, split into sections, translate sections, add questions and tags',
          ),
          isShown: () => true,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/maps`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={mapOutline}
            />
          ),
          title: tr('Maps'),
          description: tr('Translate maps into any language'),
          isShown: () => true,
        },

        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/documents`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={cloudUploadOutline}
            />
          ),
          title: tr('Documents'),
          description: tr(
            'Upload a document to use in other crowd sourcing tools',
          ),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/qa`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={helpCircleOutline}
            />
          ),
          title: tr('Question & Answer'),
          description: tr(
            'Annotate a text with questions so other users can provide answers',
          ),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/pericopies`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={cutOutline}
            />
          ),
          title: tr('Sectioning Tool'),
          description: tr('Split a document into sections'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/tagging-tool`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={brushOutline}
            />
          ),
          title: tr('Tagging Tool'),
          description: tr('Annotate a word or sentence with tags'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/pericope-translations`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={languageOutline}
            />
          ),
          title: tr('Translate Sections'),
          description: tr('Translate sections defined by sectioning tool'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/data-generator`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={cogOutline}
            />
          ),
          title: tr('Data Generator (For development only)'),
          description: tr('Generate fake data to test performance'),
          isShown: () =>
            !!isAdminRes?.loggedInIsAdmin.isAdmin &&
            import.meta.env.MODE !== 'production' &&
            !!settings?.isBetaTools,
        },
      ],
    },
    {
      group: tr('Community'),
      isShown: () => !!settings?.isBetaTools,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/forums`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={sendOutline}
            />
          ),
          title: tr('Forums'),
          description: tr('Hold discussions with other members'),
          isShown: () => !!settings?.isBetaTools,
        },
      ],
    },
    {
      group: tr('Language'),
      isShown: () => !!settings?.isBetaTools,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/grammar-tool`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={bookOutline}
            />
          ),
          title: tr('Grammar Tool'),
          description: tr('Draw Simple Grammar Diagrams'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-list`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={bookOutline}
            />
          ),
          title: tr('Dictionary'),
          description: tr('Manage the words and definitions in a language'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-list`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={bookmarkOutline}
            />
          ),
          title: tr('Phrase Book'),
          description: tr(
            'Manage the phrases and phrase definitions in a language',
          ),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/translation`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={languageOutline}
            />
          ),
          title: tr('Translation'),
          description: tr('Translate words and phrases into any language'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/fast-translation`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={flashOutline}
            />
          ),
          title: tr('Fast Translation'),
          description: tr('Translate words and phrases into any language'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/ai-controller`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={logoGoogle}
            />
          ),
          title: tr('AI Controller'),
          description: tr('Use our bots to translate words and phrases'),
          isShown: () =>
            !!settings?.isBetaTools && !!isAdminRes?.loggedInIsAdmin.isAdmin,
        },
      ],
    },
    {
      group: tr('User Interface'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/site-text-list`,
          icon: (
            <IonIcon
              style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px' }}
              size="large"
              icon={codeWorkingOutline}
            />
          ),
          title: tr('User Interface Translation'),
          description: tr('Help us translate this app into more languages'),
          isShown: () => true,
        },
      ],
    },
  ];

  const allMenuItems: {
    isShown: () => boolean;
    link: string;
    icon: ReactNode;
    title: string;
    description: string;
  }[] = [];

  menu.forEach((group) => {
    allMenuItems.push(...group.subMenu);
  });

  return (
    <PageLayout>
      {settings?.isBetaTools ? (
        menu.map(
          ({ group, isShown, subMenu }) =>
            isShown() && (
              <CardsMenu key={group} label={group} items={subMenu} />
            ),
        )
      ) : (
        <Stack>
          {allMenuItems.map((item) => (
            <CardsMenuItem item={item} key={item.title} />
          ))}
        </Stack>
      )}

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
                    <IonIcon style={{ color: '#476FFF', minWidth: '25px', maxWidth: '25px'}} style={{ color: '#476FFF', marginTop: 50px'}} icon={add}></IonIcon>
                  </IonFabButton>
                </IonFab> */}
        </div>

        {show_legal_menu && (
          <div>
            <div>
              <a href="https://app.termly.io/document/terms-of-use-for-website/[todo]">
                {tr('Terms of Service')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/cookie-policy/[todo]">
                {tr('Cookie Policy')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/acceptable-use-policy/[todo]">
                {tr('Acceptable Use Policy')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/disclaimer/[todo]">
                {tr('Disclaimer')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/eula/[todo]">
                {tr('EULA')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/privacy-policy/[todo]">
                {tr('Privacy Policy')}
              </a>
            </div>
            <div>
              <a href="https://app.termly.io/notify/[todo]">
                {tr('Do Not Sell or Share My Personal information')}
              </a>
            </div>
          </div>
        )}

        {/* <div
                className="home-footer-legal-button clickable"
                onClick={() => {
                  set_show_legal_menu((_show_legal_menu) => !_show_legal_menu);
                }}
              >
                {tr('Legal')}
              </div> */}
      </div>
    </PageLayout>
  );
};

export default Home;
