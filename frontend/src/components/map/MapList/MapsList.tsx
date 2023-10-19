import {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
  MouseEventHandler,
  ChangeEvent,
} from 'react';
import {
  useIonRouter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonToast,
  IonSpinner,
} from '@ionic/react';
import { useDebounce } from 'use-debounce';

import { Stack, Typography, Button, FormControlLabel } from '@mui/material';

import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import { Caption } from '../../common/Caption/Caption';
import { SearchInput } from '../../common/forms/SearchInput';
import { AddCircle } from '../../common/icons/AddCircle';
import { Checkbox } from '../../common/buttons/Checkbox';

import { MapItem, ViewMode } from './MapItem';

import {
  ErrorType,
  SubscriptionStatus,
  useGetAllMapsListLazyQuery,
  useStartZipMapDownloadMutation,
  useSubscribeToZipMapSubscription,
} from '../../../generated/graphql';

import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { globals } from '../../../services/globals';

import { PAGE_SIZE } from '../../../const/commonConst';
import { RouteComponentProps } from 'react-router';
import {
  langInfo2langInput,
  langInfo2tag,
  tag2langInfo,
} from '../../../../../utils';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { MapUploadModal } from './MapUploadModal';
import { MapResetModal } from './MapResetModal';
import { DownloadCircle } from '../../common/icons/DownloadCircle';
import { downloadFromUrl } from '../../../common/utility';
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

  const timerRef = useRef<NodeJS.Timeout>();
  const singleClickTimerRef = useRef<NodeJS.Timeout>();
  const clickCountRef = useRef<number>(0);
  const isFirstRendering = useRef<boolean>(true);

  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const [startZipMapDownload] = useStartZipMapDownloadMutation();

  const {
    states: {
      global: {
        langauges: { targetLang, appLanguage },
      },
    },
    actions: { setTargetLanguage, createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getAllMapsList, { data: allMapsQuery, fetchMore }] =
    useGetAllMapsListLazyQuery();

  useEffect(() => {
    if (isFirstRendering.current) {
      if (
        url_lang_tag &&
        url_lang_tag !== langInfo2tag(targetLang || undefined)
      ) {
        const langInfo = tag2langInfo(url_lang_tag);
        if (langInfo.lang.tag) {
          setTargetLanguage(langInfo);
        }

        isFirstRendering.current = false;
        return;
      }

      if (!targetLang) {
        setTargetLanguage(tag2langInfo(DEFAULT_MAP_LANGUAGE_CODE));
      }
    } else {
      if (
        isFirstRendering.current === false &&
        url_lang_tag &&
        targetLang &&
        url_lang_tag !== langInfo2tag(targetLang)
      ) {
        router.push(
          `/${nation_id}/${language_id}/1/maps/list/${langInfo2tag(
            targetLang,
          )}`,
        );
      }
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

  const handleLongPress = () => {
    setViewMode('selection');
  };

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    clickCountRef.current++;

    if (clickCountRef.current === 1) {
      singleClickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 400);
    } else if (clickCountRef.current === 2) {
      clearTimeout(singleClickTimerRef.current);
      clickCountRef.current = 0;

      setViewMode('normal');
      setCheckedMap({});
      setAllChecked(false);

      e.stopPropagation();
    }
  };

  const handleChangeAllCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setAllChecked(e.target.checked);
  };

  const { data: mapZipResult, error: mapZipError } =
    useSubscribeToZipMapSubscription();

  useEffect(() => {
    if (mapZipError) {
      present({
        message: 'Maps zipping error',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
    }
  }, [mapZipError, mapZipResult, present]);

  const handleStartZipMap = useCallback(async () => {
    if (!targetLang) {
      present({
        message: `Please select language first`,
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      return;
    }
    const { data, errors } = await startZipMapDownload({
      variables: { language: langInfo2langInput(targetLang) },
    });
    if (data?.startZipMapDownload.error !== ErrorType.NoError) {
      present({
        message: data?.startZipMapDownload.error,
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
    }
    if (errors?.length && errors?.length > 0) {
      present({
        message: 'Errors: ' + JSON.stringify(errors),
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, startZipMapDownload, targetLang]);

  useEffect(() => {
    if (!mapZipResult?.ZipMapReport.resultZipUrl) {
      return;
    }
    downloadFromUrl('maps', mapZipResult.ZipMapReport.resultZipUrl);
  }, [mapZipResult?.ZipMapReport.resultZipUrl]);

  const startTimer = () => {
    timerRef.current = setTimeout(handleLongPress, 2000);
  };

  const cancelTimer = () => {
    clearTimeout(timerRef.current);
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
                mapInfo={edge.node.mapDetails}
                key={edge.cursor}
                viewMode={viewMode}
                onChangeViewMode={() => {}}
                onChangeCheck={(checked) => {
                  setCheckedMap((_mapObj) => ({
                    ..._mapObj,
                    [edge.cursor]: checked,
                  }));
                }}
                checked={checkedMap[edge.cursor] || allChecked}
              />
            ) : (
              <>{edge.node.error}</>
            ),
          )
      ) : (
        <div> {tr('No maps found')} </div>
      ),
    [
      allChecked,
      allMapsQuery?.getAllMapsList.edges,
      bouncedFilter,
      checkedMap,
      tr,
      viewMode,
    ],
  );

  const handleClickNewMapButton = () => {
    openModal(<MapUploadModal onClose={closeModal} />);
  };

  const isAdminUser = globals.is_admin_user();

  return (
    <>
      <Caption>{tr('Maps')}</Caption>

      <LangSelector
        title={tr('Select your language')}
        selected={targetLang}
        onChange={(_langTag, langInfo) => {
          if (langInfo) {
            setTargetLanguage(langInfo);
          }
        }}
        onClearClick={() =>
          setTargetLanguage({
            lang: {
              tag: 'en',
              descriptions: ['English'],
            },
          })
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
          {mapZipResult?.ZipMapReport.status ===
          SubscriptionStatus.Progressing ? (
            <>
              {mapZipResult.ZipMapReport.message}
              <IonSpinner color={'primary'} />
            </>
          ) : (
            <Button startIcon={<DownloadCircle />} onClick={handleStartZipMap}>
              {tr('Make zip and dowlnoad')}
            </Button>
          )}
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

      {isAdminUser ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {viewMode === 'selection' ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={allChecked}
                  onChange={handleChangeAllCheck}
                />
              }
              label={tr('Select All')}
              sx={{
                marginLeft: 0,
                gap: '6px',
                '& .MuiTypography-root': {
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  letterSpacing: '-0.26px',
                  color: '#476FFF',
                },
              }}
            />
          ) : (
            <div />
          )}
          <Button
            variant="text"
            color="red"
            onClick={() => {
              openModal(<MapResetModal onClose={closeModal} />);
            }}
          >
            {tr('Reset Data')}
          </Button>
        </Stack>
      ) : null}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="16px"
        sx={{ flexWrap: 'wrap' }}
        onMouseDown={startTimer}
        onMouseUp={cancelTimer}
        onMouseMove={cancelTimer}
        onTouchStart={startTimer}
        onTouchMove={cancelTimer}
        onTouchEnd={cancelTimer}
        onClick={handleDoubleClick}
      >
        {mapItemComs}
      </Stack>

      <Button
        variant="contained"
        color="blue"
        sx={{
          position: 'fixed',
          bottom: '20px',
          width: 'calc(100% - 32px)',
          maxWidth: 'calc(777px - 32px)',
        }}
        onClick={() => {
          router.push(`/US/${appLanguage.lang.tag}/1/maps/translation/all`);
        }}
      >
        {viewMode === 'normal' || allChecked
          ? tr('Translate All')
          : `${tr('Translate')} (${
              Object.values(checkedMap).filter((item) => item === true).length
            })`}
      </Button>

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>
    </>
  );
};
