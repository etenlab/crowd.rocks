import { useMemo, ReactNode, memo } from 'react';
import { Word, Dot, Container } from './styled';

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
  entries,
  mode,
  range,
  dots,
  onClickWord,
}: BaseDocumentViewerProps) {
  const com = useMemo(() => {
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

    return entries.map((entry, index) => {
      if (entry.id === range.beginEntry) {
        begin = true;
      }

      const dot = dotsMap.get(entry.id) || null;
      const isDot = dot ? true : false;
      const dotCom = dot ? dot.component : null;

      const color =
        (begin && !end && range.endEntry) ||
        entry.id === range.beginEntry ||
        entry.id === range.endEntry
          ? 'red'
          : 'black';

      const cursor = isDot ? 'pointer' : 'default';

      if (entry.id === range.endEntry) {
        end = true;
      }

      return (
        <Word
          key={entry.id}
          className={`${mode}`}
          onClick={(e) =>
            mode === 'view'
              ? isDot
                ? onClickWord(entry.id, index, e)
                : null
              : onClickWord(entry.id, index)
          }
          style={{ color, cursor }}
        >
          {entry.wordlike_string.wordlike_string}
          {isDot ? dotCom || <Dot /> : null}
        </Word>
      );
    });
  }, [dots, entries, mode, onClickWord, range.beginEntry, range.endEntry]);

  return <Container>{com}</Container>;
});
