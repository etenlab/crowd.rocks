import {
  InputChangeEventDetail,
  InputCustomEvent,
  IonList,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect, useState } from 'react';
import {
  useGetAllMapsListLazyQuery,
  useIsAdminLoggedInLazyQuery,
  useMapUploadMutation,
} from '../../../generated/graphql';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { globals } from '../../../services/globals';
import { FilterContainer, Input } from '../../common/styled';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';

export const MapList: React.FC = () => {
  const router = useIonRouter();
  const { tr } = useTr();
  const [present] = useIonToast();
  const [filter, setFilter] = useState<string>('');

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

  const { makeMapThumbnail } = useMapTranslationTools();

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

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleAddMap = useCallback(
    async (file: File) => {
      if (!file) return;
      try {
        await sendMapFile({
          variables: { file },
          refetchQueries: ['GetAllMapsList'],
        });
        const thumbnail = await makeMapThumbnail(await file.text(), {
          toWidth: 100,
          toHeight: 100,
        });
        console.log('[thumbnail]', thumbnail);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        present({
          message: error.message,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
    [present, makeMapThumbnail, sendMapFile],
  );

  return (
    <>
      <Caption>{tr('Maps')}</Caption>

      <FilterContainer>
        <LangSelector
          title={tr('Select language')}
          langSelectorId="mapsListLangSelector"
          selected={targetLang ?? undefined}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setTargetLanguage(sourceLangInfo);
          }}
          onClearClick={() => setTargetLanguage(null)}
        />
        <Input
          type="text"
          label={tr('Search')}
          labelPlacement="floating"
          fill="outline"
          debounce={300}
          value={filter}
          onIonInput={handleFilterChange}
        />
      </FilterContainer>
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
          allMapsQuery?.getAllMapsList.allMapsList
            ?.filter((m) => {
              return m.map_file_name_with_langs
                .toLowerCase()
                .includes(filter.toLowerCase());
            })
            .sort((m1, m2) =>
              m1.map_file_name_with_langs.localeCompare(
                m2.map_file_name_with_langs,
              ),
            )
            .map((m, i) => <MapItem mapItem={m} key={i} />)
        ) : (
          <div> {tr('No maps found')} </div>
        )}
      </IonList>
    </>
  );
};
