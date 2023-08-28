import { MapList } from './MapList/MapsList';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';
import { MapWordsTranslation } from './MapWordsTranslation/MapWordsTranslation';
import { MapTranslatedDetails } from './MapDetails/MapTranslatedDetails';
import { PageLayout } from '../common/PageLayout';

interface MapsPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export const MapsPage: React.FC<MapsPageProps> = ({ match }: MapsPageProps) => {
  return (
    <PageLayout>
      <Route
        exact
        path={`/${match.params.nation_id}/${match.params.language_id}/1/maps/list`}
        component={MapList}
      />
      <Route
        exact
        path={`/${match.params.nation_id}/${match.params.language_id}/1/maps/translation`}
        component={MapWordsTranslation}
      />
      <Route
        exact
        path={`/${match.params.nation_id}/${match.params.language_id}/1/maps/details-original/:id`}
        component={MapDetails}
      />
      <Route
        exact
        path={`/${match.params.nation_id}/${match.params.language_id}/1/maps/details-translated/:id`}
        component={MapTranslatedDetails}
      />
      <Route
        exact
        path={`/${match.params.nation_id}/${match.params.language_id}/1/maps`}
      >
        <Redirect
          to={`/${match.params.nation_id}/${match.params.language_id}/1/maps/list`}
        />
      </Route>
    </PageLayout>
  );
};
