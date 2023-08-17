import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect } from 'react';
import {
  useGetAllMapsListLazyQuery,
  useIsAdminLoggedInLazyQuery,
  useMapUploadMutation,
} from '../../../generated/graphql';
import { styled } from 'styled-components';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { globals } from '../../../services/globals';

export const MapList: React.FC = () => {
  const router = useIonRouter();
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { targetLang, appLanguage },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [isAdmin, { data: isAdminRes }] = useIsAdminLoggedInLazyQuery();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendMapFile, { data: uploadResult }] = useMapUploadMutation();
  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery({
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    const user_id = globals.get_user_id();

    if (!user_id) return;

    const variables = { input: { user_id: String(user_id) } };
    isAdmin({ variables });
  }, [isAdmin]);

  useEffect(() => {
    const variables = targetLang?.lang
      ? {
          lang: {
            language_code: targetLang.lang.tag,
            dialect_code: targetLang?.dialect?.tag,
            geo_code: targetLang?.region?.tag,
          },
        }
      : undefined;

    getAllMapsList({ variables });
  }, [getAllMapsList, targetLang]);

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;
      sendMapFile({ variables: { file }, refetchQueries: ['GetAllMapsList'] });
    },
    [sendMapFile],
  );

  return (
    <>
      <Caption>{tr('Maps')}</Caption>

      <LangSelectorBox>
        <LangSelector
          title={tr('Select language')}
          langSelectorId="mapsListLangSelector"
          selected={targetLang ?? undefined}
          onChange={(_mapListLangTag, mapListLangInfo) => {
            setTargetLanguage(mapListLangInfo);
          }}
          onClearClick={() => setTargetLanguage(null)}
        />
      </LangSelectorBox>
      <MapTools
        onTranslationsClick={() => {
          router.push(`/US/${appLanguage.lang.tag}/1/maps/translation`);
        }}
        onAddClick={
          isAdminRes?.loggedInIsAdmin.isAdmin ? handleAddMap : undefined
        }
      />
      <IonList lines="none">
        {allMapsQuery?.getAllMapsList.allMapsList?.length ? (
          allMapsQuery?.getAllMapsList.allMapsList?.map((m, i) => (
            <MapItem mapItem={m} key={i} />
          ))
        ) : (
          <div> {tr('No maps found')} </div>
        )}
      </IonList>
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;
