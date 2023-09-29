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

export type DocumentViewerProps = Omit<
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
      console.log(sortedEntries);
      // alert('Error at fetching');
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
