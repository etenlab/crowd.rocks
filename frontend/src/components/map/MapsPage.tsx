import { MapList } from './MapList/MapsList';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { MapWordsList } from './MapWordsTranslation/MapWordsList';
import { MapDetails } from './MapDetails/MapDetails';
import { PageLayout } from '../common/PageLayout';
import { MapWordOrPhraseTranslation } from './MapWordOrPhraseTranslation/MapWordOrPhraseTranslantion';
import { useAppContext } from '../../hooks/useAppContext';
import { langInfo2tag } from '../../common/langUtils';

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
        path={`/:nation_id/:language_id/1/maps/translation`}
        component={MapWordsList}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/translate_word/:definition_id/:type`}
        component={MapWordOrPhraseTranslation}
      />
      <Route
        exact
        path={`/:nation_id/:language_id/1/maps/details/:id`}
        component={MapDetails}
      />
      <Route exact path={`/:nation_id/:language_id/1/maps/`}>
        <Redirect
          to={`/${match.params.nation_id}/${
            match.params.language_id
          }/1/maps/list/${langInfo2tag(targetLang || undefined)}`}
        />
      </Route>
    </PageLayout>
  );
};
