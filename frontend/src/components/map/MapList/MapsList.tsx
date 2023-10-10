import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
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
import { useDebounce } from 'use-debounce';

import { Stack, Typography, Button } from '@mui/material';

import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import { Caption } from '../../common/Caption/Caption';
import { SearchInput } from '../../common/forms/SearchInput';
import { AddCircle } from '../../common/icons/AddCircle';

import { MapItem } from './MapItem';
import { MapTools } from './MapsTools';

import {
  ErrorType,
  MapDetailsInfo,
  useGetAllMapsListLazyQuery,
  useIsAdminLoggedInLazyQuery,
  useMapDeleteMutation,
} from '../../../generated/graphql';

import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { globals } from '../../../services/globals';

import { PAGE_SIZE } from '../../../const/commonConst';
import { RouteComponentProps } from 'react-router';
import { langInfo2tag, tag2langInfo } from '../../../common/langUtils';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { MapUploadForm } from './MapUploadForm';
import { MapResetForm } from './MapResetForm';

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
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    states: {
      global: {
        langauges: { targetLang, appLanguage },
      },
    },
    actions: { setTargetLanguage, setModal },
  } = useAppContext();

  const [isAdmin, { data: isAdminRes }] = useIsAdminLoggedInLazyQuery();

  const [mapDelete, { loading: loadingMapDelete, data: dataMapDelete }] =
    useMapDeleteMutation();

  const [getAllMapsList, { data: allMapsQuery, fetchMore }] =
    useGetAllMapsListLazyQuery({ fetchPolicy: 'no-cache' });

  const [isMapDeleteModalOpen, setIsMapDeleteModalOpen] = useState(false);

  const candidateForDeletion = useRef<MapDetailsInfo | undefined>();

  useEffect(() => {
    if (loadingMapDelete) return;
    if (dataMapDelete && dataMapDelete?.mapDelete.error !== ErrorType.NoError) {
      present({
        message: dataMapDelete?.mapDelete.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [dataMapDelete, loadingMapDelete, present]);

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

  const handleFilterChange = (value: string) => {
    setFilter(value);
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

  const mapItemComs = useMemo(
    () =>
      allMapsQuery?.getAllMapsList.edges?.length ? (
        allMapsQuery?.getAllMapsList.edges
          ?.filter((edge) => {
            return (edge.node.mapDetails?.map_file_name_with_langs || '')
              .toLowerCase()
              .includes(bouncedFilter.toLowerCase());
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
      bouncedFilter,
      isAdminRes?.loggedInIsAdmin.isAdmin,
      tr,
    ],
  );

  const handleClickNewMapButton = () => {
    setModal(<MapUploadForm />);
  };

  const isAdminUser = isAdminRes ? isAdminRes.loggedInIsAdmin.isAdmin : false;

  return (
    <>
      <Caption>{tr('Maps')}</Caption>

      <LangSelector
        title={tr('Select your language')}
        selected={targetLang ?? null}
        onChange={(langTag) => {
          if (langTag) {
            router.push(`/${nation_id}/${language_id}/1/maps/list/${langTag}`);
          } else {
            router.push(
              `/${nation_id}/${language_id}/1/maps/list/${DEFAULT_MAP_LANGUAGE_CODE}`,
            );
          }
        }}
        onClearClick={() =>
          router.push(
            `/${nation_id}/${language_id}/1/maps/list/${DEFAULT_MAP_LANGUAGE_CODE}`,
          )
        }
      />

      <Stack gap="14px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" color="dark">{`${
            allMapsQuery?.getAllMapsList.edges?.length || 0
          } ${tr('maps found')}`}</Typography>
          {isAdminUser ? (
            <Button
              variant="text"
              startIcon={<AddCircle sx={{ fontSize: '24px' }} />}
              color="orange"
              sx={{ padding: 0 }}
              onClick={handleClickNewMapButton}
            >
              {tr('New Map')}
            </Button>
          ) : null}
        </Stack>
        <SearchInput
          value={filter}
          onChange={handleFilterChange}
          onClickSearchButton={() => {}}
          placeholder={tr('Search by country/city...')}
        />
      </Stack>

      <MapTools
        onTranslationsClick={() => {
          router.push(`/US/${appLanguage.lang.tag}/1/maps/translation`);
        }}
        onResetClick={
          isAdminRes?.loggedInIsAdmin.isAdmin
            ? () => {
                setModal(<MapResetForm />);
              }
            : undefined
        }
      />

      <IonList lines="none">{mapItemComs}</IonList>

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
    </>
  );
};
