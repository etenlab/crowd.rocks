import { useMemo, ReactNode, Fragment } from 'react';

import { Word, Dot } from './styled';

type WordlikeString = {
  id: string;
  wordlike_string: string;
};

type WordEntry = {
  id: string;
  wordlike_string: WordlikeString;
  parent_wordlike_string: WordlikeString;
};

type ViewerProps = {
  entries: WordEntry[];
  mode: 'edit' | 'view';
  range: {
    beginEntry?: string;
    endEntry?: string;
  };
  dots: {
    entry: string;
    component?: ReactNode;
  }[];
  onClickWord(entryId: string): void;
};

export function DocumentViewer({
  entries,
  mode,
  range,
  dots,
  onClickWord,
}: ViewerProps) {
  const com = useMemo(() => {
    const dotsMap = new Map<string, number>();

    dots.forEach((dot, index) => dotsMap.set(dot.entry, index));

    let begin = false;
    let end = false;

    return entries.map((entry) => {
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
            <Word onClick={() => mode === 'edit' || onClickWord(entry.id)} />
            {isDot
              ? dotCom || <Dot onClick={() => onClickWord(entry.id)} />
              : null}
          </Fragment>
        );
      }
    });
  }, [dots, entries, mode, onClickWord, range.beginEntry, range.endEntry]);

  return <>{com}</>;
}
