import {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
  ReactNode,
  MouseEvent,
} from 'react';
import { Stack, IconButton, Skeleton } from '@mui/material';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { Dot, Word } from '../../documents/DocumentViewer/styled';

import {
  PericopeWithDocumentWordEntry,
  PericopeWithVote,
  useGetDocumentWordEntriesByDocumentIdLazyQuery,
  useGetPericopiesByDocumentIdLazyQuery,
} from '../../../generated/graphql';
import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { CheckCircle } from '../../common/icons/CheckCircle';

export type TempPage = {
  id: string;
  first: number;
  after: string | null;
};

export type RangeItem = {
  entryId: string;
  order: number;
};

export type Range = {
  begin: RangeItem;
  end: RangeItem;
};

export type WordlikeString = {
  id: string;
  wordlike_string: string;
};

export type WordEntry = {
  id: string;
  wordlike_string: WordlikeString;
  parent_id?: string;
  page: number;
};

export type DocumentViewerHandle = {
  getTextFromRange(start: string, end: string): string;
};

export function Footer({ context }: { context?: { loading: boolean } }) {
  const skeletonComs: JSX.Element[] = [];

  for (let i = 0; i < 60; i++) {
    skeletonComs.push(<Skeleton key={i} animation="wave" />);
  }

  if (context?.loading) {
    return <Stack>{skeletonComs}</Stack>;
  } else {
    return null;
  }
}

export type PericopeViewerProps = {
  pericope: PericopeWithDocumentWordEntry;
  drawRanges: {
    begin: string;
    end: string;
  }[];
  dots: {
    entryId: string;
    component?: ReactNode;
  }[];
  onClickWord(
    entryId: string,
    order: number,
    e: MouseEvent<HTMLDivElement>,
  ): void;
  onSelectRange(range: { begin: string; end: string }): void;
  onSelectingRange?(status: boolean): void;
  onChangeRangeText(sentence: string): void;
  onLoadPage?(tempPage: TempPage): void;
  customScrollParent?: HTMLElement;
  disabledRangeSelection?: boolean;
};

export function PericopeViewer({
  pericope,
  drawRanges,
  dots,
  onClickWord,
  onSelectRange,
  onSelectingRange,
  onChangeRangeText,
  onLoadPage,
  disabledRangeSelection,
  customScrollParent,
}: PericopeViewerProps) {
  const [getDocumentWordEntriesByDocumentId] =
    useGetDocumentWordEntriesByDocumentIdLazyQuery();
  const [getPericopiesByDocumentId] = useGetPericopiesByDocumentIdLazyQuery();

  const [range, setRange] = useState<Range | null>(null);
  const [entriesData, setEntriesData] = useState<WordEntry[]>([]);

  const [rowWidth, setRowWidth] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const pericopeMapRef = useRef(new Map<string, PericopeWithVote>());
  const fetchingStatus = useRef<'beforeStarting' | 'started' | 'ended'>(
    'beforeStarting',
  );
  const currentPageRef = useRef<number | null>(null);

  const calcRowWidth = useCallback(() => {
    const bodyWidth = document.body.offsetWidth;

    setRowWidth(Math.min(bodyWidth - 32, 777 - 32));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', calcRowWidth);
    calcRowWidth();
  }, [calcRowWidth]);

  const fetchMore = useCallback(
    async (page: number) => {
      if (
        page === currentPageRef.current ||
        fetchingStatus.current === 'ended'
      ) {
        return;
      }

      const documentId = pericope.start_word.document_id;

      currentPageRef.current = page;
      onLoadPage &&
        onLoadPage({
          id: `page_${page - 1}`,
          first: 1,
          after: JSON.stringify({ document_id: +documentId, page: page - 1 }),
        });
      setLoading(true);

      const { data } = await getDocumentWordEntriesByDocumentId({
        variables: {
          document_id: documentId,
          first: 1,
          after: JSON.stringify({ document_id: +documentId, page: page - 1 }),
        },
      });

      if (!data) {
        return;
      }

      const { data: pericopeData } = await getPericopiesByDocumentId({
        variables: {
          document_id: documentId,
          first: 1,
          after: JSON.stringify({ document_id: +documentId, page: page - 1 }),
        },
      });

      if (pericopeData) {
        pericopeData.getPericopiesByDocumentId.edges.forEach((edge) => {
          edge.node.forEach((item) =>
            pericopeMapRef.current.set(item.start_word, item),
          );
        });
      }

      let isPushingAllowed =
        fetchingStatus.current === 'started' ? true : false;

      const word_entries: WordEntry[] = [];
      data.getDocumentWordEntriesByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((item) => {
          if (
            isPushingAllowed === false &&
            fetchingStatus.current === 'beforeStarting' &&
            item.document_word_entry_id ===
              pericope.start_word.document_word_entry_id
          ) {
            isPushingAllowed = true;
          }

          if (isPushingAllowed) {
            word_entries.push({
              id: item.document_word_entry_id,
              wordlike_string: {
                id: item.wordlike_string.wordlike_string_id,
                wordlike_string: item.wordlike_string.wordlike_string,
              },
              parent_id: item.parent_document_word_entry_id || undefined,
              page: item.page,
            });

            const p = pericopeMapRef.current.get(item.document_word_entry_id);

            if (p && p.pericope_id !== pericope.pericope_id) {
              isPushingAllowed = false;
              fetchingStatus.current = 'ended';
            }
          }
        });
      });

      if (fetchingStatus.current === 'beforeStarting') {
        fetchingStatus.current = 'started';
      }

      setEntriesData((prev) => [...prev, ...word_entries]);
      setLoading(false);
    },
    [
      getDocumentWordEntriesByDocumentId,
      getPericopiesByDocumentId,
      onLoadPage,
      pericope,
    ],
  );

  useEffect(() => {
    const page = +pericope.start_word.page;
    pericopeMapRef.current = new Map<string, PericopeWithVote>();
    fetchingStatus.current = 'beforeStarting';
    setEntriesData([]);
    currentPageRef.current = null;

    fetchMore(page);
  }, [fetchMore, pericope]);

  useEffect(() => {
    let sentence: string = '';
    let start = false;

    if (range && entriesData.length > 0) {
      for (const data of entriesData) {
        if (!Array.isArray(data)) {
          if (start) {
            sentence = `${sentence} ... `;
          }
          continue;
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].id === range.begin.entryId) {
            start = true;
          }

          if (start) {
            sentence = `${sentence} ${data[i].wordlike_string.wordlike_string}`;
          }

          if (data[i].id === range.end.entryId) {
            start = false;
            onChangeRangeText(sentence);
            return;
          }
        }
      }
    }
  }, [entriesData, onChangeRangeText, range]);

  const loadMore = useCallback(() => {
    if (currentPageRef.current !== null) {
      fetchMore(currentPageRef.current + 1);
    }
  }, [fetchMore]);

  const startTimer = useCallback(
    (entryId: string, order: number) => {
      timerRef.current = setTimeout(() => {
        if (disabledRangeSelection !== true) {
          onSelectingRange && onSelectingRange(true);
          setRange({
            begin: {
              entryId: entryId,
              order: order,
            },
            end: {
              entryId: entryId,
              order: order,
            },
          });
        }
      }, 2000);
    },
    [disabledRangeSelection, onSelectingRange],
  );

  const cancelTimer = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const handleWordClick = useCallback(
    (entryId: string, index: number, e: MouseEvent<HTMLDivElement>) => {
      if (range) {
        // ...A... ... ...B...
        if (range.begin.entryId === entryId) {
          // ...A(X)... ... ...B...
          setRange({
            begin: range.begin,
            end: range.begin,
          });
        } else if (range.end.entryId === entryId) {
          // ...A... ... ...B(X)...
          setRange({
            begin: range.end,
            end: range.end,
          });
        } else {
          if (range.begin.order >= index) {
            // ...X ... A... ... ...B...
            setRange({
              begin: {
                entryId,
                order: index,
              },
              end: range.end,
            });
          } else if (range.end.order <= index) {
            // ... A... ... ...B... X ...
            setRange({
              begin: range.begin,
              end: {
                entryId,
                order: index,
              },
            });
          } else if (index - range.begin.order <= range.end.order - index) {
            // ... A... X ... ... ...B...
            setRange({
              begin: {
                entryId,
                order: index,
              },
              end: range.end,
            });
          } else {
            // ... A... ... X ...B...
            setRange({
              begin: range.begin,
              end: {
                entryId,
                order: index,
              },
            });
          }
        }
      } else {
        onClickWord(entryId, index, e);
      }
    },
    [onClickWord, range],
  );

  const rowData = useMemo(() => {
    const rowData: {
      row: JSX.Element;
      after: string | null;
      wordId: string | null;
    }[] = [];
    const tempRow: {
      cols: {
        wordEntry: WordEntry;
        order: number;
      }[];
      width: number;
    } = {
      cols: [],
      width: 0,
    };

    const dotsMap = new Map<
      string,
      {
        entryId: string;
        component?: ReactNode;
      }
    >();

    dots.forEach((dot) => dotsMap.set(dot.entryId, dot));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context || rowWidth === 0) {
      return rowData;
    }

    const documentId = pericope.start_word.document_id;
    const fontSize = 14;
    const fontWeight = 400;
    const fontFamily = 'Poppins';
    const padding = 6;

    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const drawRangeBeginMap = new Map<
      string,
      { begin: string; end: string }[]
    >();
    const drawRangeEndMap = new Map<string, { begin: string; end: string }[]>();

    let begins: { begin: string; end: string }[] = [];
    let isInRenderingRange = false;

    drawRanges.forEach((item) => {
      const beginArr = drawRangeBeginMap.get(item.begin);
      if (beginArr) {
        beginArr.push(item);
      } else {
        drawRangeBeginMap.set(item.begin, [item]);
      }

      const endArr = drawRangeEndMap.get(item.end);
      if (endArr) {
        endArr.push(item);
      } else {
        drawRangeEndMap.set(item.end, [item]);
      }
    });

    if (range) {
      const beginArr = drawRangeBeginMap.get(range.begin.entryId);
      if (beginArr) {
        beginArr.push({
          begin: range.begin.entryId,
          end: range.end.entryId,
        });
      } else {
        drawRangeBeginMap.set(range.begin.entryId, [
          {
            begin: range.begin.entryId,
            end: range.end.entryId,
          },
        ]);
      }

      const endArr = drawRangeEndMap.get(range.end.entryId);
      if (endArr) {
        endArr.push({
          begin: range.begin.entryId,
          end: range.end.entryId,
        });
      } else {
        drawRangeEndMap.set(range.end.entryId, [
          {
            begin: range.begin.entryId,
            end: range.end.entryId,
          },
        ]);
      }
    }

    let wordCounter = 0;

    const getWordProps = (entry: WordEntry, order: number, padding: string) => {
      const beginArr = drawRangeBeginMap.get(entry.id);

      if (beginArr) {
        begins.push(...beginArr);
      }

      const dot = dotsMap.get(entry.id) || null;

      const isDot = dot ? true : false;
      const dotCom = dot ? dot.component : null;

      let classStr = `edit `;
      classStr += begins.length > 0 ? 'selected' : '';
      classStr += ` ${
        entry.id === range?.begin.entryId ? 'left-boundary' : ''
      }`;
      classStr += ` ${entry.id === range?.end.entryId ? 'right-boundary' : ''}`;

      const cursor = isDot ? 'pointer' : 'default';

      const endArr = drawRangeEndMap.get(entry.id);

      if (endArr) {
        begins = begins.filter((item) => {
          const exists = endArr.find((endItem) => {
            if (endItem.begin === item.begin && endItem.end === item.end) {
              return true;
            } else {
              return false;
            }
          });

          if (exists) {
            return false;
          } else {
            return true;
          }
        });
      }

      const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        handleWordClick(entry.id, order, e);
      };

      const wordlikeString = entry.wordlike_string.wordlike_string;

      return {
        sx: {
          cursor,
          padding,
        },
        classStr,
        handleClick,
        wordlikeString,
        dotCom,
        isDot,
      };
    };

    const entries: WordEntry[] = entriesData;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (
        isInRenderingRange === false &&
        entry.id !== pericope.start_word.document_word_entry_id
      ) {
        continue;
      }

      if (
        isInRenderingRange === false &&
        entry.id === pericope.start_word.document_word_entry_id
      ) {
        isInRenderingRange = true;
      }

      const wordlikeString = entry.wordlike_string.wordlike_string;

      const wordWidth = context.measureText(wordlikeString).width + padding;

      if (tempRow.width + wordWidth < rowWidth - 35) {
        tempRow.cols.push({
          wordEntry: entry,
          order: wordCounter,
        });
        tempRow.width = tempRow.width + wordWidth;
      } else {
        const rowCom = (
          <Stack
            direction="row"
            justifyContent="flex-start"
            sx={(theme) => ({
              color: theme.palette.text.gray,
            })}
          >
            {tempRow.cols.map((col) => {
              const {
                sx,
                classStr,
                handleClick,
                wordlikeString,
                dotCom,
                isDot,
              } = getWordProps(
                col.wordEntry,
                col.order,
                `0 ${
                  3 + (rowWidth - tempRow.width - 35) / tempRow.cols.length / 2
                }px`,
              );

              return (
                <Word
                  key={col.wordEntry.id}
                  sx={sx}
                  className={classStr}
                  onClick={handleClick}
                  onMouseDown={() => startTimer(col.wordEntry.id, col.order)}
                  onMouseUp={cancelTimer}
                  onMouseMove={cancelTimer}
                  onTouchStart={() => startTimer(col.wordEntry.id, col.order)}
                  onTouchMove={cancelTimer}
                  onTouchEnd={cancelTimer}
                >
                  {wordlikeString}
                  {isDot ? dotCom || <Dot /> : null}
                  {range?.begin.entryId === col.wordEntry.id ? (
                    <Stack
                      gap="10px"
                      direction="row"
                      alignItems="center"
                      sx={{
                        fontSize: 22,
                        position: 'absolute',
                        zIndex: 9,
                        top: rowData.length === 0 ? '45px' : '-45px',
                        left: '-10px',
                        backgroundColor: (theme) =>
                          theme.palette.background.gray,
                        borderRadius: 10,
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRange({
                            begin: range.begin.entryId,
                            end: range.end.entryId,
                          });
                          setRange(null);
                          onSelectingRange && onSelectingRange(false);
                        }}
                        color="green"
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setRange(null);
                          onSelectingRange && onSelectingRange(false);
                        }}
                        color="red"
                      >
                        <DeleteCircle />
                      </IconButton>
                    </Stack>
                  ) : null}
                </Word>
              );
            })}
          </Stack>
        );

        rowData.push({
          row: rowCom,
          after: JSON.stringify({
            document_id: +documentId,
            page: tempRow.cols[0].wordEntry.page - 1,
          }),
          wordId: tempRow.cols[0].wordEntry.id,
        });
        tempRow.cols = [{ wordEntry: entry, order: wordCounter }];
        tempRow.width = wordWidth;
      }

      const hostedPericope = pericopeMapRef.current.get(entry.id);

      if (
        hostedPericope &&
        hostedPericope.pericope_id !== pericope.pericope_id
      ) {
        isInRenderingRange = false;
      }

      wordCounter++;
    }

    if (tempRow.cols.length) {
      const rowCom = (
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={(theme) => ({
            color: theme.palette.text.gray,
          })}
        >
          {tempRow.cols.map((col) => {
            const { sx, classStr, handleClick, wordlikeString, dotCom, isDot } =
              getWordProps(col.wordEntry, col.order, '0 3px');

            return (
              <Word
                key={col.wordEntry.id}
                sx={sx}
                className={classStr}
                onClick={handleClick}
                onMouseDown={() => startTimer(col.wordEntry.id, col.order)}
                onMouseUp={cancelTimer}
                onMouseMove={cancelTimer}
                onTouchStart={() => startTimer(col.wordEntry.id, col.order)}
                onTouchMove={cancelTimer}
                onTouchEnd={cancelTimer}
              >
                {wordlikeString}
                {isDot ? dotCom || <Dot /> : null}
                {range?.begin.entryId === col.wordEntry.id ? (
                  <Stack
                    gap="16px"
                    direction="row"
                    alignItems="center"
                    sx={{
                      fontSize: 22,
                      position: 'absolute',
                      top: '-5px',
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();

                        onSelectRange({
                          begin: range.begin.entryId,
                          end: range.end.entryId,
                        });
                        setRange(null);
                      }}
                    >
                      <CheckCircle />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setRange(null);
                      }}
                    >
                      <DeleteCircle />
                    </IconButton>
                  </Stack>
                ) : null}
              </Word>
            );
          })}
        </Stack>
      );

      rowData.push({
        row: rowCom,
        after: JSON.stringify({
          document_id: +documentId,
          page: tempRow.cols[0].wordEntry.page - 1,
        }),
        wordId: tempRow.cols[0].wordEntry.id,
      });
    }

    return rowData;
  }, [
    cancelTimer,
    dots,
    drawRanges,
    entriesData,
    handleWordClick,
    onSelectRange,
    onSelectingRange,
    pericope,
    range,
    rowWidth,
    startTimer,
  ]);

  return (
    <>
      <Virtuoso
        ref={virtuosoRef}
        context={{ loading }}
        endReached={loadMore}
        customScrollParent={customScrollParent}
        data={rowData}
        itemContent={(_index, data) => data.row}
        components={{ Footer }}
      />
      <div style={{ opacity: 0 }}>
        <span style={{ fontFamily: 'Poppins' }} />
      </div>
    </>
  );
}
