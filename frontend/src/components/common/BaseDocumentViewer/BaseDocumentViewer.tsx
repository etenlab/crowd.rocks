import { useMemo, ReactNode, memo, MouseEvent } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Stack } from '@mui/material';

import { Word, Dot } from './styled';

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
};

export type BaseDocumentViewerProps = {
  entries: WordEntry[];
  mode: ViewMode;
  range: Range;
  dots: {
    entryId: string;
    component?: ReactNode;
  }[];
  onClickWord(entryId: string, index: number, e?: unknown): void;
};

const pageSize = 200;

export const BaseDocumentViewer = memo(function BaseDocumentViewerPure({
  mode,
  range,
  dots,
  onClickWord,
  entries,
}: BaseDocumentViewerProps) {
  const wordComs = useMemo(() => {
    const dotsMap = new Map<
      string,
      {
        entryId: string;
        component?: ReactNode;
      }
    >();

    dots.forEach((dot) => dotsMap.set(dot.entryId, dot));

    let begin = false;
    let end = false;

    return entries
      .map((entry, index) => {
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
        classStr += ` ${
          entry.id === range.beginEntry || entry.id === range.endEntry
            ? 'boundary'
            : ''
        }`;

        const cursor = isDot ? 'pointer' : 'default';

        if (entry.id === range.endEntry) {
          end = true;
        }

        const handleClick = (e: MouseEvent<HTMLDivElement>) => {
          if (mode === 'view' && !isDot) {
            return;
          }

          onClickWord(entry.id, index, e);
        };

        return (
          <Word
            key={entry.id}
            className={classStr}
            onClick={handleClick}
            style={{ cursor }}
          >
            {entry.wordlike_string.wordlike_string}
            {isDot ? dotCom || <Dot /> : null}
          </Word>
        );
      })
      .reduce(
        (sumOfArr: JSX.Element[][], item: JSX.Element) => {
          const sizeOfLastElement = sumOfArr[sumOfArr.length - 1].length;
          if (sizeOfLastElement < pageSize) {
            sumOfArr[sumOfArr.length - 1].push(item);
          } else {
            sumOfArr.push([item]);
          }

          return sumOfArr;
        },
        [[]],
      );
  }, [dots, entries, mode, onClickWord, range.beginEntry, range.endEntry]);

  return (
    <Virtuoso
      style={{
        height: 'calc(100vh - 160px)',
      }}
      data={wordComs}
      itemContent={(_index, com) => (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={(theme) => ({ flexWrap: 'wrap', color: theme.palette.text.gray })}
        >
          {com}
        </Stack>
      )}
    />
  );
});
