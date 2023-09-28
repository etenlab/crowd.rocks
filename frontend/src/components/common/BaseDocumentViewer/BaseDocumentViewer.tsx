import { useMemo, ReactNode, Fragment } from 'react';

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
  parent_wordlike_string?: WordlikeString;
};

export type BaseDocumentViewerProps = {
  entries: WordEntry[];
  mode: ViewMode;
  range: Range;
  dots: {
    entryId: string;
    component?: ReactNode;
  }[];
  onClickWord(entryId: string, index: number): void;
};

export function BaseDocumentViewer({
  entries,
  mode,
  range,
  dots,
  onClickWord,
}: BaseDocumentViewerProps) {
  const com = useMemo(() => {
    const dotsMap = new Map<string, number>();

    dots.forEach((dot, index) => dotsMap.set(dot.entryId, index));

    let begin = false;
    let end = false;

    return entries.map((entry, index) => {
      if (entry.id === range.beginEntry) {
        begin = true;
      }

      if (entry.id === range.endEntry) {
        end = true;
      }

      const dotIndex = dotsMap.get(entry.id) || null;
      const isDot = dotIndex ? true : false;
      const dotCom = dotIndex ? dots[dotIndex].component : null;

      if (begin && !end) {
        return (
          <Fragment key={entry.id}>
            <Word
              onClick={() => mode === 'edit' || onClickWord(entry.id, index)}
            />
            {isDot
              ? dotCom || <Dot onClick={() => onClickWord(entry.id, index)} />
              : null}
          </Fragment>
        );
      }
    });
  }, [dots, entries, mode, onClickWord, range.beginEntry, range.endEntry]);

  return <>{com}</>;
}
