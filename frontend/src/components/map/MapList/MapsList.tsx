import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect } from 'react';
import {
  useGetAllMapsListLazyQuery,
  useMapUploadMutation,
} from '../../../generated/graphql';
import { styled } from 'styled-components';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

export const MapList: React.FC = () => {
  const router = useIonRouter();
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendMapFile, { data: uploadResult }] = useMapUploadMutation();
  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery({
    fetchPolicy: 'no-cache',
  });
  //const [mapListLang, setMapListLang] = useState<LanguageInfo>();
  //console.log(mapListLang);

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
