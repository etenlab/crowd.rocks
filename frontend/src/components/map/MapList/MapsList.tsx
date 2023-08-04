import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect, useState } from 'react';
import {
  useGetAllMapsListLazyQuery,
  useMapUploadMutation,
} from '../../../generated/graphql';
import { styled } from 'styled-components';
import { LangSelector } from '../../common/LangSelector/LangSelector';

export const MapList: React.FC = () => {
  const router = useIonRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendMapFile, { data: uploadResult }] = useMapUploadMutation();
  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery({
    fetchPolicy: 'no-cache',
  });
  const [mapListLang, setMapListLang] = useState<LanguageInfo>();

  useEffect(() => {
    const variables = mapListLang?.lang
      ? {
          lang: {
            language_code: mapListLang.lang.tag,
            dialect_code: mapListLang?.dialect?.tag,
            geo_code: mapListLang?.region?.tag,
          },
        }
      : undefined;

    getAllMapsList({ variables });
  }, [getAllMapsList, mapListLang]);

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;
      sendMapFile({ variables: { file }, refetchQueries: ['GetAllMapsList'] });
    },
    [sendMapFile],
  );

  return (
    <>
      <Caption>Maps</Caption>

      <LangSelectorBox>
        <LangSelector
          title="Select language"
          langSelectorId="mapsListLangSelector"
          selected={mapListLang}
          onChange={(mapListLangTag, mapListLangInfo) => {
            setMapListLang(mapListLangInfo);
          }}
          onClearClick={() => setMapListLang(undefined)}
        ></LangSelector>
      </LangSelectorBox>
      <MapTools
        onFilterClick={() => {
          alert('click on filter mock');
        }}
        onTranslationsClick={() => {
          router.push(`/US/eng/1/maps/translation`);
        }}
        onAddClick={handleAddMap}
      />
      <IonList lines="none">
        {allMapsQuery?.getAllMapsList.allMapsList?.length ? (
          allMapsQuery?.getAllMapsList.allMapsList?.map((m, i) => (
            <MapItem mapItem={m} key={i}></MapItem>
          ))
        ) : (
          <div> No maps found </div>
        )}
      </IonList>
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;
