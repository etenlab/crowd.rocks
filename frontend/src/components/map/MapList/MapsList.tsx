import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import {
  ErrorType,
  MapDetailsInfo,
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
import { PAGE_SIZE } from '../../../const/commonConst';
import { RouteComponentProps } from 'react-router';
import { langInfo2tag, tag2langInfo } from '../../../common/langUtils';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
// import { updateCacheWithAddNewMap } from '../../../cacheUpdators/addNewMap';

interface MapListProps
  extends RouteComponentProps<{
    lang_full_tag: string;
    nation_id: string;
    language_id: string;
  }> {}

export const MapList: React.FC<MapListProps> = ({ match }: MapListProps) => {
  const { lang_full_tag: url_lang_tag, nation_id, language_id } = match.params;
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
  const [sendMapFile, { loading: loadingSendMapFile, data: dataSendMapFile }] =
    useMapUploadMutation();
  const [uploadFile, { loading: loadingUploadFile, data: dataUploadFile }] =
    useUploadFileMutation();
  const [mapDelete, { loading: loadingMapDelete, data: dataMapDelete }] =
    useMapDeleteMutation();
  const [
    mapTranslationReset,
    {
      loading: loadingMapReset,
      data: dataMapReset,
      called: dataMapResetCalled,
    },
  ] = useMapsTranslationsResetMutation();

  const [getAllMapsList, { data: allMapsQuery, fetchMore }] =
    useGetAllMapsListLazyQuery({ fetchPolicy: 'no-cache' });

  const { makeMapThumbnail } = useMapTranslationTools();
  const [isMapDeleteModalOpen, setIsMapDeleteModalOpen] = useState(false);
  const [isMapResetModalOpen, setIsMapResetModalOpen] = useState(false);
  const candidateForDeletion = useRef<MapDetailsInfo | undefined>();
  const [currUploads, setCurrUploads] = useState<Array<MapDetailsInfo>>([]);

  useEffect(() => {
    if (loadingSendMapFile || loadingUploadFile || loadingMapDelete) return;
    if (
      (dataSendMapFile &&
        dataSendMapFile?.mapUpload.error !== ErrorType.NoError) ||
      (dataUploadFile &&
        dataUploadFile?.uploadFile.error !== ErrorType.NoError) ||
      (dataMapDelete && dataMapDelete?.mapDelete.error !== ErrorType.NoError)
    ) {
      present({
        message:
          dataSendMapFile?.mapUpload.error ||
          dataUploadFile?.uploadFile.error ||
          dataMapDelete?.mapDelete.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [
    dataMapDelete,
    dataSendMapFile,
    dataUploadFile,
    loadingMapDelete,
    loadingSendMapFile,
    loadingUploadFile,
    present,
  ]);

  useEffect(() => {
    if (!dataMapResetCalled || loadingMapReset) return;
    if (dataMapReset?.mapsTranslationsReset.error === ErrorType.NoError) {
      present({
        message: `Maps translations data reset completed`,
        duration: 1500,
        position: 'top',
        color: 'primary',
      });
    } else {
      present({
        message: `Maps translations data reset error: ${dataMapReset?.mapsTranslationsReset.error}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMapReset, dataMapReset?.mapsTranslationsReset.error, present]);

  useEffect(() => {
    const user_id = globals.get_user_id();

    if (!user_id) return;

    const variables = { input: { user_id: String(user_id) } };
    isAdmin({ variables });
  }, [isAdmin]);

  useEffect(() => {
    if (
      url_lang_tag &&
      url_lang_tag !== langInfo2tag(targetLang || undefined)
    ) {
      const langInfo = tag2langInfo(url_lang_tag);
      if (langInfo.lang.tag) {
        setTargetLanguage(langInfo);
      }
      return;
    }

    if (!targetLang) {
      setTargetLanguage(tag2langInfo(DEFAULT_MAP_LANGUAGE_CODE));
    }
  }, [
    setTargetLanguage,
    targetLang,
    url_lang_tag,
    router,
    nation_id,
    language_id,
  ]);

  useEffect(() => {
    if (!targetLang) {
      return;
    }

    const variables = targetLang?.lang
      ? {
          lang: {
            language_code: targetLang.lang.tag,
            dialect_code: targetLang?.dialect?.tag,
            geo_code: targetLang?.region?.tag,
          },
          first: PAGE_SIZE,
          after: null,
        }
      : {
          lang: undefined,
          first: PAGE_SIZE,
          after: null,
        };

    getAllMapsList({ variables });
  }, [getAllMapsList, targetLang]);

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (allMapsQuery?.getAllMapsList.pageInfo.hasNextPage) {
        const variables = targetLang?.lang
          ? {
              lang: {
                language_code: targetLang.lang.tag,
                dialect_code: targetLang?.dialect?.tag,
                geo_code: targetLang?.region?.tag,
              },
              first: PAGE_SIZE,
              after: allMapsQuery.getAllMapsList.pageInfo.endCursor,
            }
          : {
              lang: undefined,
              first: PAGE_SIZE,
              after: allMapsQuery.getAllMapsList.pageInfo.endCursor,
            };

        await fetchMore({
          variables,
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, allMapsQuery, targetLang],
  );

  const addMap = useCallback(
    async (file: File) => {
      if (!file) return;
      let previewFileId: string | undefined;
      try {
        present({
          message: tr(
            'Started map uploading and translation to known languages',
          ),
          duration: 2000,
          position: 'top',
          color: 'primary',
        });

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
        previewFileId = uploadPreviewResult.data?.uploadFile.file?.id
          ? String(uploadPreviewResult.data?.uploadFile.file.id)
          : undefined;
        if (uploadPreviewResult.data?.uploadFile.error !== ErrorType.NoError) {
          throw new Error(uploadPreviewResult.data?.uploadFile.error);
        }

        setCurrUploads((cu) => [
          ...cu,
          {
            preview_file_id: previewFileId,
            content_file_id: `temp-${previewFileId}`,
            content_file_url: 'assets/images/Spin-1s-200px.gif',
            preview_file_url: 'assets/images/Spin-1s-200px.gif',
            created_at: '',
            created_by: '',
            is_original: true,
            language: { language_code: DEFAULT_MAP_LANGUAGE_CODE },
            map_file_name: tr('Uploading') + ' ' + file.name,
            map_file_name_with_langs: tr('Uploading') + ' ' + file.name,
            original_map_id: `temp-map-id-${previewFileId}`,
          } as MapDetailsInfo,
        ]);

        const mapUploadResult = await sendMapFile({
          variables: {
            file,
            previewFileId,
            file_size: file.size,
            file_type: file.type,
          },
          refetchQueries: ['GetAllMapsList'],
        });

        if (
          mapUploadResult.errors?.length &&
          mapUploadResult.errors?.length > 0
        ) {
          throw new Error(JSON.stringify(mapUploadResult.errors));
        }
        const uploadedId =
          mapUploadResult.data?.mapUpload.mapDetailsOutput?.mapDetails
            ?.preview_file_id;

        setCurrUploads((cus) =>
          cus.filter((cu) => cu.preview_file_id !== uploadedId),
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        present({
          message: `${file.name}: ` + error.message,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        setCurrUploads((cus) =>
          cus.filter((cu) => cu.preview_file_id !== previewFileId),
        );
      }
    },
    [makeMapThumbnail, uploadFile, sendMapFile, present, tr],
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
    mapTranslationReset({
      refetchQueries: ['GetAllMapsList'],
    });
  };

  const loadingMapItemComs = useMemo(
    () =>
      currUploads.length > 0
        ? currUploads.map((uploadingMapDetails) => (
            <MapItem
              mapItem={uploadingMapDetails}
              key={uploadingMapDetails.content_file_id}
              showDelete={false}
              showDownload={false}
            />
          ))
        : null,
    [currUploads],
  );

  const mapItemComs = useMemo(
    () =>
      allMapsQuery?.getAllMapsList.edges?.length ? (
        allMapsQuery?.getAllMapsList.edges
          ?.filter((edge) => {
            return (edge.node.mapDetails?.map_file_name_with_langs || '')
              .toLowerCase()
              .includes(filter.toLowerCase());
          })
          .map((edge) =>
            edge.node.mapDetails ? (
              <MapItem
                mapItem={edge.node.mapDetails}
                key={edge.cursor}
                candidateForDeletionRef={candidateForDeletion}
                setIsMapDeleteModalOpen={setIsMapDeleteModalOpen}
                showDelete={!!isAdminRes?.loggedInIsAdmin.isAdmin}
              />
            ) : (
              <>{edge.node.error}</>
            ),
          )
      ) : (
        <div> {tr('No maps found')} </div>
      ),
    [
      allMapsQuery?.getAllMapsList.edges,
      filter,
      isAdminRes?.loggedInIsAdmin.isAdmin,
      tr,
    ],
  );

  return (
    <>
      <Caption>{tr('Maps')}</Caption>

      <FilterContainer>
        <LangSelector
          title={tr('Select language')}
          langSelectorId="mapsListLangSelector"
          selected={targetLang ?? undefined}
          onChange={(langTag) => {
            router.push(`/${nation_id}/${language_id}/1/maps/list/${langTag}`);
          }}
          onClearClick={() =>
            router.push(
              `/${nation_id}/${language_id}/1/maps/list/${DEFAULT_MAP_LANGUAGE_CODE}`,
            )
          }
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
      {loadingMapReset ? (
        <div>Resetting map data...</div>
      ) : (
        <>
          <IonList lines="none">{loadingMapItemComs}</IonList>
          <IonList lines="none">{mapItemComs}</IonList>
        </>
      )}

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>

      <IonModal
        isOpen={isMapDeleteModalOpen}
        onDidDismiss={() => setIsMapDeleteModalOpen(false)}
      >
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

      <IonModal
        isOpen={isMapResetModalOpen}
        onDidDismiss={() => setIsMapResetModalOpen(false)}
      >
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
