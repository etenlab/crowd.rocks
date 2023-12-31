import {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
  ReactNode,
  MouseEvent,
} from 'react';
import { Stack } from '@mui/material';
import { Virtuoso, ListRange, VirtuosoHandle } from 'react-virtuoso';

import { Dot, Word } from './styled';
import { SkeletonRow } from './SkeletonRow';

import { useGetDocumentWordEntriesByDocumentIdLazyQuery } from '../../../generated/graphql';

const DOCUMENT_PAGE_REMEMBER = 'DOCUMENT_PAGE_REMEMBER';

export type TempPage = {
  id: string;
  first: number;
  after: string | null;
};

export type ViewMode = 'edit' | 'view';

export type Range = {
  beginEntry?: string;
  endEntry?: string;
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

export type DocumentViewerProps = {
  mode: ViewMode;
  range: Range;
  dots: {
    entryId: string;
    component?: ReactNode;
  }[];
  onClickWord(
    entryId: string,
    order: number,
    e: MouseEvent<HTMLDivElement>,
  ): void;
  documentId: string;
  onChangeRange(sentence: string): void;
  onLoadPage?(tempPage: TempPage): void;
  customScrollParent?: HTMLElement;
};

export function DocumentViewer({
  documentId,
  mode,
  range,
  dots,
  onClickWord,
  onChangeRange,
  onLoadPage,
  customScrollParent,
}: DocumentViewerProps) {
  const [getDocumentWordEntriesByDocumentId] =
    useGetDocumentWordEntriesByDocumentIdLazyQuery();

  const [entriesData, setEntriesData] = useState<(TempPage | WordEntry[])[]>(
    [],
  );
  const [rowWidth, setRowWidth] = useState<number>(0);
  const [requiredPage, setRequiredPage] = useState<TempPage | null>(null);
  const [rememberedPage, setRememberedPage] = useState<{
    after: string | null;
    wordId: string | null;
  } | null>(null);
  const [viewInitialIndex, setViewInitialIndex] = useState<number | null>(null);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const calcRowWidth = useCallback(() => {
    const bodyWidth = document.body.offsetWidth;

    setRowWidth(Math.min(bodyWidth - 32, 777 - 32));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', calcRowWidth);
    calcRowWidth();
  }, [calcRowWidth]);

  useEffect(() => {
    if (rememberedPage && viewInitialIndex !== null && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: viewInitialIndex,
        align: 'start',
        behavior: 'auto',
      });
      setViewInitialIndex(null);
      setRememberedPage(null);
    }
  }, [rememberedPage, viewInitialIndex]);

  useEffect(() => {
    if (!customScrollParent) {
      return;
    }

    const previousData = localStorage.getItem(DOCUMENT_PAGE_REMEMBER);

    const after =
      previousData && JSON.parse(previousData)[`document_id:${documentId}`]
        ? JSON.parse(previousData)[`document_id:${documentId}`].after
        : null;

    const wordId =
      previousData && JSON.parse(previousData)[`document_id:${documentId}`]
        ? JSON.parse(previousData)[`document_id:${documentId}`].wordId
        : null;

    if (wordId) {
      setRememberedPage({ after, wordId });
      setTimeout(
        () =>
          setRequiredPage({
            id: `page_${JSON.parse(after).page + 1}`,
            after: after,
            first: 1,
          }),
        1000,
      );
    }
  }, [customScrollParent, documentId]);

  useEffect(() => {
    (async () => {
      const firstPage = await getDocumentWordEntriesByDocumentId({
        variables: {
          document_id: documentId,
          first: 1,
          after: null,
        },
      });

      const totalPages =
        firstPage.data?.getDocumentWordEntriesByDocumentId.pageInfo
          .totalEdges || 0;

      const pageEntriesData: TempPage[] = [];

      for (let i = 0; i < totalPages; i++) {
        pageEntriesData.push({
          id: `page_${i + 1}`,
          after: JSON.stringify({ document_id: +documentId, page: i }),
          first: 1,
        });
      }

      setEntriesData(pageEntriesData);
    })();
  }, [documentId, getDocumentWordEntriesByDocumentId]);

  const fetchMore = useCallback(
    async (page: TempPage) => {
      const { data } = await getDocumentWordEntriesByDocumentId({
        variables: {
          document_id: documentId,
          first: page.first,
          after: page.after,
        },
      });

      if (!data) {
        return;
      }

      const word_entries: WordEntry[] = [];
      data.getDocumentWordEntriesByDocumentId.edges.forEach((edge) => {
        edge.node.forEach((item) =>
          word_entries.push({
            id: item.document_word_entry_id,
            wordlike_string: {
              id: item.wordlike_string.wordlike_string_id,
              wordlike_string: item.wordlike_string.wordlike_string,
            },
            parent_id: item.parent_document_word_entry_id || undefined,
            page: item.page,
          }),
        );
      });

      setEntriesData((data) => {
        const refactoredData: (WordEntry[] | TempPage)[] = [];

        data
          .map((item) => {
            if (
              !Array.isArray(item) &&
              item.after === page.after &&
              item.first === page.first
            ) {
              return word_entries;
            } else {
              return item;
            }
          })
          .forEach((item) => {
            if (refactoredData.length === 0) {
              refactoredData.push(item);
              return;
            }

            const lastItem = refactoredData[refactoredData.length - 1];

            if (!Array.isArray(item) || !Array.isArray(lastItem)) {
              refactoredData.push(item);
              return;
            }

            lastItem.push(...item);

            return;
          }, []);

        return refactoredData;
      });
    },
    [documentId, getDocumentWordEntriesByDocumentId],
  );

  useEffect(() => {
    let sentence: string = '';
    let start = false;

    if (range.beginEntry && range.endEntry && entriesData.length > 0) {
      for (const data of entriesData) {
        if (!Array.isArray(data)) {
          if (start) {
            sentence = `${sentence} ... `;
          }
          continue;
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].id === range.beginEntry) {
            start = true;
          }

          if (start) {
            sentence = `${sentence} ${data[i].wordlike_string.wordlike_string}`;
          }

          if (data[i].id === range.endEntry) {
            start = false;
            onChangeRange(sentence);
            return;
          }
        }
      }
    }
  }, [entriesData, onChangeRange, range.beginEntry, range.endEntry]);

  useEffect(() => {
    if (!requiredPage) {
      return;
    }

    const timer = setTimeout(() => {
      fetchMore(requiredPage);
      onLoadPage && onLoadPage(requiredPage);
    }, 500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [fetchMore, requiredPage, onLoadPage]);

  const handleLoading = useCallback((tempPage: TempPage) => {
    setRequiredPage(tempPage);
  }, []);

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

    const fontSize = 14;
    const fontWeight = 400;
    const fontFamily = 'Poppins';
    const padding = 6;

    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    let begin = false;
    let end = false;
    let wordCounter = 0;

    const getWordProps = (entry: WordEntry, order: number, padding: string) => {
      if (entry.id === range.beginEntry) {
        begin = true;
      }

      const dot = dotsMap.get(entry.id) || null;
      const isDot = dot ? true : false;
      const dotCom = dot ? dot.component : null;

      let classStr = `${mode} `;
      classStr +=
        (begin && !end && range.endEntry) ||
        entry.id === range.beginEntry ||
        entry.id === range.endEntry
          ? 'selected'
          : '';
      classStr += ` ${entry.id === range.beginEntry ? 'left-boundary' : ''}`;
      classStr += ` ${entry.id === range.endEntry ? 'right-boundary' : ''}`;

      const cursor = isDot ? 'pointer' : 'default';

      if (entry.id === range.endEntry) {
        end = true;
      }

      const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (mode === 'view' && !isDot) {
          return;
        }

        onClickWord(entry.id, order, e);
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

    for (const data of entriesData) {
      if (!Array.isArray(data)) {
        for (let i = 0; i < 60; i++) {
          const skeletonCom = (
            <SkeletonRow tempPage={data} onLoading={handleLoading} />
          );

          rowData.push({
            row: skeletonCom,
            after: data.after,
            wordId: null,
          });
        }
        continue;
      }

      const entries: WordEntry[] = data;

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (rememberedPage && entry.id === rememberedPage.wordId) {
          setViewInitialIndex(rowData.length);
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
                    3 +
                    (rowWidth - tempRow.width - 35) / tempRow.cols.length / 2
                  }px`,
                );

                return (
                  <Word
                    key={col.wordEntry.id}
                    sx={sx}
                    className={classStr}
                    onClick={handleClick}
                  >
                    {wordlikeString}
                    {isDot ? dotCom || <Dot /> : null}
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

        wordCounter++;
      }
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
              >
                {wordlikeString}
                {isDot ? dotCom || <Dot /> : null}
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
    documentId,
    dots,
    entriesData,
    handleLoading,
    mode,
    onClickWord,
    range.beginEntry,
    range.endEntry,
    rememberedPage,
    rowWidth,
  ]);

  const handleRangeChanged = useCallback(
    (range: ListRange) => {
      if (!rowData[range.startIndex].wordId || !customScrollParent) {
        return;
      }

      const previousData = localStorage.getItem(DOCUMENT_PAGE_REMEMBER);

      if (!previousData) {
        localStorage.setItem(
          DOCUMENT_PAGE_REMEMBER,
          JSON.stringify({
            [`document_id:${documentId}`]: {
              after: rowData[range.startIndex].after,
              wordId: rowData[range.startIndex].wordId,
            },
          }),
        );
      } else {
        const data = JSON.parse(previousData);

        localStorage.setItem(
          DOCUMENT_PAGE_REMEMBER,
          JSON.stringify({
            ...data,
            [`document_id:${documentId}`]: {
              after: rowData[range.startIndex].after,
              wordId: rowData[range.startIndex].wordId,
            },
          }),
        );
      }
    },
    [customScrollParent, documentId, rowData],
  );

  return (
    <>
      <Virtuoso
        ref={virtuosoRef}
        rangeChanged={handleRangeChanged}
        customScrollParent={customScrollParent}
        data={rowData}
        itemContent={(_index, data) => data.row}
      />
      <div style={{ opacity: 0 }}>
        <span style={{ fontFamily: 'Poppins' }} />
      </div>
    </>
  );
}
