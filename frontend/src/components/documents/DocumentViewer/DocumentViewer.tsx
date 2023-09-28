import { useMemo } from 'react';

import {
  BaseDocumentViewer,
  BaseDocumentViewerProps,
  WordEntry,
} from '../../common/BaseDocumentViewer';

import {
  ErrorType,
  useGetDocumentWordEntriesByDocumentIdQuery,
} from '../../../generated/graphql';

type DocumentViewerProps = Omit<
  BaseDocumentViewerProps & {
    documentId: string;
  },
  'entries'
>;

export function DocumentViewer({
  documentId,
  mode,
  range,
  dots,
  onClickWord,
}: DocumentViewerProps) {
  const { data, error, loading } = useGetDocumentWordEntriesByDocumentIdQuery({
    variables: { document_id: documentId },
  });

  const entries = useMemo(() => {
    if (
      error ||
      !data ||
      data.getDocumentWordEntriesByDocumentId.error !== ErrorType.NoError
    ) {
      return [];
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
          parent_wordlike_string: word_entry!.parent_wordlike_string
            ? {
                id: word_entry!.parent_wordlike_string.wordlike_string_id,
                wordlike_string:
                  word_entry!.parent_wordlike_string.wordlike_string,
              }
            : undefined,
        }));

    const entriesMap = new Map<string, WordEntry[]>();

    for (const word_entry of word_entries) {
      const currentKey = word_entry.wordlike_string.id;
      const parentKey = word_entry?.parent_wordlike_string?.id;

      const parentEntries = parentKey ? entriesMap.get(parentKey) || [] : [];

      entriesMap.set(currentKey, [...parentEntries, word_entry]);

      if (parentKey) {
        entriesMap.delete(parentKey);
      }
    }

    const sortedEntries: WordEntry[][] = [];

    for (const entries of entriesMap.values()) {
      sortedEntries.push(entries);
    }

    if (sortedEntries.length !== 1) {
      alert('Error at fetching');
    }

    return sortedEntries.length > 0 ? sortedEntries[0] : [];
  }, [data, error]);

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
}
