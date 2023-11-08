import {
  useMemo,
  ReactNode,
  memo,
  MouseEvent,
  useState,
  useEffect,
} from 'react';
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

export const BaseDocumentViewer = memo(function BaseDocumentViewerPure({
  mode,
  range,
  dots,
  onClickWord,
  entries,
}: BaseDocumentViewerProps) {
  const [rowWidth, setRowWidth] = useState<number>(0);

  useEffect(() => {
    window.addEventListener(
      'resize',
      function () {
        setRowWidth(Math.min(window.screen.width - 32, 777 - 32));
      },
      true,
    );

    setRowWidth(window.screen.width - 32);
  }, []);

  const rows = useMemo(() => {
    const rows: JSX.Element[][] = [];
    const tempRow: {
      cols: JSX.Element[];
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
      return rows;
    }

    const fontSize = 14;
    const fontWeight = 400;
    const fontFamily = 'Poppins';
    const padding = 6;
    const letterSpacing = -0.28;

    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    let begin = false;
    let end = false;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

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

        onClickWord(entry.id, i, e);
      };

      const wordlikeString = entry.wordlike_string.wordlike_string;

      const wordCom = (
        <Word
          key={entry.id}
          className={classStr}
          onClick={handleClick}
          style={{ cursor }}
        >
          {wordlikeString}
          {isDot ? dotCom || <Dot /> : null}
        </Word>
      );

      const wordWidth = Math.ceil(
        context.measureText(wordlikeString).width +
          letterSpacing * (wordlikeString.length - 1) +
          padding,
      );

      if (tempRow.width + wordWidth < rowWidth) {
        tempRow.cols.push(wordCom);
        tempRow.width = tempRow.width + wordWidth;
      } else {
        rows.push([...tempRow.cols]);
        tempRow.cols = [wordCom];
        tempRow.width = wordWidth;
      }
    }

    if (tempRow.cols.length) {
      rows.push(tempRow.cols);
    }

    return rows;
  }, [dots, entries, mode, onClickWord, range, rowWidth]);

  return (
    <Virtuoso
      style={{ height: 'calc(100vh - 160px)' }}
      data={rows}
      itemContent={(_index, row) => (
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={(theme) => ({
            color: theme.palette.text.gray,
          })}
        >
          {row}
        </Stack>
      )}
    />
  );
});
