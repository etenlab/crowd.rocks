import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { PageLayout } from '../common/PageLayout';

import { MapList } from './MapList/MapsList';
import { MapDetails } from './MapDetails/MapDetails';
import { MapView } from './MapDetails/MapView';

import { MapWordsList } from './MapWordsTranslation/MapWordsList';
import { MapWordOrPhraseTranslation } from './MapWordOrPhraseTranslation/MapWordOrPhraseTranslantion';
import { MapNewTranslationConfirm } from './MapWordsTranslation/MapNewTranslationConfirm';

import { useAppContext } from '../../hooks/useAppContext';

import { langInfo2tag } from '../../../../utils';

interface MapsPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export const MapsPage: React.FC<MapsPageProps> = ({ match }: MapsPageProps) => {
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();
  return (
    <PageLayout>
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/list/:lang_full_tag?`}
        component={MapList}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/translation/:id`}
        component={MapWordsList}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/translate_word/:definition_id/:type`}
        component={MapWordOrPhraseTranslation}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/translation_confirm/:definition_id/:type`}
        component={MapNewTranslationConfirm}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/details/:id`}
        component={MapDetails}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/detail_view/:id`}
        component={MapView}
      />
      <Route exact path={`/:nation_id/:language_id/1/maps/`}>
        <Redirect
          to={`/${match.params.nation_id}/${
            match.params.language_id
          }/1/maps/list/${targetLang ? langInfo2tag(targetLang) : 'en'}`}
        />
      </Route>
    </PageLayout>
  );
};
