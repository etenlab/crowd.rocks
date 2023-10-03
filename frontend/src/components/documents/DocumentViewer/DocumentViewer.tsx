import { useMemo, memo, useEffect } from 'react';

import {
  BaseDocumentViewer,
  BaseDocumentViewerProps,
  WordEntry,
} from '../../common/BaseDocumentViewer';

import {
  ErrorType,
  useGetDocumentWordEntriesByDocumentIdQuery,
} from '../../../generated/graphql';

export type DocumentViewerProps = Omit<
  BaseDocumentViewerProps & {
    documentId: string;
    onChangeRange(sentence: string): void;
  },
  'entries'
>;

export const DocumentViewer = memo(function DocumentViewerPure({
  documentId,
  mode,
  range,
  dots,
  onClickWord,
  onChangeRange,
}: DocumentViewerProps) {
  const { data, error, loading } = useGetDocumentWordEntriesByDocumentIdQuery({
    variables: { document_id: documentId },
  });

  const { entries, sentence } = useMemo(() => {
    if (
      error ||
      !data ||
      data.getDocumentWordEntriesByDocumentId.error !== ErrorType.NoError
    ) {
      return {
        entries: [],
        sentence: '',
      };
    }

    const word_entries =
      data.getDocumentWordEntriesByDocumentId.document_word_entries
        .filter((word_entry) => word_entry)
        .map((word_entry) => ({
          id: word_entry!.document_word_entry_id,
          wordlike_string: {
            id: word_entry!.wordlike_string.wordlike_string_id,
            wordlike_string: word_entry!.wordlike_string.wordlike_string,
          },
          parent_document_word_entry_id:
            word_entry!.parent_document_word_entry_id,
        }));

    const entriesMap = new Map<string, WordEntry>();
    const childrenMap = new Map<string, string>();
    const rootIds: string[] = [];

    for (const word_entry of word_entries) {
      entriesMap.set(word_entry.id, word_entry);

      if (word_entry.parent_document_word_entry_id) {
        childrenMap.set(
          word_entry.parent_document_word_entry_id,
          word_entry.id,
        );
      } else {
        rootIds.push(word_entry.id);
      }
    }

    for (const parentId of childrenMap.keys()) {
      if (entriesMap.get(parentId)) {
        continue;
      }

      rootIds.push(childrenMap.get(parentId)!);
    }

    const sortedEntries: WordEntry[][] = [];

    for (const root of rootIds) {
      const tempEntries: WordEntry[] = [];

      let cur: string | undefined = root;

      while (cur) {
        tempEntries.push(entriesMap.get(cur)!);
        cur = childrenMap.get(cur);
      }

      sortedEntries.push(tempEntries);
    }

    if (sortedEntries.length !== 1) {
      alert('Error at fetching');
    }

    let sentence: string = '';
    let start = false;

    if (range.beginEntry && range.endEntry && sortedEntries.length > 0) {
      for (let i = 0; i < sortedEntries[0].length; i++) {
        if (sortedEntries[0][i].id === range.beginEntry) {
          start = true;
        }

        if (start) {
          sentence = `${sentence} ${sortedEntries[0][i].wordlike_string.wordlike_string}`;
        }

        if (sortedEntries[0][i].id === range.endEntry) {
          start = false;
        }
      }
    }

    return {
      entries: sortedEntries.length > 0 ? sortedEntries[0] : [],
      sentence,
    };
  }, [data, error, range.beginEntry, range.endEntry]);

  useEffect(() => {
    onChangeRange(sentence);
  }, [onChangeRange, sentence]);

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <BaseDocumentViewer
      mode={mode}
      entries={entries}
      range={range}
      dots={dots}
      onClickWord={onClickWord}
    />
  );
});
