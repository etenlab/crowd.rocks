import {
  InputChangeEventDetail,
  InputCustomEvent,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ErrorType,
  MapFileOutput,
  useGetAllMapsListLazyQuery,
  useIsAdminLoggedInLazyQuery,
  useMapDeleteMutation,
  useMapUploadMutation,
  useMapsTranslationsResetMutation,
  useUploadFileMutation,
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
  const [sendMapFile] = useMapUploadMutation();
  const [uploadFile] = useUploadFileMutation();
  const [mapDelete] = useMapDeleteMutation();
  const [mapTranslationReset] = useMapsTranslationsResetMutation();

  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery({
    fetchPolicy: 'no-cache',
  });

  const { makeMapThumbnail } = useMapTranslationTools();
  const [isMapDeleteModalOpen, setIsMapDeleteModalOpen] = useState(false);
  const [isMapResetModalOpen, setIsMapResetModalOpen] = useState(false);
  const candidateForDeletion = useRef<MapFileOutput | undefined>();

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

  const addMap = useCallback(
    async (file: File) => {
      if (!file) return;
      try {
        const thumbnailFile = (await makeMapThumbnail(await file.text(), {
          toWidth: 100,
          toHeight: 100,
          asFile: `${file.name}-thmb`,
        })) as File;

        const uploadPreviewResult = await uploadFile({
          variables: {
            file: thumbnailFile,
            file_size: thumbnailFile.size,
            file_type: thumbnailFile.type,
          },
        });
        const previewFileId = uploadPreviewResult.data?.uploadFile.file?.id
          ? String(uploadPreviewResult.data?.uploadFile.file.id)
          : undefined;
        if (uploadPreviewResult.data?.uploadFile.error !== ErrorType.NoError) {
          throw new Error(uploadPreviewResult.data?.uploadFile.error);
        }

        const mapUploadResult = await sendMapFile({
          variables: {
            file,
            previewFileId,
          },
          refetchQueries: ['GetAllMapsList'],
        });

        if (
          mapUploadResult.errors?.length &&
          mapUploadResult.errors?.length > 0
        ) {
          throw new Error(JSON.stringify(mapUploadResult.errors));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        present({
          message: error.message,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
    [makeMapThumbnail, uploadFile, sendMapFile, present],
  );

  const deleteMap = <
    T extends {
      is_original: boolean;
      original_map_id?: string | null;
      translated_map_id?: string | null;
    },
  >(
    mapItem: T,
  ) => {
    const mapId = mapItem.is_original
      ? mapItem.original_map_id
      : mapItem.translated_map_id;
    if (!mapId) {
      console.error(
        `Error: original_map_id or translated_map_id isn't specified`,
      );
      return;
    }
    mapDelete({
      variables: {
        mapId,
        is_original: mapItem.is_original,
      },
      refetchQueries: ['GetAllMapsList'],
    });
  };

  const resetTranslatedMaps = () => {
    mapTranslationReset();
    // alert('boom');
  };

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
      </FilterContainer>
      <MapTools
        onTranslationsClick={() => {
          router.push(`/US/${appLanguage.lang.tag}/1/maps/translation`);
        }}
        onAddClick={isAdminRes?.loggedInIsAdmin.isAdmin ? addMap : undefined}
        onResetClick={
          isAdminRes?.loggedInIsAdmin.isAdmin
            ? () => {
                setIsMapResetModalOpen(true);
              }
            : undefined
        }
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
            .map((m, i) => (
              <MapItem
                mapItem={m}
                key={i}
                candidateForDeletionRef={candidateForDeletion}
                setIsMapDeleteModalOpen={setIsMapDeleteModalOpen}
                showDelete={!!isAdminRes?.loggedInIsAdmin.isAdmin}
              />
            ))
        ) : (
          <div> {tr('No maps found')} </div>
        )}
      </IonList>

      <IonModal isOpen={isMapDeleteModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Delete map ?')}</IonTitle>
            <IonButtons slot="start">
              <IonButton
                fill="solid"
                onClick={() => {
                  setIsMapDeleteModalOpen(false);
                }}
              >
                {tr('Cancel')}
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                fill="solid"
                color={'danger'}
                onClick={() => {
                  candidateForDeletion.current &&
                    deleteMap(candidateForDeletion.current);
                  setIsMapDeleteModalOpen(false);
                }}
              >
                {tr('Confirm')}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {candidateForDeletion.current && (
            <>
              {candidateForDeletion.current.is_original ? (
                <>
                  {tr(`You are about to delete original map`)}{' '}
                  {candidateForDeletion.current.map_file_name}
                  <p>
                    {tr(
                      `All related data (translated maps) will be also deleted permanently`,
                    )}
                    .
                  </p>
                </>
              ) : (
                <>
                  {tr(`You are about to delete translated map`)}{' '}
                  {candidateForDeletion.current.map_file_name_with_langs}
                  <p>
                    {tr(`It will be deleted after confirmation. Note that it will
                  be re-created on any translation action performed by any user
                  with original map.`)}
                  </p>
                </>
              )}
            </>
          )}
        </IonContent>
      </IonModal>

      <IonModal isOpen={isMapResetModalOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Reset map data ?')}</IonTitle>
            <IonButtons slot="start">
              <IonButton
                fill="solid"
                onClick={() => {
                  setIsMapResetModalOpen(false);
                }}
              >
                {tr('Cancel')}
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                fill="solid"
                color={'danger'}
                onClick={() => {
                  resetTranslatedMaps();
                  setIsMapResetModalOpen(false);
                }}
              >
                {tr('Confirm')}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {tr(
            `You are about to reset map translation data. All original_map_words and translated_maps
            will be deleted and then they will be recreated by reprocessing every map original map,
            like each one of them was uploaded.`,
          )}
        </IonContent>
      </IonModal>
    </>
  );
};
