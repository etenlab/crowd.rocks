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
} from '@ionic/react';
import { useDebounce } from 'use-debounce';

import {
  Stack,
  Typography,
  Button,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

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

import { MapUploadModal } from './MapUploadModal';
import { MapResetModal } from './MapResetModal';
import { DownloadCircle } from '../../common/icons/DownloadCircle';
import { downloadFromUrl } from '../../../common/utility';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
interface MapListProps
  extends RouteComponentProps<{
    lang_full_tag: string;
    nation_id: string;
    language_id: string;
  }> {}

export function MapList({ match }: MapListProps) {
  const { lang_full_tag: url_lang_tag, nation_id, language_id } = match.params;
  const router = useIonRouter();
  const { tr } = useTr();
  const [present] = useIonToast();

  const [filter, setFilter] = useState<string>('');
  const [bouncedFilter] = useDebounce(filter, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<NodeJS.Timeout>();
  const singleClickTimerRef = useRef<NodeJS.Timeout>();
  const clickCountRef = useRef<number>(0);

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
    if (
      url_lang_tag &&
      (!targetLang || url_lang_tag !== langInfo2tag(targetLang))
    ) {
      setTargetLanguage(tag2langInfo(url_lang_tag));
    }
  }, [setTargetLanguage, targetLang, url_lang_tag]);

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
            filter: bouncedFilter,
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
  }, [getAllMapsList, targetLang, bouncedFilter]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const containerWidth = entry.contentRect.width;

        const itemWidth = 162;
        const basicGap = 16;

        const rowBlockCnt = Math.floor(
          (containerWidth + basicGap) / (itemWidth + basicGap),
        );
        const additionalGap =
          (containerWidth -
            itemWidth * rowBlockCnt -
            basicGap * (rowBlockCnt - 1)) /
          (rowBlockCnt - 1);

        if (containerRef?.current?.style) {
          containerRef.current!.style.columnGap = `${
            basicGap + additionalGap
          }px`;
          containerRef.current!.style.rowGap = `${basicGap}px`;
        }
      });
    });

    observer.observe(containerRef.current!);
  }, []);

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
                filter: bouncedFilter,
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
    [fetchMore, allMapsQuery, targetLang, bouncedFilter],
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

  const updatePageLanguage = useCallback(
    (targetLang: LanguageInfo | null) => {
      if (targetLang) {
        router.push(
          `/${nation_id}/${language_id}/1/maps/list/${langInfo2tag(
            targetLang,
          )}`,
        );
      } else {
        router.push(`/${nation_id}/${language_id}/1/maps/list/en`);
      }
    },
    [language_id, nation_id, router],
  );

  const { data: mapZipResult, error: mapZipError } =
    useSubscribeToZipMapSubscription();

  useEffect(() => {
    if (mapZipError) {
      if (mapZipError.message === 'Socket closed') {
        present({
          message: 'No connection with the server',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
      } else {
        present({
          message: 'Maps zipping error: ' + mapZipError.message,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
      }
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

  const mapItemComs = useMemo(() => {
    if (!allMapsQuery || !allMapsQuery.getAllMapsList.edges) {
      return <div> {tr('No maps found')} </div>;
    }

    const originalMapIds = new Map<string, boolean>();

    allMapsQuery.getAllMapsList.edges.map((edge) => {
      if (edge.node.mapDetails?.is_original) {
        originalMapIds.set(edge.node.mapDetails.original_map_id, true);
      }
    });

    return allMapsQuery.getAllMapsList.edges.map((edge) => {
      if (!edge.node.mapDetails) {
        return null;
      }

      if (
        !edge.node.mapDetails.is_original &&
        originalMapIds.get(edge.node.mapDetails.original_map_id)
      ) {
        return null;
      }

      return (
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
      );
    });
  }, [allChecked, allMapsQuery, checkedMap, tr, viewMode]);

  const handleClickNewMapButton = () => {
    openModal(<MapUploadModal onClose={closeModal} />);
  };

  const isAdminUser = globals.is_admin_user();

  return (
    <>
      <Caption
        handleBackClick={() => {
          router.push(`/${nation_id}/${language_id}/1/home`);
        }}
      >
        {tr('Maps')}
      </Caption>

      <LangSelector
        title={tr('Select your language')}
        selected={targetLang}
        onChange={(_langTag, langInfo) => {
          updatePageLanguage(langInfo);
        }}
        onClearClick={() => updatePageLanguage(null)}
      />

      <Stack gap="14px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" color="dark">{`${
            allMapsQuery?.getAllMapsList.pageInfo.totalEdges || 0
          } ${tr('maps found')}`}</Typography>

          <Stack direction="row" alignItems="center" gap="10px">
            {isAdminUser ? (
              <Button
                variant="contained"
                color="orange"
                sx={{ padding: '7px', minWidth: 0 }}
                onClick={handleClickNewMapButton}
              >
                <AddCircle sx={{ fontSize: '18px' }} />
              </Button>
            ) : null}
            <MoreHorizButton
              popoverWidth="250px"
              component={
                <>
                  <Button
                    variant="text"
                    startIcon={
                      mapZipResult?.ZipMapReport.status ===
                      SubscriptionStatus.Progressing ? (
                        <CircularProgress color={'primary'} size={18} />
                      ) : (
                        <DownloadCircle sx={{ fontSize: '24px' }} />
                      )
                    }
                    color="dark"
                    sx={{
                      padding: '0 5px',
                      justifyContent: 'flex-start',
                    }}
                    onClick={handleStartZipMap}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        textOverflow: 'ellipsis',
                        width: '180px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mapZipResult?.ZipMapReport.status ===
                      SubscriptionStatus.Progressing
                        ? tr(mapZipResult.ZipMapReport.message || '')
                        : tr(
                            `Download All Maps (${
                              allMapsQuery?.getAllMapsList.pageInfo
                                .totalEdges || 0
                            })`,
                          )}
                    </Typography>
                  </Button>
                </>
              }
            />
          </Stack>
        </Stack>
        <SearchInput
          value={filter}
          onChange={handleFilterChange}
          onClickSearchButton={() => {}}
          placeholder={tr('Search by...')}
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
        ref={containerRef}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
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
}
